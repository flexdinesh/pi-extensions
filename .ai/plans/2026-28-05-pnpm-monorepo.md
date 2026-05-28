# Plan: Convert `pi-extensions` into a pnpm monorepo

## Summary

Set up this empty repo as a pnpm monorepo for Pi extensions, then port the code from `../pi-mode-guard` and `../pi-session-timer` into `packages/extensions/*` without preserving git history or deleting the original repos.

## Key implementation changes

1. **Create monorepo root files**
   - `package.json`
     - name: `@flexdinesh/pi-extensions`
     - `private: true`
     - `packageManager: "pnpm@11.1.2"`
     - workspace config for `packages/extensions/*`
     - root `pi.extensions` pointing to `./packages/extensions/*/index.ts`
     - scripts:
       - `test`: `pnpm -r --if-present run test`
   - `pnpm-workspace.yaml`
   - `.gitignore`
   - root `README.md`
   - `docs/extension-conventions.md`

2. **Port `pi-mode-guard`**
   - Copy code into `packages/extensions/pi-mode-guard/`
   - Use package name `@flexdinesh/pi-mode-guard`
   - Preserve:
     - source files
     - tests
     - README
     - `docs/decision-log`
     - `.ai/spec`
     - `.ai/plans`
   - Update README install paths to monorepo paths.
   - Keep `pi.extensions: ["./index.ts"]`.
   - Keep Pi packages as peer deps with `"*"`.

3. **Port `pi-session-timer`**
   - Copy code into `packages/extensions/pi-session-timer/`
   - Add package manifest:
     - name: `@flexdinesh/pi-session-timer`
     - `type: "module"`
     - keywords: `pi-package`, `pi-extension`
     - `pi.extensions: ["./index.ts"]`
     - peer dependency on `@earendil-works/pi-coding-agent`
   - Update import from old `@mariozechner/pi-coding-agent` to `@earendil-works/pi-coding-agent`.
   - Update README install paths and Pi link.

4. **Install / lockfile**
   - Add workspace pnpm config with explicit `allowBuilds` entries for currently resolved transitive Pi packages so installs do not require an interactive `pnpm approve-builds` step.
   - Run `pnpm install` to create/update `pnpm-lock.yaml`.

## Tests / verification

Run:

```bash
pnpm -r --if-present run test
```

Expected:
- `@flexdinesh/pi-mode-guard` tests pass.
- `@flexdinesh/pi-session-timer` has no test script and is skipped.
- Root manifests and package manifests expose Pi extensions correctly.

## Decisions made

- Do not preserve git history.
- Do not delete the original sibling repos.
- Move `.ai/spec` and `.ai/plans` from `pi-mode-guard`.
- Use scoped package names:
  - `@flexdinesh/pi-extensions`
  - `@flexdinesh/pi-mode-guard`
  - `@flexdinesh/pi-session-timer`

## Tradeoffs / risks

- Simple copy means standalone repo history is not preserved in this monorepo.
- Root `pi.extensions` loading all `packages/extensions/*/index.ts` is convenient, but installing the root package loads all extensions together unless filtered in Pi settings.
- `pi-session-timer` import migration assumes current Pi namespace only, matching latest docs and mode-guard conventions.
- Explicit `allowBuilds` entries keep install non-interactive while denying transitive build scripts for `@google/genai` and `protobufjs`.

## Remaining open questions

None.

## Execution guidance

If execution deviates from this approved plan, the saved plan file must be updated to reflect the latest approved plan, and the deviation must be surfaced to the user before continuing.
