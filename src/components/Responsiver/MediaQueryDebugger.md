
панеля для уобной разработки моблных версий

чтобы показать панел в консоли нужно вызвать ``window._MediaQueryDebuggerToggle()``
```js

const Button = require('@latoken-component/button/Button').default;
const MediaQueryDebugger = require('./MediaQueryDebugger').default;


<div>
  
  <Button  onClick={()=>window._MediaQueryDebuggerToggle()}>
  show debugger mod
  </Button>  
  <MediaQueryDebugger/>
</div>
```
