import { VirtualTable } from '@latoken-component/VirtualTable/index';
import { IColumn } from '@latoken-component/VirtualTable/interfaces';
import { observer } from 'mobx-react';
import React, { Component, ReactNode } from 'react';
import styles from './HistoryTable.styl';

interface IRowRenderData {
  className: string;
  style: object;
  index: number;
  columns: ReactNode[];
  rowData: any;
}
interface IOrdersTable {
  list: object[];
  columns: IColumn[];
  rowHeight: number;
  height: number;
  onRowRender?(data: IRowRenderData): any;
}

@observer
class HistoryTable extends Component<IOrdersTable> {
  render() {
    return (
      <div>
        <VirtualTable
          onRowRender={this.props.onRowRender}
          tableClassName={styles.historyTable}
          rowClassName={styles.row}
          striped
          type="small"
          headerHeight={25}
          staticHeight={this.props.height}
          list={this.props.list}
          rowHeight={this.props.rowHeight}
          headerClassName={styles.header}
          columns={this.props.columns}
        />
      </div>
    );
  }
}

export default HistoryTable;
