import { describe, expect, it } from "vitest";
import { readChartFile, readChartRows, readWords } from "@/components/betool/academic/chartData";
import { convertUnit, decodeMorse, encodeMorse, radices, readRadix, writeRadix } from "@/components/betool/academic/conversions";
import { drawOptions, randomInteger } from "@/components/betool/academic/random";

describe("unit and encoding tools", () => {
  it("converts metric, traditional and affine units in both directions", () => {
    expect(convertUnit(1, ["公里", 1000], ["尺", 1 / 3])).toBe(3000);
    expect(convertUnit(32, ["F", 5 / 9, 32], ["C", 1])).toBe(0);
    expect(convertUnit(-40, ["C", 1], ["F", 5 / 9, 32])).toBe(-40);
    expect(convertUnit(1, ["千瓦时", 3600000], ["千焦", 1000])).toBe(3600);
  });

  it("matches observed radix alphabets and preserves large integers", () => {
    expect(radices.map((base) => writeRadix(BigInt(255), base))).toEqual([
      "11111111", "377", "255", "ff", "7v", "5Q", "47", "3/",
    ]);
    const large = "990071992547409920045521237598123123490";
    const encoded = writeRadix(readRadix(large, 10), 64);
    expect(writeRadix(readRadix(encoded, 64), 10)).toBe(large);
    expect(() => readRadix("2", 2)).toThrow("不属于");
  });

  it("converts standard Morse and the observed Han code-point encoding", () => {
    const code = "... --- ... ? .- ? -.--..-.-----.- -.-.-- ";
    expect(encodeMorse("SOS A 好!")).toBe(code);
    expect(decodeMorse(code)).toBe("SOS A 好!");
    expect(encodeMorse("中文")).toBe("-..---...-.--.- --..-.--....--- ");
    expect(decodeMorse("... --- ... / .... . .-.. .-.. ---")).toBe("SOS HELLO");
  });
});

describe("chart data", () => {
  it("imports Chinese labels and preserves real spreadsheet numeric values", async () => {
    const csv = new TextEncoder().encode('类别,数值\n"样例,甲",18\n样例乙,24').buffer;
    expect(await readChartFile(csv, "data.csv")).toEqual([["类别", "数值"], ["样例,甲", "18"], ["样例乙", "24"]]);
    const { utils, write } = await import("@e965/xlsx");
    const book = utils.book_new();
    utils.book_append_sheet(book, utils.aoa_to_sheet([["类别", "数值"], ["图表", 12345.67]]), "Sheet1");
    for (const bookType of ["biff8", "xlsx"] as const) {
      const bytes = write(book, { type: "array", bookType }) as ArrayBuffer;
      expect(await readChartFile(bytes, bookType === "biff8" ? "data.xls" : "data.xlsx"))
        .toEqual([["类别", "数值"], ["图表", "12345.67"]]);
    }
  });

  it("preserves categorical labels, numeric series and XY order", () => {
    expect(readChartRows([["项目", "甲", "乙"], ["一", "3", "2"], ["二", "1", "-4"]], "bar")).toEqual({
      labels: ["一", "二"],
      series: [{ name: "甲", values: [3, 1] }, { name: "乙", values: [2, -4] }],
    });
    expect(readChartRows([["2", "5"], ["-1", "0"]], "scatter")).toEqual({
      labels: ["2", "-1"],
      series: [{ name: "系列 1", values: [5, 0] }],
    });
    expect(() => readChartRows([["一", "0"], ["二", "-1"]], "pie")).toThrow("不能为负数");
    expect(() => readChartRows([["一", "3"], ["二", ""]], "line")).toThrow("有效数字");
  });

  it("counts case-folded words and Chinese segments", () => {
    expect(readWords("北京 北京 A a B")).toEqual([
      { name: "北京", value: 2 }, { name: "a", value: 2 }, { name: "b", value: 1 },
    ]);
  });
});

describe("random selection", () => {
  it("draws only valid options and enforces sampling without replacement", () => {
    expect(drawOptions(["甲", "乙", "丙"], 3, false, (low) => low)).toEqual(["甲", "丙", "乙"]);
    expect(drawOptions(["甲", "乙"], 3, true, (_, high) => high)).toEqual(["乙", "乙", "乙"]);
    expect(() => drawOptions(["甲", "甲"], 2, false)).toThrow("不同选项");
  });

  it("handles inclusive integer endpoints and rejects invalid bounds", () => {
    expect(randomInteger(-7, -7)).toBe(-7);
    for (let i = 0; i < 50; i++) expect(randomInteger(-3, 3)).toBeOneOf([-3, -2, -1, 0, 1, 2, 3]);
    expect(() => randomInteger(2, 1)).toThrow("整数范围");
  });
});
