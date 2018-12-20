```jsx harmony
const DraggableAndScrollable = require('./DraggableAndScrollable').default;
const DraggableHandle = require('./DraggableAndScrollable').DraggableHandle;


<div style={{ fontSize: 30, background: '#ECECEC', padding: '30px' }}>
    <DraggableAndScrollable
    containerHeight={200}
    startOffset={30}
     >
     
     <div style={{
       height: 300,
       position: 'relative',
       backgroundColor: 'blue'
     }}>
     
     <DraggableHandle>
     <div style={{
           position: 'absolute',
           height: '30px',
           backgroundColor: 'yellow',
           top: '50%',
           width: '100%',
           marginTop: '-15px',
           textAlign: 'center',
           lineHeight: '30px',
     }}>
     Draggable
</div>
</DraggableHandle>
     
    </div>
     </DraggableAndScrollable>
</div>
```
