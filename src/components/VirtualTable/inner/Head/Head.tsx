import cn from 'classnames';
import React, { PureComponent } from 'react';
import SortArrows from '../SortArrows/SortArrows';
import styles from './Head.styl';

interface IHeadProps {
  sortEnabled: boolean;
  dataKey: string;
  sortDirection?: 'ASC' | 'DESC';
  label: string;
  sortBy: string;
  className?: string;
  align?: string | 'right' | 'center';
  type: string | 'small' | 'medium';
  sort?(data: { sortBy: string; sortDirection: string }): void;
}

class Head extends PureComponent<IHeadProps> {
  render() {
    const {
      sort,
      sortEnabled,
      dataKey,
      sortDirection,
      label,
      sortBy,
      className = '',
      align = '',
      type,
    } = this.props;
    return (
      <div
        className={cn([
          styles.head,
          {
            [styles.sortable]: sortEnabled,
            [styles.right]: align === 'right',
            [styles.center]: align === 'center',
            [styles.small]: type === 'small',
          },
          className,
        ])}
        onClick={() => {
          sort({ sortBy: dataKey, sortDirection });
        }}
      >
        <span className={styles.label}>{label}</span>
        {this.props.children}
        {sortEnabled && <SortArrows direction={sortBy === dataKey ? sortDirection : 'ASC'} />}
      </div>
    );
  }
}

export default Head;
