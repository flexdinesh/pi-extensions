import assert from "node:assert/strict";
import test from "node:test";
import { formatToolCallForPrompt } from "./prompt.ts";

test("bash permission prompt includes command and full input", () => {
  const prompt = formatToolCallForPrompt("bash", {
    command: "pnpm --filter @flexdinesh/pi-mode-guard test",
    timeout: 120,
  });

  assert.match(prompt, /^Tool call:\nTool: bash/);
  assert.match(prompt, /Command:\npnpm --filter @flexdinesh\/pi-mode-guard test/);
  assert.match(prompt, /Input:\n\{/);
  assert.match(prompt, /"command": "pnpm --filter @flexdinesh\/pi-mode-guard test"/);
  assert.match(prompt, /"timeout": 120/);
});

test("non-bash permission prompt includes pretty-printed input", () => {
  const prompt = formatToolCallForPrompt("read", {
    path: "$HOME/.ssh/config",
    offset: 1,
    limit: 20,
  });

  assert.match(prompt, /^Tool call:\nTool: read/);
  assert.doesNotMatch(prompt, /Command:/);
  assert.match(prompt, /Input:\n\{/);
  assert.match(prompt, /"path": "\$HOME\/\.ssh\/config"/);
  assert.match(prompt, /"offset": 1/);
  assert.match(prompt, /"limit": 20/);
});
