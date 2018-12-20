import React, { CSSProperties } from 'react';

import { observer } from 'mobx-react';
import { ISize } from '../OrderBook';

interface ITableOrdersProps {
  size?: ISize;
  style?: CSSProperties;
}

@observer
export default class TableOrders extends React.Component<ITableOrdersProps> {
  render() {
    const { children, size, style } = this.props;

    return (
      <table style={style}>
        {size === 'small' ? (
          <colgroup>
            <col style={{ width: '50%', minWidth: '50%' }} />
            <col style={{ width: '50%', minWidth: '50%' }} />
          </colgroup>
        ) : (
          <colgroup>
            <col style={{ width: '90px', minWidth: '90px' }} />
            <col />
            <col style={{ width: '90px', minWidth: '90px' }} />
            <col style={{ width: '90px', minWidth: '90px' }} />
          </colgroup>
        )}
        <tbody>{children}</tbody>
      </table>
    );
  }
}
