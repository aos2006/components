import cn from 'classnames';
import { Observer, observer } from 'mobx-react';
import React, { Component } from 'react';
import styles from './Column.styl';

interface IColumnProps<T> {
  align: string | 'center' | 'right' | 'small';
  type: string | 'small' | 'medium';
  store: T;
  className?: string;

  component(data: T): any;
}

@observer
export default class Column<T = any> extends Component<IColumnProps<T>> {
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    const { align, type, className } = this.props;

    return (
      <div
        className={cn({
          [styles.col]: true,
          [styles.center]: align === 'center',
          [styles.right]: align === 'right',
          [styles.small]: type === 'small',
          [className]: true,
        })}
      >
        <div className={styles.inner}>
          <Observer render={() => this.props.component(this.props.store)} />
        </div>
      </div>
    );
  }
}
