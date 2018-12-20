export default function spaceSeparate(
  str: string,
  customSeparator: string = ' ',
  lengthStrong: number = 3
): string {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    if (!Boolean(i % lengthStrong) && i !== 0) {
      result += customSeparator;
    }
    result += char;
  }
  return result;
}
