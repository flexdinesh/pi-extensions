# Pi Extensions

Central pnpm monorepo for my [Pi](https://github.com/earendil-works/pi) extensions.

## Packages

| Package | Description |
| --- | --- |
| [`@flexdinesh/pi-mode-guard`](packages/extensions/pi-mode-guard) | Three-mode workflow guard for Pi: conversation, plan, and build. |
| [`@flexdinesh/pi-session-timer`](packages/extensions/pi-session-timer) | Session elapsed-time status indicator that pauses when Pi is idle. |

## Install all extensions locally

From another checkout or Pi settings, install this repository as a local Pi package:

```bash
pi install /Users/dineshpandiyan/workspace/pi-extensions
```

The root package exposes every extension under `packages/extensions/*/index.ts`.

For development, you can also run Pi with a specific extension path:

```bash
pi -e ./packages/extensions/pi-mode-guard/index.ts
pi -e ./packages/extensions/pi-session-timer/index.ts
```

## Development

Install workspace dependencies:

```bash
pnpm install
```

Run package tests:

```bash
pnpm test
```

## Conventions

See [`docs/extension-conventions.md`](docs/extension-conventions.md) for packaging and implementation rules used across extensions.
