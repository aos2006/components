import React from 'react';
import { Form, Icon, Radio, Switch } from 'antd';
import { TablePaginationConfig, TableProps } from '../interface';
import Table from '../Table';
import { observer } from 'mobx-react';

const FormItem = Form.Item;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 150,
    render: text => <a href="#">{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: 70,
    align: 'right',
  },
  {
    title: 'Content',
    dataIndex: 'content',
    key: 'content',
    width: 500,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    align: 'center',
  },
  {
    title: 'Action',
    key: 'action',
    width: 360,
    render: (text, record) => (
      <span>
        <a href="#">Action 一 {record.name}</a> |
        <a href="#">Delete</a> |
        <a href="#" className="ant-dropdown-link">
          More actions <Icon type="down" />
        </a>
      </span>
    ),
  },
];

const data = [];
for (let i = 1; i <= 100; i++) {
  data.push({
    key: i,
    name: 'John Brown',
    age: `${i}2`,
    content: (
      <div style={{ whiteSpace: 'nowrap' }}>
        ${i})Lorem Ipsum is simply dummy text of the printing and typesetting industry.{' '}
      </div>
    ),
    address: `New York No. ${i} Lake Park`,
    description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`,
  });
}

const expandedRowRender = record => <p>{record.description}</p>;
// const title = () => 'Here is title';
const showHeader = true;
// const footer = () => 'Here is footer';
// const scroll = { y: 240 };

type direction = 'bottom' | 'top' | 'both';
/**
 * Demo table
 *
 * @example ./Readme.md
 */
@observer
export default class Demo extends React.Component<{ store: TableProps<any> }, TableProps<any>> {
  state: {
    size: 'small' | 'default' | 'middle';
    bordered: boolean;
    pagination: TablePaginationConfig;
    loading: boolean;
    expandHide: boolean;
    useFixedHeader: boolean;
    expandedRowRender: any;
    showHeader: any;
    rowSelection: any;
    scroll: { x?: number | string; y?: number | string };
  } = {
    bordered: false,
    loading: false,
    expandHide: false,
    useFixedHeader: true,
    pagination: { position: 'bottom' },
    size: 'default',
    expandedRowRender,
    showHeader,
    rowSelection: {},
    scroll: { y: null, x: 500 },
  };

  handleToggle = prop => {
    return enable => {
      this.setState({ [prop]: enable });
    };
  };

  handleSizeChange = e => {
    this.setState({ size: e.target.value });
  };

  handleExpandChange = enable => {
    this.setState({ expandedRowRender: enable ? expandedRowRender : undefined });
  };

  // handleTitleChange = enable => {
  //   this.setState({ title: enable ? title : undefined });
  // };

  handleHeaderChange = enable => {
    this.setState({ showHeader: enable ? showHeader : false });
  };

  // handleFooterChange = enable => {
  //   this.setState({ footer: enable ? footer : undefined });
  // };

  handleRowSelectionChange = enable => {
    this.setState({ rowSelection: enable ? {} : undefined });
  };

  // handleScollChange = enable => {
  //   this.setState({ scroll: enable ? scroll : { x: 500 } });
  // };

  handlePaginationChange = e => {
    const value: direction = e.target.value;
    this.setState({
      pagination: { position: value },
    });
  };

  render() {
    const state = this.state;
    console.log('!!!! state \n', state, '\n !!!!');
    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          <Form layout="inline">
            {/*<FormItem label="Bordered">*/}
            {/*<Switch checked={state.bordered} onChange={this.handleToggle('bordered')} />*/}
            {/*</FormItem>*/}
            {/*<FormItem label="loading">*/}
            {/*<Switch checked={state.loading} onChange={this.handleToggle('loading')} />*/}
            {/*</FormItem>*/}
            {/*<FormItem label="Title">*/}
            {/*<Switch checked={!!state.title} onChange={this.handleTitleChange} />*/}
            {/*</FormItem>*/}
            <FormItem label="Column Header">
              <Switch checked={!!state.showHeader} onChange={this.handleHeaderChange} />
            </FormItem>
            {/*<FormItem label="Footer">*/}
            {/*<Switch checked={!!state.footer} onChange={this.handleFooterChange} />*/}
            {/*</FormItem>*/}
            <FormItem label="Expandable">
              <Switch checked={!!state.expandedRowRender} onChange={this.handleExpandChange} />
            </FormItem>
            <FormItem label="Expandable hide">
              <Switch checked={!!state.expandHide} onChange={this.handleToggle('expandHide')} />
            </FormItem>
            <FormItem label="Checkbox">
              <Switch checked={!!state.rowSelection} onChange={this.handleRowSelectionChange} />
            </FormItem>
            <FormItem label="useFixedHeader">
              <Switch
                checked={!!state.useFixedHeader}
                onChange={this.handleToggle('useFixedHeader')}
              />
            </FormItem>
            {/*<FormItem label="Fixed Header">*/}
            {/*<Switch checked={!!state.scroll.y} onChange={this.handleScollChange} />*/}
            {/*</FormItem>*/}
            {/*<FormItem label="Size">*/}
            {/*<Radio.Group size="default" value={state.size} onChange={this.handleSizeChange}>*/}
            {/*<Radio.Button value="default">Default</Radio.Button>*/}
            {/*<Radio.Button value="middle">Middle</Radio.Button>*/}
            {/*<Radio.Button value="small">Small</Radio.Button>*/}
            {/*</Radio.Group>*/}
            {/*</FormItem>*/}
            <FormItem label="Pagination">
              <Radio.Group
                value={state.pagination ? state.pagination.position : 'none'}
                onChange={this.handlePaginationChange}
              >
                <Radio.Button value="top">Top</Radio.Button>
                <Radio.Button value="bottom">Bottom</Radio.Button>
                <Radio.Button value="both">Both</Radio.Button>
                <Radio.Button value="none">None</Radio.Button>
              </Radio.Group>
            </FormItem>
          </Form>
        </div>
        <Table {...this.state} {...this.props.store} columns={columns} dataSource={data} />
      </div>
    );
  }
}
