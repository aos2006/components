import spaceSeparateThousands from '@latoken-component/utils/utils/spaceSeparateThousands';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import arrayLengthIsEven from '../helpers/arrayLengthIsEven';
import correlatingPriceValue from '../helpers/correlatingPriceValue';
import styles from '../styles.styl';
import { ICurrentAsset, IGroupedOrder, IOrderType, ISize } from '../OrderBook';
import MeaningfulNumber from './MeaningfulNumber';

interface IValuesRowsProps {
  size: ISize;
  groupedOrders: IGroupedOrder[];
  rowHeight: number;
  orderType: IOrderType;
  depths: number[];
  maxDepths: number;
  currentAsset: ICurrentAsset;
  precision: number;
  basePrecision: number;
  isReverted?: boolean;

  onOrderClicked?(result: {
    price: number;
    amount: number;
    total: number;
    orderType: IOrderType;
  }): void;
}

@inject()
@observer
export default class ValuesRows extends React.Component<IValuesRowsProps> {
  cellTotal: HTMLTableHeaderCellElement;
  cellAmount: HTMLTableHeaderCellElement;
  cellValue: HTMLTableHeaderCellElement;

  @observable cellTotalWidth: number;
  @observable cellAmountWidth: number;
  @observable cellValueWidth: number;

  @computed
  get maxWidthBar() {
    if (this.props.size === 'small' && this.cellAmountWidth) {
      return this.cellAmountWidth;
    } else if (this.cellAmountWidth && this.cellTotalWidth && this.cellValueWidth) {
      return this.cellAmountWidth + this.cellTotalWidth + this.cellValueWidth;
    }

    return 300;
  }

  componentDidMount() {
    this.onWindowResize();
    window.addEventListener('resize', this.onWindowResize);
  }

  componentDidUpdate() {
    this.onWindowResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  onOrderClicked(price, amount, total, orderType) {
    if (this.props.onOrderClicked) {
      this.props.onOrderClicked({
        price,
        amount,
        total,
        orderType,
      });
    }
  }

  @autobind
  onWindowResize() {
    if (this.cellTotal) {
      this.cellTotalWidth = this.cellTotal.offsetWidth;
    }
    if (this.cellAmount) {
      this.cellAmountWidth = this.cellAmount.offsetWidth;
    }
    if (this.cellValue) {
      this.cellValueWidth = this.cellValue.offsetWidth;
    }
  }

  bar(index, maxWidthBar) {
    const { depths, maxDepths } = this.props;

    return (
      <div
        className={styles.cellBar}
        style={{
          width: maxDepths > 0 ? maxWidthBar * (depths[index] / maxDepths) : 0,
        }}
      />
    );
  }

  render() {
    const {
      groupedOrders,
      rowHeight,
      currentAsset,
      precision,
      depths,
      basePrecision,
      size,
      orderType,
      isReverted,
    } = this.props;

    return (
      <>
        {arrayLengthIsEven(groupedOrders) && <tr className={styles.fakeRow} />}
        {_.map(groupedOrders, (order, index) => (
          <tr
            key={order.price}
            className={orderType === 'buy' ? styles.buyRow : styles.sellRow}
            style={{ height: rowHeight }}
            onClick={evt => {
              evt.preventDefault();

              let depthAmount = 0;

              const groupedOrdersResolve = isReverted
                ? [...groupedOrders].reverse()
                : groupedOrders;
              const indexResolve = isReverted ? groupedOrdersResolve.length - index - 1 : index;

              for (let i = groupedOrdersResolve.length - 1; i >= indexResolve; i--) {
                depthAmount += groupedOrdersResolve[i].amount;
              }
              this.onOrderClicked(
                order.price,
                depthAmount.toFixed(currentAsset.precisionAmount),
                order.total,
                orderType
              );
            }}
          >
            {size !== 'small' ? (
              <>
                <td className={styles.priceColumn}>
                  <MeaningfulNumber
                    value={order.price}
                    correlatingValue={correlatingPriceValue(groupedOrders, index + 1)}
                    precision={precision}
                  />
                </td>
                <td ref={el => (this.cellAmount = el)}>
                  {spaceSeparateThousands(order.amount.toFixed(currentAsset.precisionAmount), ',')}
                </td>

                <td ref={el => (this.cellValue = el)}>
                  <span className={styles.cellContent}>
                    {spaceSeparateThousands(order.total.toFixed(basePrecision), ',')}
                  </span>
                </td>
                <td ref={el => (this.cellTotal = el)}>
                  <span className={styles.cellContent}>
                    {spaceSeparateThousands(
                      depths[index].toFixed(currentAsset.precisionAmount),
                      ','
                    )}
                  </span>
                  {this.bar(index, this.maxWidthBar)}
                </td>
              </>
            ) : orderType === 'sell' ? (
              <>
                <td style={{ textAlign: 'left' }} ref={el => (this.cellAmount = el)}>
                  <span className={styles.cellContent}>
                    {spaceSeparateThousands(
                      order.amount.toFixed(currentAsset.precisionAmount),
                      ','
                    )}
                  </span>
                  {this.bar(index, this.maxWidthBar)}
                </td>
                <td className={styles.priceColumn} style={{ textAlign: 'right' }}>
                  <MeaningfulNumber
                    value={order.price}
                    correlatingValue={correlatingPriceValue(groupedOrders, index - 1)}
                    precision={precision}
                  />
                </td>
              </>
            ) : orderType === 'buy' ? (
              <>
                <td className={styles.priceColumn} style={{ textAlign: 'left' }}>
                  <MeaningfulNumber
                    value={order.price}
                    correlatingValue={correlatingPriceValue(groupedOrders, index - 1)}
                    precision={precision}
                  />
                </td>
                <td style={{ textAlign: 'right' }} ref={el => (this.cellAmount = el)}>
                  <span className={styles.cellContent}>
                    {spaceSeparateThousands(
                      order.amount.toFixed(currentAsset.precisionAmount),
                      ','
                    )}
                  </span>
                  {this.bar(index, this.maxWidthBar)}
                </td>
              </>
            ) : null}
          </tr>
        ))}
      </>
    );
  }
}
