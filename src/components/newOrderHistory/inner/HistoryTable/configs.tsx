import Icon from '@latoken-component/icon/index';
import { convertFromUnix } from '@latoken-component/latoken-data';
import { spaceSeparateThousands } from '@latoken-component/utils';
import cn from 'classnames';
import React from 'react';
import uuid from 'uuid/v1';
import styles from './HistoryTable.styl';

const createTimeColumn = ({ width }) => props => ({
  id: uuid(),
  align: 'left',
  name: 'time',
  disableSort: true,
  dataKey: 'time',
  label: props.t('Time'),
  width,
  className: styles.cell,
  headerClassName: styles.headerCell,
  getComponent: data => <span>{convertFromUnix(data.time)}</span>,
});

const createValueColumn = ({ width }) => props => ({
  id: uuid(),
  name: 'value',
  disableSort: true,
  label: `${props.t('Value')} ${props.assetConfig.baseCurrencyName}`,
  width,
  align: 'right',
  className: styles.cell,
  headerClassName: styles.headerCell,
  getComponent: data => (
    <span>{spaceSeparateThousands(data.cost.toFixed(props.assetConfig.precisionTotal))}</span>
  ),
});

const createSideColumn = ({ width }) => props => ({
  id: uuid(),
  name: 'side',
  width,
  minWidth: 10,
  align: 'right',
  label: props.t('Side'),
  className: styles.cell,
  headerClassName: styles.headerCell,
  disableSort: true,
  getComponent: data => (
    <span
      className={cn({
        [styles.buy]: data.side === 'buy',
        [styles.sell]: data.side === 'sell',
      })}
    >
      {data.side}
    </span>
  ),
});

const createTotalColumn = ({ width }) => props => ({
  id: uuid(),
  name: 'total',
  width,
  disableSort: true,
  label: `${props.t('Total')} ${props.assetConfig.targetCurrencyName}`,
  align: 'right',
  className: styles.cell,
  headerClassName: styles.headerCell,
  getComponent: data => (
    <span>{spaceSeparateThousands(data.cost.toFixed(props.assetConfig.precisionTotal))}</span>
  ),
});

const createPriceColumn = ({ width }) => props => ({
  id: uuid(),
  name: 'price',
  label: `${props.t('Price')} ${props.assetConfig.baseCurrencyName}`,
  disableSort: true,
  width,
  align: 'right',
  className: styles.cell,
  headerClassName: styles.headerCell,
  getComponent: data => (
    <span>{spaceSeparateThousands(data.price.toFixed(props.precisionPrice))}</span>
  ),
});

const createFilledColumn = ({ width }) => props => ({
  id: uuid(),
  name: 'filled',
  label: `${props.t('Filled')} ${props.assetConfig.targetCurrencyName}`,
  disableSort: true,
  width,
  align: 'right',
  className: styles.cell,
  headerClassName: styles.headerCell,
  getComponent: data => (
    <span>{spaceSeparateThousands(data.quantity.toFixed(props.assetConfig.precisionAmount))}</span>
  ),
});

const createActionColumn = () => props => ({
  id: uuid(),
  name: 'action',
  align: 'right',
  disableSort: true,
  className: styles.cell,
  headerClassName: styles.headerCell,
  width: 32,
  maxWidth: 32,
  minWidth: 32,
  label: '',
  getComponent: data => {
    const notFilled = !data.isFilled;
    return (
      notFilled && (
        <span onClick={() => props.onDelete(data.id)}>
          <Icon glyph="times-circle" className={styles.iconDelete} />
        </span>
      )
    );
  },
});

const marketValueColumn = props => ({
  id: uuid(),
  name: 'price',
  label: `${props.t('Price')} ${props.assetConfig.baseCurrencyName}`,
  className: styles.cell,
  headerClassName: styles.headerCell,
  disableSort: true,
  width: 61,
  align: 'right',
  getComponent: data => (
    <span
      className={cn({
        [styles.buy]: props.store.isPositive(data.id),
        [styles.sell]: props.store.isNegative(data.id),
      })}
    >
      {spaceSeparateThousands(data.price.toFixed(props.assetConfig.precisionPrice))}
    </span>
  ),
});

export const orders = [
  createTimeColumn({ width: 95 }),
  createPriceColumn({ width: 61 }),
  createFilledColumn({ width: 68 }),
  createTotalColumn({ width: 68 }),
  createValueColumn({ width: 61 }),
  createSideColumn({ width: 32 }),
  createActionColumn(),
];

export const trades = [
  createTimeColumn({ width: 110 }),
  createPriceColumn({ width: 80 }),
  createTotalColumn({ width: 88 }),
  createValueColumn({ width: 88 }),
  createSideColumn({ width: 48 }),
];

export const markets = [
  createTimeColumn({ width: 25 }),
  marketValueColumn,
  createTotalColumn({ width: 25 }),
  createValueColumn({ width: 25 }),
];
