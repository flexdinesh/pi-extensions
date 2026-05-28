# Extension Conventions

This repository follows the latest Pi extension and package conventions.

## Package shape

Each extension lives under `packages/extensions/<extension-name>` and should be a Pi package with a local `package.json`:

```json
{
  "name": "@flexdinesh/pi-example",
  "type": "module",
  "keywords": ["pi-package", "pi-extension"],
  "pi": {
    "extensions": ["./index.ts"]
  }
}
```

The monorepo root also exposes all extensions through:

```json
{
  "pi": {
    "extensions": ["./packages/extensions/*/index.ts"]
  }
}
```

Installing the root package loads all extensions. Install or reference an individual package path when you only want one extension.

## Dependencies

Pi core packages are provided by Pi and should be declared as peers with a `"*"` range instead of bundled:

- `@earendil-works/pi-coding-agent`
- `@earendil-works/pi-ai`
- `@earendil-works/pi-agent-core`
- `@earendil-works/pi-tui`
- `typebox`

Runtime dependencies that are not Pi core packages belong in `dependencies`.

Use the current `@earendil-works/*` namespace for Pi imports. Do not add compatibility shims for old package namespaces unless a specific extension deliberately supports old Pi versions.

## Source format

- TypeScript source is loaded directly by Pi through jiti, so extensions do not need a build step by default.
- Prefer a directory package with `index.ts` for multi-file extensions.
- Keep extension behavior documented in the package README.

## Runtime behavior

- Use documented Pi APIs such as `pi.on`, `pi.registerTool`, `pi.registerCommand`, `pi.registerShortcut`, and `ctx.ui`.
- Use `isToolCallEventType()` when inspecting built-in tool inputs in `tool_call` handlers.
- For policy reminders that should not persist into session history, mutate `event.systemPrompt` in `before_agent_start` instead of injecting hidden messages.
- In non-interactive/no-UI modes, fail closed for actions that require confirmation.

## Tests and decisions

- Prefer Node's built-in test runner for lightweight extension tests.
- Use `pnpm -r --if-present run test` from the root.
- Preserve durable decisions in `docs/decision-log/` inside the relevant package.
- Historical plans/specs may live under package-local `.ai/` directories when they are useful context for future work.
