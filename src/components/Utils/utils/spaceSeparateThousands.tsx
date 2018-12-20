export default function spaceSeparateThousands(
  str: number | string,
  customSeparator: string = ' ',
  lengthNumber: number = 3
): string {
  const parts = String(str).split('.');
  parts[0] = parts[0].replace(
    new RegExp(`\\B(?=(\\d{${lengthNumber}})+(?!\\d))`, 'g'),
    customSeparator || ' '
  );
  return parts.join('.');
}
