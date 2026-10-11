# Contributing

t0code is maintained by [Alisha Karma (@codealisha99)](https://github.com/codealisha99).
The project is early and is not broadly soliciting contributions. Open an issue
before starting substantial work so proposed changes can be checked against the
project's direction.

## Good fits for this project

Focused fixes for bugs, reliability, performance, accessibility, and
documentation are the most useful contributions. Include the problem being
solved and the behavior you verified. For user interface changes, include
before and after screenshots when possible.

Large features and architectural changes need prior discussion. Review capacity
is limited, so an issue or pull request may be deferred or closed without being
accepted.

## Development checks

Use the repository's Bun scripts:

```bash
bun fmt
bun lint
bun typecheck
bun run test
```

Do not use `bun test`; the workspace test script runs Vitest through Turbo.
Mention any checks you could not run in your pull request.

## Contact

- Issues and pull requests: [github.com/codealisha99/t0code](https://github.com/codealisha99/t0code)
- Maintainer: [Alisha Karma](https://alishakarma.com)
- Email: [lishykarma99@gmail.com](mailto:lishykarma99@gmail.com)
