import { describe, expect, it } from "vitest";

import {
  cloneDirectoryNameFromSource,
  isRemoteUrlLike,
  parseCloneCommandArgs,
  parsePublishCommandArgs,
} from "./sourceControlCommands";

describe("parsePublishCommandArgs", () => {
  it("parses owner/repo with optional flags", () => {
    expect(
      parsePublishCommandArgs("acme/app public https provider=gitlab remote=upstream"),
    ).toEqual({
      provider: "gitlab",
      repository: "acme/app",
      visibility: "public",
      protocol: "https",
      remoteName: "upstream",
    });
  });

  it("rejects missing owner/repo", () => {
    expect(parsePublishCommandArgs("just-a-name")).toBeNull();
  });
});

describe("parseCloneCommandArgs", () => {
  it("clones a github slug into the default parent", () => {
    expect(parseCloneCommandArgs("acme/app", "/src")).toEqual({
      destinationPath: "/src/app",
      provider: "github",
      repository: "acme/app",
    });
  });

  it("treats git urls as remote clones", () => {
    expect(parseCloneCommandArgs("git@github.com:acme/app.git /tmp/app", "/src")).toEqual({
      destinationPath: "/tmp/app",
      remoteUrl: "git@github.com:acme/app.git",
    });
  });
});

describe("cloneDirectoryNameFromSource", () => {
  it("strips .git and trailing slashes", () => {
    expect(cloneDirectoryNameFromSource("https://github.com/acme/app.git/")).toBe("app");
  });
});

describe("isRemoteUrlLike", () => {
  it("detects scp-style git remotes", () => {
    expect(isRemoteUrlLike("git@github.com:acme/app.git")).toBe(true);
    expect(isRemoteUrlLike("acme/app")).toBe(false);
  });
});
