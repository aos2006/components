import React from 'react';
// import {  Radio, Icon } from 'antd';
import Button, { IButtonSize } from '../Button';
// import ButtonGroup from "../ButtonGroup"

export default class ButtonSize extends React.Component<
  any,
  {
    size: IButtonSize;
  }
> {
  state: {
    size: IButtonSize;
  } = {
    size: 'large',
  };

  handleSizeChange = e => {
    this.setState({ size: e.target.value });
  };

  render() {
    // const size = this.state.size;
    return (
      <div>
        {/*<ButtonGroup value={size} onChange={this.handleSizeChange}>*/}
        {/*<Radio.Button value="large">Large</Radio.Button>*/}
        {/*<Radio.Button value="default">Default</Radio.Button>*/}
        {/*<Radio.Button value="small">Small</Radio.Button>*/}
        {/*</ButtonGroup>*/}
        <h4>small</h4>
        <Button type="primary" size="small">
          Primary
        </Button>{' '}
        <Button size="small">Normal</Button>{' '}
        <Button type="danger" size="small">
          Danger
        </Button>{' '}
        <Button type="primary" shape="circle" icon="plus" size="small" />{' '}
        <Button type="primary" icon="plus" size="small">
          Download
        </Button>
        <br />
        <br />
        <h4>default</h4>
        <Button type="primary" size="default">
          Primary
        </Button>{' '}
        <Button size="default">Normal</Button>{' '}
        <Button type="danger" size="default">
          Danger
        </Button>{' '}
        <Button type="primary" shape="circle" icon="plus" size="default" />{' '}
        <Button type="primary" icon="plus" size="default">
          Download
        </Button>
        <br />
        <br />
        <h4>large</h4>
        <Button type="primary" size="large">
          Primary
        </Button>{' '}
        <Button size="large">Normal</Button>{' '}
        <Button type="danger" size="large">
          Danger
        </Button>{' '}
        <Button type="primary" shape="circle" icon="plus" size="large" />{' '}
        <Button type="primary" icon="plus" size="large">
          Download
        </Button>
        <br />
        <br />
        <h4>big</h4>
        <Button type="primary" size="big">
          Primary
        </Button>{' '}
        <Button size="big">Normal</Button>{' '}
        <Button type="danger" size="big">
          Danger
        </Button>{' '}
        <Button type="primary" shape="circle" icon="plus" size="big" />{' '}
        <Button type="primary" icon="plus" size="big">
          Download
        </Button>
        {/*<ButtonGroup size={size}>*/}
        {/*<Button type="primary">*/}
        {/*<Icon type="left" />Backward*/}
        {/*</Button>*/}
        {/*<Button type="primary">*/}
        {/*Forward<Icon type="right" />*/}
        {/*</Button>*/}
        {/*</ButtonGroup>*/}
      </div>
    );
  }
}
