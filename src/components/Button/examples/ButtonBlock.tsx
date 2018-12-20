import React from 'react';
// import {  Radio, Icon } from 'antd';
import Button, { IButtonSize } from '../Button';
// import ButtonGroup from "../ButtonGroup"

export default class ButtonBlock extends React.Component<
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
        <h4>block</h4>
        <Button type="primary" size="default" block>
          Primary
        </Button>{' '}
        <Button size="default" block>
          Normal
        </Button>{' '}
        <Button type="danger" size="default" block>
          Danger
        </Button>{' '}
        <Button type="primary" icon="plus" size="default" block>
          Download
        </Button>
      </div>
    );
  }
}
