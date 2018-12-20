import { spaceSeparateThousands } from '@latoken-component/utils';
import React from 'react';
import styles from './styles.styl';
import { renderFullTime } from './renders';

const marketHistoryColumns = [
  {
    title: 'Time',
    dataIndex: 'time',
    render: renderFullTime,
    width: 90,
  },
  {
    title: 'Price',
    dataIndex: 'price',
    align: 'right',
    render: (price, record) => (
      <span className={record.isGreen ? styles.greenContent : styles.redContent}>
        {spaceSeparateThousands(record.pricePrecised.toFixed(record.precisionPrice), ',')}
      </span>
    ),
    width: 110,
  },
  {
    title: 'Total',
    dataIndex: 'totalTraded',
    align: 'right',
    render: (text, record) =>
      spaceSeparateThousands(parseFloat(text).toFixed(record.precisionAmount), ','),
    width: 110,
  },
  {
    title: 'Value',
    dataIndex: 'totalBase',
    align: 'right',
    render: (text, record) =>
      spaceSeparateThousands(parseFloat(record.totalBase).toFixed(record.precisionTotal), ','),
    width: 110,
  },
];

const myOrdersColumns = [
  {
    title: 'Time',
    className: styles.timeColumn,
    dataIndex: 'time',
    render: renderFullTime,
  },
  {
    title: 'Price',
    className: styles.priceColumn,
    dataIndex: 'avgPrice',
    align: 'right',
    render: (text, record) => (
      <span className={record.side === 'buy' ? styles.greenContentMobile : styles.redContentMobile}>
        {spaceSeparateThousands(
          (parseFloat(record.isFilled ? record.avgPrice : record.price) || 0).toFixed(
            record.precisionPrice
          ),
          ','
        )}
      </span>
    ),
  },
  {
    title: 'Filled',
    className: styles.centerColumn,
    dataIndex: 'filled',
    align: 'right',
    render: (text, record) =>
      spaceSeparateThousands(parseFloat(text).toFixed(record.precisionAmount), ','),
  },
  {
    title: 'Total',
    className: styles.centerColumn,
    dataIndex: 'total',
    align: 'right',
    render: (text, record) =>
      spaceSeparateThousands(parseFloat(text).toFixed(record.precisionAmount), ','),
  },
  {
    title: 'Value',
    mobileHidden: true,
    className: styles.centerColumn,
    dataIndex: 'value',
    align: 'right',
    render: (text, record) =>
      spaceSeparateThousands(parseFloat(text).toFixed(record.precisionTotal), ','),
  },
  {
    title: 'Side',
    mobileHidden: true,
    className: styles.sideColumn,
    dataIndex: 'createTimestamp',
    align: 'right',
    render: (text, record) => (
      <span className={record.side === 'sell' ? styles.redContent : styles.greenContent}>
        {record.side === 'sell' ? 'Sell' : 'Buy'}
      </span>
    ),
  },
  {
    title: '',
    className: styles.actionColumn,
    dataIndex: 'close',
    align: 'right',
  },
];

const myTradesColumns = [
  {
    title: 'Time',
    dataIndex: 'time',
    className: styles.timeColumn,
    render: renderFullTime,
  },
  {
    title: 'Price',
    dataIndex: 'price',
    align: 'right',
    className: styles.priceColumn,
    render: (text, record) => (
      <span className={record.side === 'buy' ? styles.greenContentMobile : styles.redContentMobile}>
        {spaceSeparateThousands(
          (parseFloat(record.isFilled ? record.avgPrice : record.price) || 0).toFixed(
            record.precisionPrice
          ),
          ','
        )}
      </span>
    ),
  },
  {
    title: 'Total',
    className: styles.centerColumn,
    dataIndex: 'totalTraded',
    align: 'right',
    render: (text, record) =>
      spaceSeparateThousands(parseFloat(text).toFixed(record.precisionAmount), ','),
  },
  {
    title: 'Value',
    className: styles.centerColumn,
    dataIndex: 'totalBase',
    align: 'right',
    render: (text, record) =>
      spaceSeparateThousands(parseFloat(record.totalBase).toFixed(record.precisionTotal), ','),
  },
  {
    title: 'Side',
    className: styles.sideColumn,
    dataIndex: 'createTimestamp',
    mobileHidden: true,
    align: 'right',
    render: (text, record) => (
      <span className={record.side === 'sell' ? styles.redContent : styles.greenContent}>
        {record.side === 'sell' ? 'Sell' : 'Buy'}
      </span>
    ),
  },
];

export default {
  marketHistoryColumns,
  myOrdersColumns,
  myTradesColumns,
};
