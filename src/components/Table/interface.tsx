import * as React from 'react';
import { PaginationProps } from '@latoken-component/utils/types/antd/pagination';
import { SpinProps } from '@latoken-component/utils/types/antd/spin';
import { Store } from './createStore';
// import { RadioChangeEvent } from '@latoken-component/utils/types/antd/radio';
// import { CheckboxChangeEvent } from '@latoken-component/utils/types/antd/checkbox';

export type CompareFn<T> = ((a: T, b: T) => number);
export type ColumnFilterItem = {
  text: React.ReactNode;
  value: string;
  children?: ColumnFilterItem[];
};

export interface ColumnProps<T> {
  title?: React.ReactNode;
  key?: React.Key;
  dataIndex?: string;
  render?: (text: any, record: T, index: number) => React.ReactNode;
  filters?: ColumnFilterItem[];
  onFilter?: (value: any, record: T) => boolean;
  filterMultiple?: boolean;
  filterDropdown?: React.ReactNode;
  filterDropdownVisible?: boolean;
  onFilterDropdownVisibleChange?: (visible: boolean) => void;
  sorter?: boolean | CompareFn<T>;
  defaultSortOrder?: 'ascend' | 'descend';
  colSpan?: number;
  width?: string | number;
  className?: string;
  fixed?: boolean | ('left' | 'right');
  filterIcon?: React.ReactNode;
  filteredValue?: any[];
  sortOrder?: boolean | ('ascend' | 'descend');
  children?: ColumnProps<T>[];
  onCellClick?: (record: T, event: any) => void;
  onCell?: (record: T) => any;
  onHeaderCell?: (props: ColumnProps<T>) => any;
  align?: 'left' | 'right' | 'center' | string;
  help?: React.ReactNode;
}

export interface TableComponents {
  table?: any;
  header?: {
    wrapper?: any;
    row?: any;
    cell?: any;
  };
  body?: {
    wrapper?: any;
    row?: any;
    cell?: any;
  };
}

export interface TableLocale {
  filterTitle?: string;
  filterConfirm?: React.ReactNode;
  filterReset?: React.ReactNode;
  emptyText?: React.ReactNode | (() => React.ReactNode);
  selectAll?: React.ReactNode;
  selectInvert?: React.ReactNode;
}

export type RowSelectionType = 'checkbox' | 'radio';
export type SelectionSelectFn<T> = (record: T, selected: boolean, selectedRows: Object[]) => any;

export interface TablePaginationConfig extends PaginationProps {
  position?: 'top' | 'bottom' | 'both';
}

export interface TableRowSelection<T> {
  type?: RowSelectionType;
  selectedRowKeys?: string[] | number[];
  onChange?: (selectedRowKeys: string[] | number[], selectedRows: Object[]) => any;
  getCheckboxProps?: (record: T) => Object;
  onSelect?: SelectionSelectFn<T>;
  onSelectAll?: (selected: boolean, selectedRows: Object[], changeRows: Object[]) => any;
  onSelectInvert?: (selectedRows: Object[]) => any;
  selections?: SelectionItem[] | boolean;
  hideDefaultSelections?: boolean;
  fixed?: boolean;
  columnWidth?: string | number;
}

export interface Sorter<T> {
  column?: ColumnProps<T>;
  columnKey?: string;
  field?: string;
  order?: IOrder;
}

export interface TableProps<T> {
  rowSelection?: TableRowSelection<T>;
  pagination?: TablePaginationConfig | false;
  size?: 'default' | 'middle' | 'small';
  dataSource?: T[];
  components?: TableComponents;
  columns?: ColumnProps<T>[];
  rowKey?: string | number | ((record: T, index: number) => string | number);
  rowClassName?: (record: T, index: number) => string;
  expandedRowRender?: any;
  defaultExpandAllRows?: boolean;
  defaultExpandedRowKeys?: string[] | number[];
  expandedRowKeys?: string[] | number[];
  expandIconAsCell?: boolean;
  expandHide?: boolean;
  expandIconColumnIndex?: number;
  expandRowByClick?: boolean;
  onExpandedRowsChange?: (expandedRowKeys: string[] | number[]) => void;
  onExpand?: (expanded: boolean, record: T) => void;
  onChange?: (
    pagination: TablePaginationConfig | boolean,
    filters: string[],
    sorter: Sorter<T>
  ) => any;
  loading?: boolean | SpinProps;
  locale?: Object;
  indentSize?: number;
  onRowClick?: (record: T, index: number, event: Event) => any;
  onRow?: (record: T, index: number) => any;
  useFixedHeader?: boolean;
  bordered?: boolean;
  showHeader?: boolean;
  // footer?: (currentPageData: Object[]) => React.ReactNode;
  // title?: (currentPageData: Object[]) => React.ReactNode;
  scroll?: { x?: number | string; y?: number | string };
  childrenColumnName?: string;
  bodyStyle?: React.CSSProperties;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  striped?: boolean;
  filters?: TableStateFilters;
  sorter?: ISorter<T>;
}

export type IOrder = false | 'ascend' | 'descend';

export interface ISorter<T> {
  column?: ColumnProps<T>;
  columnKey?: string;
  field?: string;
  order?: IOrder;
}

export interface TableStateFilters {
  [key: string]: string[];
}

export interface TableSort<T> {
  sortColumn?: ColumnProps<T> | null;
  sortOrder?: string;
}

export interface TableState<T> extends TableSort<T> {
  pagination: TablePaginationConfig;
  filters: TableStateFilters;
}

export type SelectionItemSelectFn = (key: string[]) => any;

export interface SelectionItem {
  key: string;
  text: React.ReactNode;
  onSelect: SelectionItemSelectFn;
}

export interface SelectionCheckboxAllProps<T> {
  store: Store;
  locale: any;
  disabled: boolean;
  getCheckboxPropsByItem: (item: any, index: number) => any;
  getRecordKey: (record: any, index?: number) => string;
  data: T[];
  onSelect: (key: string, index: number, selectFunc: any) => void;
  hideDefaultSelections?: boolean;
  selections?: SelectionItem[] | boolean;
  getPopupContainer: (triggerNode?: Element) => HTMLElement;
}

export interface SelectionCheckboxAllState {
  checked: boolean;
  indeterminate: boolean;
}

export interface SelectionBoxProps {
  store: Store;
  type?: RowSelectionType;
  defaultSelection: string[];
  rowIndex: string;
  name?: string;
  disabled?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>; //| (e: RadioChangeEvent | CheckboxChangeEvent) => void; //todo: от ant 3.3.0
}

export interface SelectionBoxState {
  checked?: boolean;
}

export interface FilterMenuProps<T> {
  locale: TableLocale;
  selectedKeys: string[];
  column: ColumnProps<T>;
  confirmFilter: (column: ColumnProps<T>, selectedKeys: string[]) => any;
  dropdownPrefixCls: string;
  getPopupContainer: (triggerNode?: Element) => HTMLElement;
}

export interface FilterMenuState {
  selectedKeys: string[];
  keyPathOfSelectedItem: { [key: string]: string };
  visible?: boolean;
}
