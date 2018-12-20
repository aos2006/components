import React from 'react';
import divideEmptyZeros from '@latoken-component/utils/utils/divideEmptyZeros';
import spaceSeparateThousands from '@latoken-component/utils/utils/spaceSeparateThousands';
import styles from './NumberWithZeros.styl';
import _ from 'lodash';
import cn from 'classnames';

interface IProps {
  value: number;
  precision?: number;
  className?: string;
  style?: React.CSSProperties;
  isPositive?: boolean;
  customSeparator?: string;
}

export default function NumberWithZeros({
  value,
  precision = 8,
  className,
  style,
  isPositive = true,
  customSeparator = ',',
}: IProps): JSX.Element {
  if (!_.isNumber(value)) {
    return (
      <div className={cn(styles.NumberWithZeros, className)} style={style}>
        —
      </div>
    );
  }
  let valueResolve = value;
  if (isPositive && valueResolve < 0) {
    valueResolve = 0;
  }
  const valueStr = valueResolve.toFixed(precision);
  const [start, empty] = divideEmptyZeros(valueStr);

  return (
    <div className={cn(styles.NumberWithZeros, className)} style={style}>
      <span className={styles.valueStart}>{spaceSeparateThousands(start, customSeparator)}</span>
      {empty != null && <span className={styles.valueEmpty}>{empty}</span>}
    </div>
  );
}
