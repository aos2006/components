import React from 'react';
import { observer } from 'mobx-react';

interface ITableScroll {
  className?: string;
  onRef?: (node: HTMLDivElement) => void;
  dataLength?: number;
}

@observer
export default class TableScroll extends React.Component<ITableScroll> {
  tableRef: HTMLDivElement;
  setTableRef = ref => (this.tableRef = ref);

  setScrollClass() {
    if (this.tableRef) {
      const container = this.tableRef.getElementsByClassName('lat-table-body')[0];
      const header = this.tableRef.getElementsByClassName('lat-table-header')[0] as HTMLDivElement;
      if (container && header) {
        const tbody = container.getElementsByClassName('lat-table-tbody')[0];
        if (tbody) {
          const containerParams = container.getBoundingClientRect();
          const tbodyParams = tbody.getBoundingClientRect();
          if (containerParams.height < tbodyParams.height) {
            header.style.paddingRight = `${containerParams.width - tbodyParams.width}px`;
          } else {
            header.style.paddingRight = `0px`;
          }
        }
      }
    }
  }

  componentDidMount() {
    this.setScrollClass();
    if (this.props.onRef) {
      this.props.onRef(this.tableRef);
    }
  }

  componentDidUpdate() {
    this.setScrollClass();
  }

  render() {
    const { className, children } = this.props;
    return (
      <div ref={this.setTableRef} className={className}>
        {children}
      </div>
    );
  }
}
