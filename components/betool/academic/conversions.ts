type Unit = readonly [label: string, factor: number, offset?: number];
type UnitGroup = { name: string; units: readonly Unit[] };

export const unitCategories = [
  ["length", "长度", [
    { name: "国际长度单位(公制)", units: [["公里(km)", 1000], ["米(m)", 1], ["分米(dm)", .1], ["厘米(cm)", .01], ["毫米(mm)", .001], ["丝(dmm)", .0001], ["微米(um)", .000001], ["纳米(nm)", .000000001]] },
    { name: "中国传统长度单位(市制)", units: [["里", 500], ["丈", 10 / 3], ["尺", 1 / 3], ["寸", 1 / 30], ["分", 1 / 300], ["厘", 1 / 3000], ["毫", 1 / 30000]] },
    { name: "英制长度单位", units: [["海里(nmi)", 1852], ["英寻(fm)", 1.8288], ["英里(mi)", 1609.344], ["弗隆(fur)", 201.168], ["码(yd)", .9144], ["英尺(ft)", .3048], ["英寸(in)", .0254]] },
  ]],
  ["area", "面积", [
    { name: "国际面积单位(公制)", units: [["平方千米(km²)", 1000000], ["平方米(m²)", 1], ["平方分米(dm²)", .01], ["平方厘米(cm²)", .0001], ["平方毫米(mm²)", .000001], ["公顷(ha)", 10000]] },
    { name: "中国传统面积单位(市制)", units: [["亩", 2000 / 3], ["分", 200 / 3], ["厘", 20 / 3], ["毫", 2 / 3]] },
    { name: "英制面积单位", units: [["平方海里(nmi²)", 1852 ** 2], ["平方英里(mi²)", 1609.344 ** 2], ["英亩(acre)", 4046.8564224], ["平方竿(rd²)", 5.0292 ** 2], ["平方码(yd²)", .9144 ** 2], ["平方英尺(ft²)", .3048 ** 2], ["平方英寸(in²)", .0254 ** 2]] },
  ]],
  ["weight", "重量", [
    { name: "国际重量单位(公制)", units: [["吨(t)", 1000], ["千克/公斤(kg)", 1], ["克(g)", .001], ["毫克(mg)", .000001]] },
    { name: "中国传统重量单位(市制)", units: [["斤", .5], ["两", .05], ["钱", .005], ["担", 50]] },
    { name: "英制重量单位(常衡制)", units: [["磅(lb)", .45359237], ["盎司(oz)", .45359237 / 16], ["英石(st)", .45359237 * 14], ["英担(cwt)", .45359237 * 112], ["打兰(dr)", .45359237 / 256], ["格令(gr)", .00006479891], ["长吨(lt)", .45359237 * 2240]] },
    { name: "英制重量单位(金衡制)", units: [["磅(lbt)", .3732417216], ["盎司(ozt)", .0311034768], ["格令", .00006479891], ["英钱(dwt)", .00155517384]] },
  ]],
  ["time", "时间", [{ name: "国际时间单位", units: [["年(year)", 31536000], ["月(month)", 2628000], ["日(d)", 86400], ["时(h)", 3600], ["分(min)", 60], ["秒(s)", 1], ["毫秒(ms)", .001], ["周(week)", 604800]] }]],
  ["temperature", "温度", [{ name: "国际温度单位", units: [["摄氏度(℃)", 1], ["华氏度(℉)", 5 / 9, 32], ["开氏度(K)", 1, 273.15], ["列氏度(°Re)", 1.25], ["兰氏度(°R)", 5 / 9, 491.67]] }]],
  ["pressure", "压力", [{ name: "压力单位", units: [["帕(Pa)", 1], ["百帕(hPa)", 100], ["千帕(kPa)", 1000], ["兆帕(MPa)", 1000000], ["巴(bar)", 100000], ["托(torr)", 101325 / 760], ["磅力/平方英寸(psi)", 6894.757293168]] }]],
  ["heat", "热量", [{ name: "热量单位", units: [["瓦时(Wh)", 3600], ["毫瓦时(mWh)", 3.6], ["千瓦时(kWh)", 3600000], ["兆瓦时(MWh)", 3600000000], ["焦(J)", 1], ["千焦(kJ)", 1000]] }]],
  ["power", "功率", [{ name: "功率单位", units: [["瓦(W)", 1], ["毫瓦(mW)", .001], ["千瓦(kW)", 1000], ["兆瓦(MW)", 1000000], ["吉瓦(GW)", 1000000000]] }]],
] satisfies readonly (readonly [id: string, name: string, groups: readonly UnitGroup[]])[];

