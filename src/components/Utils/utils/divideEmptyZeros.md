```jsx static
import {divideEmptyZeros} from "@latoken-component/utils";

divideEmptyZeros("0.123000") // ["0.123", "000"]
divideEmptyZeros("0.123") //  ["0.123", null]
```
