import DraggableAndScrollable, { DraggableHandle } from '@latoken-component/draggableAndScrollable';
import { Default, Mobile } from '@latoken-component/responsiver';
import cn from 'classnames';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { IObservableArray, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { CSSProperties } from 'react';
import { InjectedI18nAndTranslateProps, translate } from 'react-i18next';
import depths from './helpers/depths';
import groupedOrders from './helpers/groupedOrders';
import DragMarker from './inner/DragMarker';
import PrecisionRow from './inner/PrecisionRow';
import TableOrders from './inner/TableOrders';
import ValuesRows from './inner/ValuesRows';
import styles from './styles.styl';
import LastPriceBlock from './LastPriceBlock';

export const minPrecision = 1;

const rowHeight = 16;
const lastPriceHeight = 40;
const visibleRows = 8;
const loadRows = 15;
let orderBookScrollableHeight = rowHeight * visibleRows * 2 + lastPriceHeight; // 16 ячеек по 16 пикселей + высота средней плашки

export interface IOrder {
  accumulated: number;
  amount: number;
  price: number;
  total: number;
}

export interface IGroupedOrder {
  price: number;
  amount: number;
  total: number;
}

export type IKeysGroupedOrder = keyof IGroupedOrder;

export type IOrderType = 'sell' | 'buy';

export interface ICurrency {
  shortName?: string;
  rate?: number;
  precision?: number;
}

export interface ICurrentAsset {
  precisionAmount?: number;
  precisionPrice?: number;
  precisionTotal?: number;
  lastPrice?: number;
  prevLastPrice?: number;
  change24h?: string;
}

export type ISize = 'small' | 'default';

export interface IOrderBookProps {
  className?: string;
  size?: ISize;
  baseCurrency?: ICurrency;
  tradedCurrency?: ICurrency;
  currentAsset: ICurrentAsset;
  sellOrders: IObservableArray<IOrder>;
  buyOrders: IObservableArray<IOrder>;
  innerStyle: CSSProperties;
  priceDynamics?: {
    isUp: boolean;
    isDown: boolean;
  };

  onOrderClicked?(result: {
    price: number;
    amount: number;
    total: number;
    orderType: IOrderType;
  }): void;

  onChangeDecimal?(result: { type: 'minus' | 'plus'; decimal: number; tradinPair: string }): void;
}

@translate('Market')
@observer
export default class OrderBook extends React.Component<
  IOrderBookProps & InjectedI18nAndTranslateProps
> {
  static defaultProps = {
    size: 'default',
    baseCurrency: {},
    currentAsset: {},
    tradedCurrency: {},
  };

  lastPriceRow: HTMLTableRowElement;

  @computed
  get maxPresition(): number {
    return this.props.currentAsset.precisionPrice || 8;
  }

  @observable precision = this.maxPresition;

  @computed
  get groupedOrders(): {
    groupedBuyOrders: IGroupedOrder[];
    groupedSellOrders: IGroupedOrder[];
  } {
    const { precision } = this;
    const { buyOrders, sellOrders, size } = this.props;

    const groupedBuyOrders = groupedOrders({
      orders: buyOrders,
      precision,
      customRoundFunction: Math.floor,
    }).slice(0, loadRows);

    let groupedSellOrders = groupedOrders({
      orders: sellOrders,
      precision,
      customRoundFunction: Math.ceil,
    }).slice(0, loadRows);

    if (size !== 'small') {
      groupedSellOrders = groupedSellOrders.reverse();
    }
    return {
      groupedBuyOrders,
      groupedSellOrders,
    };
  }

  @computed
  get totalGroupedOrderCount(): number {
    const { groupedBuyOrders, groupedSellOrders } = this.groupedOrders;
    return (groupedBuyOrders.length || 0) + (groupedSellOrders.length || 0);
  }

  @computed
  get depths() {
    const { size } = this.props;
    const { groupedBuyOrders, groupedSellOrders } = this.groupedOrders;
    const buyDepths = depths(groupedBuyOrders, 'total');
    const sellDepths =
      size === 'small'
        ? depths(groupedSellOrders, 'total')
        : depths([...groupedSellOrders].reverse(), 'total').reverse();
    return {
      buyDepths,
      sellDepths,
      maxBuyDepth: _.max(buyDepths),
      maxSellDepth: _.max(sellDepths),
    };
  }

  @computed
  get startOffset() {
    orderBookScrollableHeight = rowHeight * visibleRows * 2 + lastPriceHeight;

    const { groupedSellOrders } = this.groupedOrders;

    const firstHalfOrdersBookHeight = groupedSellOrders.length * rowHeight + lastPriceHeight / 2;
    return orderBookScrollableHeight / 2 - firstHalfOrdersBookHeight;
  }

  @autobind
  onIncreasePrecision() {
    const {
      onChangeDecimal = () => {},
      tradedCurrency: { shortName },
    } = this.props;
    if (this.precision < this.maxPresition) {
      this.precision += 1;
      onChangeDecimal({
        type: 'plus',
        decimal: this.precision,
        tradinPair: shortName,
      });
    }
  }

  @autobind
  onDecreasePrecision() {
    const {
      onChangeDecimal = () => {},
      tradedCurrency: { shortName },
    } = this.props;
    if (this.precision > minPrecision) {
      this.precision -= 1;
      onChangeDecimal({
        type: 'minus',
        decimal: this.precision,
        tradinPair: shortName,
      });
    }
  }

  valuesRows(orderType: IOrderType) {
    const { size, baseCurrency, currentAsset } = this.props;

    const { groupedBuyOrders, groupedSellOrders } = this.groupedOrders;
    const { buyDepths, sellDepths, maxBuyDepth, maxSellDepth } = this.depths;

    const groupedOrders = orderType === 'sell' ? groupedSellOrders : groupedBuyOrders;
    const depths = orderType === 'sell' ? sellDepths : buyDepths;
    const maxDepths = orderType === 'sell' ? maxSellDepth : maxBuyDepth;

    return (
      <ValuesRows
        isReverted={this.getIsReverted(orderType, size)}
        orderType={orderType}
        depths={depths}
        maxDepths={maxDepths}
        groupedOrders={groupedOrders}
        size={size}
        currentAsset={currentAsset}
        basePrecision={baseCurrency.precision || 8}
        precision={this.precision}
        rowHeight={rowHeight}
        onOrderClicked={this.props.onOrderClicked}
      />
    );
  }

  getIsReverted(orderType: IOrderType, size: ISize): boolean {
    // развернутый саписок в всех отоброжениях
    if (orderType === 'buy') {
      return true;
    }
    // мобильная красный столбец
    if (orderType === 'sell' && size === 'small') {
      return true;
    }

    return false;
  }

  render() {
    const {
      tradedCurrency,
      baseCurrency,
      currentAsset,
      innerStyle,
      className,
      size,
      priceDynamics = { isUp: false, isDown: false },
      t,
    } = this.props;

    return (
      <>
        <Default key="desktop" className={cn(styles.orderBook, className)}>
          <PrecisionRow
            precision={this.precision}
            maxPrecision={this.maxPresition}
            onIncreasePrecision={this.onIncreasePrecision}
            onDecreasePrecision={this.onDecreasePrecision}
          />
          <div>
            <TableOrders size={size}>
              <tr>
                <th style={{ height: rowHeight }} className={styles.priceColumn}>
                  {t('Price')} ({baseCurrency.shortName})
                </th>
                <th>
                  {t('Amount')} ({tradedCurrency.shortName})
                </th>
                <th>
                  {t('Value')} ({baseCurrency.shortName})
                </th>
                <th>
                  {t('Total')} ({baseCurrency.shortName})
                </th>
              </tr>
            </TableOrders>
          </div>

          <DraggableAndScrollable
            containerHeight={orderBookScrollableHeight}
            startOffset={this.startOffset}
          >
            <TableOrders size={size}>{this.valuesRows('sell')}</TableOrders>

            <DraggableHandle
              className={cn(styles.lastPriceRow)}
              style={{
                height: lastPriceHeight,
              }}
            >
              <LastPriceBlock
                currentAsset={currentAsset}
                baseCurrency={baseCurrency}
                precision={this.precision}
                priceDynamics={priceDynamics}
              />
              <span className={styles.dragMarkerContainer}>
                <DragMarker />
              </span>
            </DraggableHandle>

            <TableOrders size={size}>{this.valuesRows('buy')}</TableOrders>
          </DraggableAndScrollable>
        </Default>

        <Mobile key="mobile" className={cn(styles.orderBook, styles.mobileOrderBook, className)}>
          <div id="Mobile_lastPriceBlock" className={cn(styles.lastPriceRow)}>
            <LastPriceBlock
              currentAsset={currentAsset}
              baseCurrency={baseCurrency}
              precision={this.precision}
              priceDynamics={priceDynamics}
            />
          </div>
          <div id="Mobile_OrderBookHeader">
            <TableOrders style={{ width: '50%' }} size={size}>
              <tr>
                <th className={styles.priceColumn}>
                  {t('Price')} ({baseCurrency.shortName})
                </th>
                <th style={{ textAlign: 'right' }}>
                  {t('Amount')} ({tradedCurrency.shortName})
                </th>
              </tr>
            </TableOrders>

            <TableOrders style={{ width: '50%' }} size={size}>
              <tr>
                <th style={{ textAlign: 'left' }}>
                  {t('Amount')} ({tradedCurrency.shortName})
                </th>
                <th style={{ textAlign: 'right' }} className={styles.priceColumn}>
                  {t('Price')} ({baseCurrency.shortName})
                </th>
              </tr>
            </TableOrders>
          </div>
          <div className={styles.mobileOrdersTablesWrap} style={innerStyle}>
            <TableOrders size={size} style={{ width: '50%' }}>
              {this.valuesRows('buy')}
            </TableOrders>

            <div className={styles.tableDivider} />

            <TableOrders size={size} style={{ width: '50%' }}>
              {this.valuesRows('sell')}
            </TableOrders>
          </div>
          <PrecisionRow
            precision={this.precision}
            maxPrecision={this.maxPresition}
            onIncreasePrecision={this.onIncreasePrecision}
            onDecreasePrecision={this.onDecreasePrecision}
          />
        </Mobile>
      </>
    );
  }
}
