```jsx static
import {clearObject} from "@latoken-component/utils";

const originObject = { a:undefined, b:2, c:4, d:undefined };

const clearObject = clearObject(originObject);

console.log(clearObject) //  { b: 2, c: 4 }
```
