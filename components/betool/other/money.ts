import Decimal from "decimal.js";

const digits = "零壹贰叁肆伍陆柒捌玖";
const sections = ["", "万", "亿", "兆"];
const positions = ["", "拾", "佰", "仟"];

function formatSection(group: string) {
  const padded = group.padStart(4, "0");
  let result = "";
  let zero = false;
  for (let index = 0; index < padded.length; index += 1) {
    const digit = Number(padded[index]);
    if (digit === 0) {
      zero = result.length > 0;
      continue;
    }
    result += (zero ? "零" : "") + digits[digit] + positions[3 - index];
    zero = false;
  }
  return result;
}

export function formatRmb(input: string) {
  const trimmed = input.trim();
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(trimmed)) throw new Error("请输入有效的数字");
  const amount = new Decimal(trimmed).toDecimalPlaces(2);
  if (amount.abs().gte("10000000000000000")) throw new Error("金额超出支持范围");
  const [integer, fraction] = amount.abs().toFixed(2).split(".");
  const groups = (integer.padStart(Math.ceil(integer.length / 4) * 4, "0").match(/.{4}/g) ?? []);
  let result = "";
  let skip = false;
  groups.forEach((group, index) => {
    const formatted = formatSection(group);
    if (!formatted) {
      skip = result.length > 0;
      return;
    }
    if (result && (skip || group.startsWith("0"))) result += "零";
    result += formatted + sections[groups.length - 1 - index];
    skip = false;
  });
  const [jiao, fen] = [...fraction].map(Number);
  const cents = (jiao ? digits[jiao] + "角" : fen ? "零" : "") + (fen ? digits[fen] + "分" : "");
  return (amount.isNegative() && !amount.isZero() ? "负" : "") + (result || "零") + "元" + (cents || "整");
}

export function parseRmb(input: string) {
  const text = input.trim().replace(/^人民币/, "");
  const match = /^([负-]?)([零壹贰叁肆伍陆柒捌玖拾佰仟万亿兆]+)[元圆](?:(整|正)|(零?(?:[壹贰叁肆伍陆柒捌玖]角)?(?:[壹贰叁肆伍陆柒捌玖]分)?))$/.exec(text);
  if (!match) throw new Error("请输入有效的人民币大写金额");
  let total = BigInt(0);
  let group = BigInt(0);
  let digit = 0;
  for (const character of match[2]) {
    const value = digits.indexOf(character);
    if (value >= 0) {
      digit = value;
      continue;
    }
    const pos = positions.indexOf(character);
    if (pos > 0) {
      group += BigInt((digit || 1) * 10 ** pos);
    } else {
      total += (group + BigInt(digit)) * BigInt(10000) ** BigInt(sections.indexOf(character));
      group = BigInt(0);
    }
    digit = 0;
  }
  const fraction = match[4] ?? "";
  const jiao = fraction.match(/(.)角/)?.[1];
  const fen = fraction.match(/(.)分/)?.[1];
  const result = `${match[1] ? "-" : ""}${total + group + BigInt(digit)}.${jiao ? digits.indexOf(jiao) : 0}${fen ? digits.indexOf(fen) : 0}`;
  return new Decimal(result).toFixed(2);
}
