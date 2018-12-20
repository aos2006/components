import * as React from 'react';
import classNames from 'classnames';
import styles from './style/index.styl';

export interface CardGridProps {
  style?: React.CSSProperties;
  className?: string;
}

export default (props: CardGridProps) => {
  const { className, ...others } = props;
  const classString = classNames(styles['card-grid'], className);
  return <div {...others} className={classString} />;
};
