function formatToolInputForPrompt(input: unknown): string {
  try {
    const seen = new WeakSet<object>();
    const json = JSON.stringify(
      input,
      (_key, value: unknown) => {
        if (typeof value === "bigint") return `${value.toString()}n`;
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) return "[Circular]";
          seen.add(value);
        }
        return value;
      },
      2,
    );
    return json ?? String(input);
  } catch {
    return String(input);
  }
}

export function formatToolCallForPrompt(toolName: string, input: unknown): string {
  const sections = [`Tool call:\nTool: ${toolName}`];

  if (toolName === "bash" && typeof input === "object" && input !== null && "command" in input) {
    const command = (input as { command?: unknown }).command;
    if (typeof command === "string") sections.push(`Command:\n${command}`);
  }

  sections.push(`Input:\n${formatToolInputForPrompt(input)}`);
  return sections.join("\n\n");
}
