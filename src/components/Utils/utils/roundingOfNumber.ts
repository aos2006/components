export default function roundingOfNumber(
  value: number,
  precision: number = 8,
  shift: number = 0
): number {
  if (value === 0) {
    return 0;
  } else if (value < 0.000001 && value > -0.000001) {
    return roundingOfNumber(value * 10, precision - 1, shift + 1);
  }
  const arr = String(value).split('.');
  if (arr[1]) {
    arr[1] = ('0'.repeat(shift) + arr[1]).slice(0, precision + shift);
  }
  return parseFloat(arr.join('.'));
}
