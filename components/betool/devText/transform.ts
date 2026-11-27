const digits = "0123456789abcdefghijklmnopqrstuvwxyz";

export function convertBase(text: string, from: number, to: number) {
  const match = /^([+-]?)([a-z0-9]+)(?:\.([a-z0-9]+))?$/i.exec(text.trim());
  if (!match) throw new Error("请输入有效的数值");
  const [, sign, integer, fraction = ""] = match;
  const fromBase = BigInt(from);
  const toBase = BigInt(to);

  function read(part: string) {
    let value = 0n;
    for (const character of part.toLowerCase()) {
      const digit = digits.indexOf(character);
      if (digit < 0 || digit >= from) throw new Error("输入包含当前进制不支持的字符");
      value = value * fromBase + BigInt(digit);
    }
    return value;
  }

  const number = read(integer);
  const scale = fromBase ** BigInt(fraction.length);
  let remainder = read(fraction);
  let suffix = "";
  while (remainder && suffix.length < 24) {
    remainder *= toBase;
    suffix += digits[Number(remainder / scale)];
    remainder %= scale;
  }
  const prefix = sign === "-" && (number || suffix) ? "-" : "";
  return prefix + number.toString(to).toUpperCase() + (suffix ? "." + suffix.toUpperCase() : "");
}

export function unicodeToText(text: string) {
  return text.replace(/\\u(?:\{([\da-f]{1,6})\}|([\da-f]{4}))/gi, (encoded, extended, short) => {
    const point = Number.parseInt(extended ?? short, 16);
    return point <= 0x10ffff ? String.fromCodePoint(point) : encoded;
  });
}

export function textToUnicode(text: string) {
  return text.replace(/\p{Script=Han}/gu, (character) => {
    if (character.length === 1) return "\\u" + character.charCodeAt(0).toString(16).padStart(4, "0");
    return "\\u{" + character.codePointAt(0)?.toString(16) + "}";
  });
}

export function decodeJwt(text: string) {
  const groups = text.trim().split(".");
  if (groups.length !== 3 || !groups[0] || !groups[1]) throw new Error("JWT 应由三段以点分隔的内容组成");
  const parse = (value: string) => {
    if (!/^[\w-]+={0,2}$/.test(value)) throw new Error("JWT 中含无效编码");
    const bytes = Uint8Array.from(atob(value.replace(/-/g, "+").replace(/_/g, "/")), (character) => character.charCodeAt(0));
    return JSON.stringify(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)), null, 2);
  };
  return [parse(groups[0]), parse(groups[1])] as const;
}

export function cryptoInt(max: number) {
  const limit = 2 ** 32 - (2 ** 32 % max);
  const value = new Uint32Array(1);
  do {
    crypto.getRandomValues(value);
  } while (value[0] >= limit);
  return value[0] % max;
}

export function generatePasswords(characters: string, length: number, amount: number) {
  const pool = [...new Set(characters)];
  if (!pool.length) throw new Error("请选择字符或输入自定义字符");
  if (![length, amount].every((value) => Number.isInteger(value) && value >= 1 && value <= 100)) {
    throw new Error("长度及数量应为 1 到 100 的整数");
  }
  return Array.from({ length: amount }, () => Array.from({ length }, () => pool[cryptoInt(pool.length)]).join("")).join("\n");
}

export function literalRegex(value: string) {
  return value.replace(/[.*+?^$(){}|[\]\\]/g, "\\$&");
}

export function replaceText(text: string, pattern: string, replacement: string, regular: boolean, sensitive: boolean) {
  if (!pattern) return text;
  const expression = new RegExp(regular ? pattern : literalRegex(pattern), sensitive ? "g" : "gi");
  return regular ? text.replace(expression, replacement) : text.replace(expression, () => replacement);
}

export function uniqueLines(text: string) {
  return [...new Set(text.split(/\r\n?|\n/))].join("\n");
}
