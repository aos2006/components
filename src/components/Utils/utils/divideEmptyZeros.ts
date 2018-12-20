export default function divideEmptyZeros(valueStr: string): Array<string> {
  if (valueStr.indexOf('.') === -1) {
    return [valueStr, null];
  }

  const length = valueStr.length;

  for (let i = length - 1; i > 0; i--) {
    if (valueStr[i] !== '0') {
      return i === length - 1
        ? [valueStr, null]
        : [valueStr.substr(0, i + 1), valueStr.substr(i + 1, length)];
    }
  }

  return [valueStr, null];
}
