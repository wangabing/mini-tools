export function randomInteger(min: number, max: number): number {
  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || max < min) {
    throw new RangeError("请输入有效的整数范围");
  }
  const first = BigInt(min);
  const span = BigInt(max) - first + BigInt(1);
  const limit = BigInt(2) ** BigInt(64);
  const threshold = limit - limit % span;
  const value = new BigUint64Array(1);
  do {
    crypto.getRandomValues(value);
  } while (value[0] >= threshold);
  return Number(first + value[0] % span);
}

export function drawOptions(
  options: readonly string[],
  count: number,
  allowRepeats: boolean,
  draw = randomInteger,
): string[] {
  if (!options.length) throw new RangeError("请输入抽取选项");
  if (!Number.isInteger(count) || count < 1 || count > 1000) throw new RangeError("抽取数量须在 1 到 1000 之间");
  const pool = allowRepeats ? options : [...new Set(options)];
  if (!allowRepeats && count > pool.length) throw new RangeError("抽取数量不能超过不同选项的数量");
  const indexes = Array.from({ length: pool.length }, (_, index) => index);
  return Array.from({ length: count }, () => {
    if (allowRepeats) return pool[draw(0, pool.length - 1)];
    const position = draw(0, indexes.length - 1);
    const chosen = indexes[position];
    indexes[position] = indexes[indexes.length - 1];
    indexes.pop();
    return pool[chosen];
  });
}
