**Form and Fields**

```jsx
const Example = require('./examples/index').default;

<Example />

```

```jsx static
import React from 'react';
import { inject } from 'mobx-react';
import Form from '@latoken-component/form';
import { rules } from '@latoken-component/utils';
import { Button } from 'antd';

import DynamicBlocks from '../DynamicBlocks';
import TraidingPairBlock, { TradingPairModel } from './blocks/TraidingPairBlock';

@inject('formDemo')
export default class Example extends React.Component<{ formDemo: any }, {}> {
  form: any;
  formRef = ref => (this.form = ref);
  onSubmit = e => {
    e.preventDefault();
    this.form
      .validateFields()
      .then(data => console.log(data)) // add here store action
      .catch(err => console.log(err));
  };
  render() {
    const { formDemo } = this.props;
    return (
      <div>
        <Form ref={this.formRef} onSubmit={this.onSubmit} store={formDemo.data}>
          <DynamicBlocks
            idPrefix="example-dynamic"
            data={formDemo.data.pairs}
            addText="traiding pair"
            blockTitle="Traiding Pairs"
            itemProps={{ allData: formDemo.data }}
            renderBlock={TraidingPairBlock}
            dataModel={TradingPairModel}
          />
          <Button htmlType="submit">Submit</Button>
        </Form>
      </div>
    );
  }
}
```
