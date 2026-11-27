addEventListener("message", (event: MessageEvent<{
  pattern: string;
  source: string;
  global: boolean;
  insensitive: boolean;
}>) => {
  const { pattern, source, global, insensitive } = event.data;
  try {
    const expression = new RegExp(pattern, (global ? "g" : "") + (insensitive ? "i" : ""));
    const matches = global ? Array.from(source.matchAll(expression), (match) => match[0]) : (expression.exec(source) ?? []).slice(0, 1);
    postMessage({ matches, error: "" });
  } catch (cause) {
    postMessage({ matches: [], error: cause instanceof Error ? cause.message : "正则表达式无效" });
  }
});
