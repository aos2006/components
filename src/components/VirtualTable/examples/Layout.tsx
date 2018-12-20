import React, { Component } from 'react';
import TableSizes from './TableSizes';
import styles from './Layout.styl';

class Layout extends Component {
  render() {
    return (
      <div className={styles.layout}>
        <TableSizes />
      </div>
    );
  }
}
export default Layout;
