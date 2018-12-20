import { CSSProperties, ReactNode } from 'react';

export type IAlign = string | 'right' | 'center';
export interface IColumn<T = any> {
  id: string;
  width?: number;
  disableSort?: boolean;
  dataKey?: string;
  label?: ReactNode;
  filters?: IFilterItem[];
  align?: IAlign;
  className?: string;
  maxWidth?: number;
  minWidth?: number;
  style?: CSSProperties;
  flexGrow?: number;
  flexShrink?: number;
  headerStyle?: CSSProperties;

  getComponent(data: T): ReactNode | Element;
}
export interface IRowRenderParams {
  className: string;
  style: object;
  index: number;
  rowData: object;
}

export interface ITableProps<T = any> {
  sortBy?: string;
  autoHeight?: boolean;
  columns: Array<IColumn<T>>;
  filters?: IFilterItem;
  sortDirection?: 'ASC' | 'DESC';
  staticHeight?: number;
  headerHeight?: number;
  list?: T[];
  striped?: boolean;
  disableHeader?: boolean;
  type?: 'small' | 'medium';
  onRowRender(data: IRowRenderParams): { className: string };
  tableClassName?: string;
  rowClassName?: string;
  cellWrapperClassName?: string;
  headerClassName?: string;
  rowHeight?: number;

  onFiltersPick?(dataKey: string, picked: string[]): void;
  onRowClick?(rowData: { data: T }): any;
  children?(data: { sortBy?: string; sortDirection?: string }): ReactNode | Element;
  sort?(settings: { sortBy: string; sortDirection: string }): any;
}

export interface TableStateFilters {
  [key: string]: string[];
}

export interface IFetchData {
  page: number;
  filters: TableStateFilters;
  offset: number;
  limit: number;
  pageRange: number;
  searchQuery: string;
  sortBy: string;
  sortDirection: string;
}

export interface IResponseList<T> {
  data: T;
  total: number;
}

export interface IFilterItem {
  value: string | number;
  label: string;
}
