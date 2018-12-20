import React from 'react';
import { Form, Radio, Switch } from 'antd';
import { TableProps } from '../interface';
import _ from 'lodash';
import { observer } from 'mobx-react';

const FormItem = Form.Item;

interface IDemoPops {
  store: TableProps<any>;
}

export const DefaultSettings: TableProps<any> = {
  scroll: { y: 240 },
  // title: null,//  () => 'Here is title',
  bordered: false,
  loading: false,
  striped: true,
  size: 'middle',
  // footer: null,//() => 'Here is footer',
};

@observer
export default class Demo extends React.Component<IDemoPops, any> {
  handleToggle = (prop: keyof TableProps<any>) => {
    return enable => {
      this.props.store[prop] = enable;
    };
  };

  handleSizeChange = e => {
    if (e.target.value) {
      this.props.store.size = e.target.value;
    }
  };

  handleScollChange = enable => {
    this.props.store.scroll = enable ? DefaultSettings.scroll : {};
  };

  // handleTitleChange = enable => {
  //   this.props.store.title = enable ? DefaultSettings.title : null;
  // };
  //
  // handleFooterChange = enable => {
  //   this.props.store.footer = enable ? DefaultSettings.footer : undefined;
  // };

  render() {
    let { bordered, loading, size, scroll, striped } = this.props.store;

    if (!_.isBoolean(loading)) {
      loading = !loading;
    }
    console.log('!!!! this.props.store \n', this.props.store, '\n !!!!');
    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          <Form layout="inline">
            <FormItem label="Bordered">
              <Switch checked={bordered} onChange={this.handleToggle('bordered')} />
            </FormItem>
            <FormItem label="loading">
              <Switch checked={loading} onChange={this.handleToggle('loading')} />
            </FormItem>
            <FormItem label="striped">
              <Switch checked={striped} onChange={this.handleToggle('striped')} />
            </FormItem>
            <FormItem label="Fixed Header">
              <Switch checked={!!scroll.y} onChange={this.handleScollChange} />
            </FormItem>
            {/*<FormItem label="Title">*/}
            {/*<Switch checked={!!title} onChange={this.handleTitleChange} />*/}
            {/*</FormItem>*/}
            {/*<FormItem label="Footer">*/}
            {/*<Switch checked={!!footer} onChange={this.handleFooterChange} />*/}
            {/*</FormItem>*/}
            <FormItem label="Size">
              <Radio.Group size="default" value={size} onChange={this.handleSizeChange}>
                <Radio.Button value="default">Default</Radio.Button>
                <Radio.Button value="middle">Middle</Radio.Button>
                <Radio.Button value="small">Small</Radio.Button>
              </Radio.Group>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}
