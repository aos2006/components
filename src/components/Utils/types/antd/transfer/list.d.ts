/// <reference types="react" />
import * as React from 'react';
import { TransferItem } from './index';
export interface TransferListProps {
  prefixCls: string;
  titleText: string;
  dataSource: TransferItem[];
  filter: string;
  filterOption?: (filterText: any, item: any) => boolean;
  style?: React.CSSProperties;
  checkedKeys: string[];
  handleFilter: (e: any) => void;
  handleSelect: (selectedItem: any, checked: boolean) => void;
  handleSelectAll: (dataSource: any[], checkAll: boolean) => void;
  handleClear: () => void;
  render?: (item: any) => any;
  showSearch?: boolean;
  searchPlaceholder: string;
  notFoundContent: React.ReactNode;
  itemUnit: string;
  itemsUnit: string;
  body?: (props: any) => any;
  footer?: (props: any) => void;
  lazy?: boolean | {};
  onScroll: Function;
}
export default class TransferList extends React.Component<TransferListProps, any> {
  static defaultProps: {
    dataSource: never[];
    titleText: string;
    showSearch: boolean;
    render: () => void;
    lazy: {};
  };
  timer: number;
  triggerScrollTimer: number;
  constructor(props: TransferListProps);
  componentDidMount(): void;
  componentWillUnmount(): void;
  shouldComponentUpdate(...args: any[]): any;
  getCheckStatus(filteredDataSource: TransferItem[]): 'none' | 'all' | 'part';
  handleSelect: (selectedItem: TransferItem) => void;
  handleFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
  matchFilter: (text: string, item: TransferItem) => boolean;
  renderItem: (
    item: TransferItem
  ) => {
    renderedText: any;
    renderedEl: any;
  };
  render(): JSX.Element;
}
