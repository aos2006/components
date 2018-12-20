### Превращает объект в набор URL параметров.
 Функция работает рекурсивно, понимает вложенные объекты.
 
```jsx static
objectToURLParam({foo: 'hi there', bar: { blah: 123, quux: [1, 2, 3] }}) 
//Result: bar%5Bblah%5D=123&bar%5Bquux%5D%5B0%5D=1&bar%5Bquux%5D%5B1%5D=2&bar%5Bquux%5D%5B2%5D=3
```
