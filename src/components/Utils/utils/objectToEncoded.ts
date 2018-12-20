import _ from 'lodash';

/**
 * Превращает объект в набор URL параметров.
 *
 * Функция работает рекурсивно, понимает вложенные объекты.
 *
 * Example:
 * objectToURLParam({foo: 'hi there', bar: { blah: 123, quux: [1, 2, 3] }})
 * Result:
 * bar%5Bblah%5D=123&bar%5Bquux%5D%5B0%5D=1&bar%5Bquux%5D%5B1%5D=2&bar%5Bquux%5D%5B2%5D=3
 *
 */
export default function objectToEncoded(obj: Object, parentKey?: string): string {
  const str = [];
  for (const p in obj) {
    if (obj.hasOwnProperty(p)) {
      const v = obj[p];
      if (v !== '') {
        str.push(
          _.isObject(v)
            ? objectToEncoded(v, p)
            : `${encodeURIComponent(p)}=${encodeURIComponent(v)}`
        );
      }
    }
  }
  return str.join('&');
}
