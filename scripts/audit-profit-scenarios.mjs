import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";

// Execute the actual domain engine without adding a runtime TypeScript dependency.
// This is a research audit: expected values are independent synthetic scenarios.
const engineUrl = new URL("../src/domain/profit/calculate.ts", import.meta.url);
const source = readFileSync(engineUrl, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { calculateProfit, DEFAULT_PROFIT_INPUT } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);
const casesUrl = new URL("../doc/research/profit-scenarios.json", import.meta.url);
const cases = JSON.parse(readFileSync(casesUrl, "utf8"));
const zeroInput = Object.fromEntries(
  Object.entries(DEFAULT_PROFIT_INPUT).map(([key, value]) => [
    key,
    typeof value === "number" ? 0 : value,
  ]),
);
const rows = cases.map((scenario) => {
  const result = calculateProfit({
    ...zeroInput,
    calculationMode: "professional",
    ...scenario.input,
  });
  const comparisons = Object.entries(scenario.expected).map(([field, expected]) => {
    const actual = result[field];
    const delta = typeof actual === "number" && typeof expected === "number"
      ? actual - expected
      : null;
    const matches = expected === null
      ? actual === null
      : typeof actual === "number" && Number.isFinite(actual) && Math.abs(delta) < 0.005;
    return { field, expected, actual, delta, matches };
  });
  return {
    id: scenario.id,
    title: scenario.title,
    basis: scenario.basis,
    matches: comparisons.every((item) => item.matches),
    comparisons,
  };
});
const aligned = rows.filter((row) => row.matches).length;
const lines = [
  "# 公开证据研究：合成场景复算结果",
  "",
  "> 本报告由 scripts/audit-profit-scenarios.mjs 生成。输入为人为设定的合成案例，非商家账单、平台费率或用户样本。",
  "",
  `共 ${rows.length} 个场景：${aligned} 个与独立预期一致，${rows.length - aligned} 个存在口径差异。金额容差为 0.005 元。`,
  "",
  "退货案例预期使用每笔发出订单口径：保留成交概率 × 成功订单毛利，减去全部发出订单已发生的履约成本、退货处置损失和相应费用。当前引擎使用售后风险预留口径；差异需要先作产品口径决策，不能当作真实账单误差。",
  "",
  "| 场景 | 检查字段 | 独立预期 | 当前引擎 | 当前减预期 | 结论 |",
  "| --- | --- | ---: | ---: | ---: | --- |",
];
const display = (value) => value === null ? "不可用" : Number(value).toFixed(4);
for (const row of rows) {
  for (const item of row.comparisons) {
    lines.push(`| ${row.id} ${row.title} | ${item.field} | ${display(item.expected)} | ${display(item.actual)} | ${display(item.delta)} | ${item.matches ? "一致" : "口径差异"} |`);
  }
}
lines.push("", "## 独立预期的计算依据", "");
for (const row of rows) lines.push(`- **${row.id}**：${row.basis}`);
const reportUrl = new URL("../doc/research/profit-scenario-results.md", import.meta.url);
writeFileSync(reportUrl, `${lines.join("\n")}\n`);
console.log(`${rows.length} scenarios; ${aligned} aligned; ${rows.length - aligned} require review.`);
console.log(fileURLToPath(reportUrl));
// Default completion means the audit ran, not that the current engine passed.
if (process.argv.includes("--strict") && aligned !== rows.length) process.exitCode = 1;
