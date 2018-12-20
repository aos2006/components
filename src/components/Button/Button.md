* ant: https://ant.design/components/card/
* github:https://github.com/ant-design/ant-design/edit/master/components/card
* issue: https://github.com/ant-design/ant-design/labels/Component%3A%20Card
```jsx harmony
const ButtonSize = require('./examples/ButtonSize').default;
const ButtonBlock = require('./examples/ButtonBlock').default;

<div>
  <p>
    <h3>Type</h3>
    <Button type="primary">Primary</Button> {' '}
    <Button>Default</Button>{' '}
    <Button type="danger">Danger</Button>{' '}
  <div style={{background:"#aaa",padding:10,display: 'inline-block' , marginTop:-10}}>
      <Button type="ghost">Ghost</Button>{' '}
  </div>{' '}
    <Button type="bay">Bay</Button>{' '}
    <Button type="sale">Sale</Button>{' '}
    <Button type="link">link</Button>{' '}
 </p>
  <p>
    <h3>Differ html</h3>
    <div style={{display:'inline-block', margin: 8}}>
      <h4>div</h4>   
      <Button type="primary">Primary</Button> {' '}
      <Button>Default</Button>{' '}
      <Button type="link">link</Button>{' '}
    </div>
    <div style={{display:'inline-block', margin: 8}}>
      <h4>button with props 'htmlType'</h4>  
      <Button htmlType={'submit'} type="primary">Primary</Button> {' '}
      <Button htmlType={'submit'}>Default</Button>{' '}
      <Button htmlType={'submit'} type="link">link</Button>{' '}
    </div>
    <div style={{display:'inline-block', margin: 8}}>
      <h4>a with props 'href'</h4>   
      <Button href={'/'}  type="primary">Primary</Button> {' '}
      <Button href={'/'} >Default</Button>{' '}
      <Button href={'/'}  type="link">link</Button>{' '}
    </div>
    <div style={{display:'inline-block', margin: 8}}>
      <h4>Link with props 'to'</h4>   
      <Button to={'/'}  type="primary">Primary</Button> {' '}
      <Button to={'/'} >Default</Button>{' '}
      <Button to={'/'}  type="link">link</Button>{' '}
    </div>
  </p>
  <p>
    <h3>Icon</h3>
    <Button type="primary" shape="circle" icon="plus" />{' '}
    <Button type="primary" icon="plus">Search</Button>{' '}
    <Button shape="circle" icon="plus" />{' '}
    <Button icon="plus">Search</Button>{' '}
  </p>
  <p>
    <h3>Loading</h3>
    <Button type="primary" shape="circle" loading />{' '}
    <Button type="primary" loading>Search</Button>{' '}
    <Button shape="circle" loading />{' '}
    <Button loading>Search</Button>{' '}
  </p>
  <p>
      <h3>disabled</h3>
          <div style={{display:'inline-block', margin: 8}}>

    <Button type="primary">Primary</Button>{' '}
    <Button type="primary" disabled>Primary(disabled)</Button>
    </div>
    <div style={{display:'inline-block', margin: 8}}>
    <Button>Default</Button>{' '}
    <Button disabled>Default(disabled)</Button>
    </div>
    <div style={{display:'inline-block', margin: 8}}>
    <div style={{background:"#aaa",padding:10,display: 'inline-block' , margin:-10}}>
      <Button type={'ghost'} >Ghost</Button>{' '}
      <Button type={'ghost'} disabled>Ghost(disabled)</Button>
    </div>
    </div>
    <div style={{display:'inline-block', margin: 8}}>
    <Button type="danger">Dashed</Button>{' '}
    <Button type="danger" disabled>Dashed(disabled)</Button>
    </div>
    <div style={{display:'inline-block', margin: 8}}>
    <Button type="link">Link</Button>{' '}
    <Button type="link" disabled>Link(disabled)</Button>
    </div>
  </p>
  <p>
    <h3>Size</h3>
    <ButtonSize/>
  </p>
  <p>
    <ButtonBlock/>
  </p>
</div>
```
