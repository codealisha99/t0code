import { WS_CHANNELS } from "@t3tools/contracts";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { WsTransport } from "./wsTransport";

type WsEventType = "open" | "message" | "close" | "error";
type WsListener = (event?: { data?: unknown; type?: string }) => void;

const sockets: MockWebSocket[] = [];

class MockWebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  readyState = MockWebSocket.CONNECTING;
  readonly sent: string[] = [];
  private readonly listeners = new Map<WsEventType, Set<WsListener>>();

  constructor(_url: string) {
    sockets.push(this);
  }

  addEventListener(type: WsEventType, listener: WsListener) {
    const listeners = this.listeners.get(type) ?? new Set<WsListener>();
    listeners.add(listener);
    this.listeners.set(type, listeners);
  }

  send(data: string) {
    this.sent.push(data);
  }

  close() {
    this.readyState = MockWebSocket.CLOSED;
    this.emit("close");
  }

  open() {
    this.readyState = MockWebSocket.OPEN;
    this.emit("open");
  }

  serverMessage(data: unknown) {
    this.emit("message", { data });
  }

  emitError() {
    this.emit("error", { type: "error" });
  }

  private emit(type: WsEventType, event?: { data?: unknown; type?: string }) {
    const listeners = this.listeners.get(type);
    if (!listeners) return;
    for (const listener of listeners) {
      listener(event);
    }
  }
}

beforeEach(() => {
  sockets.length = 0;
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("WsTransport reconnect", () => {
  function createTransport() {
    return new WsTransport({
      url: "ws://localhost:3020",
      WebSocketCtor: MockWebSocket as unknown as typeof WebSocket,
    });
  }

  it("never sends an expired queued command when the socket opens", async () => {
    const transport = createTransport();
    const expired = expect(
      transport.request("thread.turn.start", {}, { timeoutMs: 10 }),
    ).rejects.toThrow("Request timed out");
    const live = transport.request("projects.list");

    await vi.advanceTimersByTimeAsync(10);
    await expired;
    sockets[0]?.open();

    expect(sockets[0]?.sent).toHaveLength(1);
    const envelope = JSON.parse(sockets[0]!.sent[0]!) as { id: string; body: { _tag: string } };
    expect(envelope.body._tag).toBe("projects.list");
    sockets[0]?.serverMessage(JSON.stringify({ id: envelope.id, result: [] }));
    await expect(live).resolves.toEqual([]);
    transport.dispose();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("rejects new requests immediately after disposal, even without a timeout", async () => {
    const transport = createTransport();
    transport.dispose();

    await expect(transport.request("projects.list", {}, { timeoutMs: null })).rejects.toThrow(
      "Transport disposed",
    );
    expect(vi.getTimerCount()).toBe(0);
    expect(sockets[0]?.sent).toEqual([]);
  });

  it.each([false, true])("cleans up failed sends (queued: %s)", async (queued) => {
    const transport = createTransport();
    const socket = sockets[0]!;
    vi.spyOn(socket, "send").mockImplementationOnce(() => {
      throw new Error("socket write failed");
    });
    if (!queued) socket.open();
    const failed = expect(transport.request("thread.turn.start")).rejects.toThrow(
      "socket write failed",
    );
    if (queued) socket.open();
    await failed;
    expect(vi.getTimerCount()).toBe(0);

    const next = transport.request("projects.list");
    const envelope = JSON.parse(socket.sent[0]!) as { id: string };
    socket.serverMessage(JSON.stringify({ id: envelope.id, result: [] }));
    await expect(next).resolves.toEqual([]);
    transport.dispose();
  });

  it("rejects pending requests on disconnect without replaying them on reconnect", async () => {
    const transport = createTransport();
    sockets[0]?.open();
    const failed = expect(transport.request("thread.turn.start")).rejects.toThrow(
      "WebSocket connection closed",
    );
    sockets[0]?.close();
    await failed;
    await vi.advanceTimersByTimeAsync(500);
    sockets[1]?.open();
    expect(sockets[1]?.sent).toEqual([]);
    transport.dispose();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("reconnects after close and accepts new requests", async () => {
    const transport = new WsTransport({
      url: "ws://localhost:3020",
      WebSocketCtor: MockWebSocket as unknown as typeof WebSocket,
    });
    sockets[0]?.open();

    sockets[0]?.close();
    await vi.advanceTimersByTimeAsync(500);

    expect(sockets).toHaveLength(2);
    sockets[1]?.open();

    const requestPromise = transport.request("projects.list");
    const sent = sockets[1]?.sent.at(-1);
    const requestEnvelope = JSON.parse(sent ?? "{}") as { id: string };
    sockets[1]?.serverMessage(
      JSON.stringify({
        id: requestEnvelope.id,
        result: { projects: [] },
      }),
    );

    await expect(requestPromise).resolves.toEqual({ projects: [] });
    expect(transport.getState()).toBe("open");

    transport.dispose();
  });

  it("replays the latest push to new subscribers", () => {
    const transport = new WsTransport({
      url: "ws://localhost:3020",
      WebSocketCtor: MockWebSocket as unknown as typeof WebSocket,
    });
    sockets[0]?.open();
    sockets[0]?.serverMessage(
      JSON.stringify({
        type: "push",
        sequence: 1,
        channel: WS_CHANNELS.serverConfigUpdated,
        data: { issues: [], providers: [] },
      }),
    );

    const listener = vi.fn();
    transport.subscribe(WS_CHANNELS.serverConfigUpdated, listener, { replayLatest: true });

    expect(listener).toHaveBeenCalledTimes(1);
    transport.dispose();
  });
});
