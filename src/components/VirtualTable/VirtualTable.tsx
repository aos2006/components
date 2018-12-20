import cn from 'classnames';
import { observer } from 'mobx-react';
import { Component } from 'react';
import * as React from 'react';
import {
  AutoSizer,
  CellMeasurerCache,
  Column,
  ColumnSizer,
  Table,
  TableCellProps,
} from 'react-virtualized';
import 'react-virtualized/styles.css';
import Col from './inner/Column/Column';
import Filters from './inner/Filters/Filters';
import Head from './inner/Head/Head';
import NoData from './inner/NoData/NoData';
import { IColumn, ITableProps } from './interfaces';
import { getType } from './types';
import styles from './VirtualTable.styl';

@observer
export default class VirtualTable<T = any> extends Component<ITableProps> {
  static defaultProps = {
    children: () => {},
    onRowClick: () => {},
    sortBy: '',
    rowHeight: null,
    onRowRender: null,
    columns: [],
    sortDirection: 'ASC',
    staticHeight: null,
    headerHeight: null,
    sort: () => {},
    list: [],
    striped: false,
    disableHeader: false,
    type: 'medium',
    tableClassName: '',
    headerClassName: '',
    rowClassName: '',
  };
  Table = null;

  state = {
    loadedRowCount: 0,
    loadedRowsMap: {},
    loadingRowCount: 0,
  };

  cache = new CellMeasurerCache({
    minHeight: 20,
    minWidth: 50,
    fixedWidth: false,
    fixedHeight: true,
    defaultHeight: 20,
    defaultWidth: 50,
  });
  defaultColumnProps: IColumn<T> = {
    align: 'left',
    flexGrow: 1,
    disableSort: true,
    dataKey: '',
    id: null,
    label: '',
    getComponent: () => null,
  };

  rowRender = ({ className, style, index, columns, rowData }) => {
    const { className: customClassName } = this.props.onRowRender
      ? this.props.onRowRender({ className, style, index, rowData: this.props.list[rowData] })
      : { className: '' };
    return (
      <div
        aria-rowindex={index}
        aria-label="row"
        role="row"
        tabIndex={0}
        className={cn([
          className,
          {
            [styles.row]: true,
          },
          customClassName,
        ])}
        style={style}
        key={index}
      >
        {columns}
      </div>
    );
  };

  rowGetter = ({ index }) => index;

  sort = ({ sortBy, sortDirection = 'ASC' }) =>
    this.props.sort
      ? this.props.sort({ sortBy, sortDirection: sortDirection === 'ASC' ? 'DESC' : 'ASC' })
      : null;

  cellRender = col => ({
    cellData,
    columnIndex,
    rowData,
    rowIndex,
    parent,
    ...rest
  }: TableCellProps) => (
    <Col
      className={col.className}
      type={this.props.type}
      align={col.align}
      component={col.getComponent}
      store={this.props.list[cellData]}
    />
  );

  headerRenderer = column => {
    const { sortBy, sortDirection } = this.props;
    const { dataKey = '', label, disableSort, align, filters = [] } = column;
    const sortEnabled = !disableSort;

    return (
      <Head
        type={this.props.type}
        className={column.headerClassName}
        sort={this.sort}
        align={align}
        sortBy={sortBy}
        sortDirection={sortDirection}
        dataKey={dataKey}
        label={label}
        sortEnabled={sortEnabled}
      >
        {filters.length > 0 && (
          <Filters
            filters={filters}
            className={styles.filters}
            handlePick={picked => this.props.onFiltersPick(dataKey, picked)}
            handleReset={picked => this.props.onFiltersPick(dataKey, picked)}
          />
        )}
      </Head>
    );
  };
  headerRowRender = ({ style, className, columns }) => (
    <div className={className} style={style} role="headerrow">
      {columns.map((col, index) => (
        <div
          className={cn([styles.header, this.props.cellWrapperClassName])}
          role="columnheader"
          style={col.props.style}
        >
          {this.headerRenderer(this.props.columns[index])}
        </div>
      ))}
    </div>
  );

  calculateHeight() {
    const { headerHeight, rowHeight } = getType(this.props.type);

    const TABLE_HEIGHT = this.props.list.length * rowHeight + headerHeight;

    const MAX_HEIGHT = TABLE_HEIGHT < 800;

    if (this.props.staticHeight) {
      return this.props.staticHeight;
    }

    if (MAX_HEIGHT) {
      return TABLE_HEIGHT;
    }

    return 800;
  }

  onRowClick = ({ rowData }) => {
    if (this.props.onRowClick) {
      this.props.onRowClick({ data: this.props.list[rowData] });
    }
  };

  getRowHeight() {
    const { rowHeight } = this.props;
    return rowHeight ? rowHeight : getType(this.props.type);
  }

  render() {
    const { disableHeader, striped } = this.props;
    const { headerHeight } = getType(this.props.type);

    return (
      <div>
        <AutoSizer disableHeight>
          {({ width }) => (
            <ColumnSizer
              width={width}
              columnMaxWidth={500}
              columnMinWidth={100}
              columnCount={this.props.columns.length}
            >
              {({ adjustedWidth, getColumnWidth, registerChild }) => (
                <Table
                  rowRenderer={this.rowRender}
                  ref={registerChild}
                  headerRowRenderer={this.headerRowRender}
                  onRowClick={this.onRowClick}
                  gridClassName={styles.grid}
                  sort={this.sort}
                  sortBy={this.props.sortBy}
                  sortDirection={this.props.sortDirection}
                  autoHeight={this.props.autoHeight}
                  noRowsRenderer={() => <NoData />}
                  rowCount={this.props.list.length}
                  className={cn([
                    {
                      [styles.table]: true,
                      [styles.striped]: striped,
                    },
                    this.props.tableClassName,
                  ])}
                  rowClassName={cn([
                    {
                      [styles.row]: true,
                      [this.props.rowClassName]: true,
                    },
                  ])}
                  disableHeader={disableHeader}
                  headerClassName={cn([
                    {
                      [styles.header]: true,
                    },
                    this.props.headerClassName,
                  ])}
                  headerHeight={this.props.headerHeight || headerHeight}
                  height={this.calculateHeight()}
                  rowHeight={this.getRowHeight()}
                  rowGetter={this.rowGetter}
                  width={width}
                >
                  {this.props.columns.map(col => {
                    const columnProps = {
                      ...this.defaultColumnProps,
                      ...col,
                      width: col.width || getColumnWidth(),
                    };

                    if (!columnProps.id) {
                      throw new Error('ID is must have attr, see REACT DOCS, key for optimization');
                    }

                    return (
                      <Column
                        id={columnProps.id}
                        className={cn([
                          this.props.cellWrapperClassName,
                          columnProps.className || '',
                        ])}
                        dataKey={columnProps.dataKey}
                        key={columnProps.id}
                        cellDataGetter={({ rowData }) => rowData}
                        label={columnProps.label}
                        style={columnProps.style}
                        headerStyle={columnProps.headerStyle}
                        maxWidth={columnProps.maxWidth}
                        minWidth={columnProps.minWidth}
                        width={col.width || getColumnWidth()}
                        flexGrow={columnProps.flexGrow || 1}
                        flexShrink={columnProps.flexShrink}
                        cellRenderer={this.cellRender(columnProps)}
                      />
                    );
                  })}
                </Table>
              )}
            </ColumnSizer>
          )}
        </AutoSizer>
        {this.props.children({
          sortBy: this.props.sortBy,
          sortDirection: this.props.sortDirection,
        })}
      </div>
    );
  }
}