export function convertUnit(value: number, from: Unit, to: Unit): number {
  return (value - (from[2] ?? 0)) * from[1] / to[1] + (to[2] ?? 0);
}

export const radices = [2, 8, 10, 16, 32, 58, 62, 64];

const digits = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";

function alphabet(radix: number): string {
  return radix === 58 ? "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz" : digits.slice(0, radix);
}

export function readRadix(value: string, radix: number): bigint {
  if (!Number.isInteger(radix) || radix < 2 || radix > 64) throw new RangeError("进制必须在 2 到 64 之间");
  const source = value.trim();
  if (!source || source.length > 1000) throw new Error("请输入 1 到 1000 个字符组成的非负整数");
  const symbols = alphabet(radix);
  const base = BigInt(radix);
  let result = BigInt(0);
  for (const symbol of radix <= 36 ? source.toLowerCase() : source) {
    const digit = symbols.indexOf(symbol);
    if (digit < 0) throw new Error(`字符 ${symbol} 不属于 ${radix} 进制`);
    result = result * base + BigInt(digit);
  }
  return result;
}

export function writeRadix(value: bigint, radix: number): string {
  const symbols = alphabet(radix);
  const base = BigInt(radix);
  let rest = value;
  let output = "";
  do {
    output = symbols[Number(rest % base)] + output;
    rest /= base;
  } while (rest > BigInt(0));
  return output;
}

const morseAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const morseCodes = ".- -... -.-. -.. . ..-. --. .... .. .--- -.- .-.. -- -. --- .--. --.- .-. ... - ..- ...- .-- -..- -.-- --.. ----- .---- ..--- ...-- ....- ..... -.... --... ---.. ----.".split(" ");
const punctuation = {
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--", "/": "-..-.",
  "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...", ";": "-.-.-.", "=": "-...-",
  "+": ".-.-.", "-": "-....-", "_": "..--.-", '"': ".-..-.", "$": "...-..-", "@": ".--.-.",
};
const morse = new Map([...Array.from(morseAlphabet, (letter, index) => [letter, morseCodes[index]] as const), ...Object.entries(punctuation)]);
const reverseMorse = new Map([...morse].map(([letter, code]) => [code, letter]));

export function encodeMorse(value: string): string {
  return Array.from(value, (character) => {
    const code = character.codePointAt(0) ?? 0;
    const symbol = morse.get(character.toUpperCase());
    if (symbol) return symbol + " ";
    if (/\p{Script=Han}/u.test(character)) return code.toString(2).replaceAll("0", ".").replaceAll("1", "-") + " ";
    return "? ";
  }).join("");
}

export function decodeMorse(value: string): string {
  return value.trim().split(/\s+/).filter(Boolean).map((symbol) => {
    if (symbol === "?" || symbol === "/") return " ";
    const mapped = reverseMorse.get(symbol);
    if (mapped) return mapped;
    if (!/^[.-]{10,21}$/.test(symbol)) return "?";
    const code = Number.parseInt(symbol.replaceAll(".", "0").replaceAll("-", "1"), 2);
    return code > 0x10ffff ? "?" : String.fromCodePoint(code);
  }).join("");
}
