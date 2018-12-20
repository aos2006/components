import cn from 'classnames';
import _ from 'lodash';
import { computed, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component } from 'react';

import Button from '@latoken-component/button';
import TableScroll from '@latoken-component/table-scroll';
import { spaceSeparateThousands } from '@latoken-component/utils';
import { mappingInfoProcessor } from './utils/marketUtils';
import columnConfig from './ColumnsConfig';

import Icon from '@latoken-component/icon';
import Table from '@latoken-component/table';
import Tabs, { TabPane } from '@latoken-component/tabs';
import { Col, Modal } from 'antd';
import { InjectedI18nAndTranslateProps, translate } from 'react-i18next';
import i18nextWithName from '@latoken-component/utils/utils/i18nextWithName';
import styles from './styles.styl';

const transNode = i18nextWithName('Market');

interface IAssetConfig {
  precisionPrice: number;
  precisionAmount: number;
  precisionTotal: number;
  market: string;
  frontType: string;
  shortName: string;
}

export interface IOrderHistoryProps {
  isMobile?: boolean;
  deleteOrder(number): void;
  updateDomStyles?(): void;
  height?: number;
  marketHistory: any[];
  filledOrders: any[];
  userOrders: any[];
  userTrades: any[];
  onTabsChange?(string): void;
  assetConfig: IAssetConfig;
  historyHiding?: boolean;
}

@translate('Market')
@observer
export default class OrdersHistory extends Component<
  IOrderHistoryProps & InjectedI18nAndTranslateProps
> {
  @computed
  get pairFrom() {
    const shortName = this.props.assetConfig.shortName;

    if (shortName) {
      const shortNameArr = shortName.split('/');

      return shortNameArr[0];
    }

    return '';
  }

  @computed
  get pairTo() {
    const shortName = this.props.assetConfig.shortName;

    if (shortName) {
      const shortNameArr = shortName.split('/');

      return shortNameArr[1] || this.props.assetConfig.market;
    }

    return '';
  }

  @observable frontType = 'Crypto'; // not update when loading

  componentWillReceiveProps(nextProps) {
    const nextPropsType = _.get(nextProps, 'assetConfig.frontType');
    const currentPropsType = _.get(this.props, 'assetConfig.frontType');

    if (nextPropsType !== 'Unknown' && nextPropsType !== currentPropsType) {
      this.frontType = nextPropsType;
    }
  }

  @computed
  get marketHistoryColumns() {
    return columnConfig.marketHistoryColumns.map(this.generateColumn);
  }

  @computed
  get myOrdersColumns() {
    let columns = columnConfig.myOrdersColumns.map(this.generateColumn);
    const isMobile = this.props.isMobile;

    columns[columns.length - 1].render = (text, record) =>
      record.disabled ? null : (
        <Icon
          onClick={() => {
            if (isMobile) {
              this.removingRecord = record;
              this.confirmDeleteOrderModalShown = true;
            } else {
              this.props.deleteOrder(record.id);
            }
          }}
          glyph={'times-circle'}
          className={styles.cancelButton}
        />
      );

    if (isMobile) {
      columns = columns.filter(i => !i.mobileHidden);
    }

    return columns;
  }

  @computed
  get myTradesColumns() {
    let columns = columnConfig.myTradesColumns.map(this.generateColumn);
    const isMobile = !!this.props.isMobile;

    if (isMobile) {
      columns = columns.filter(i => !i.mobileHidden);
    }

    return columns;
  }
  @observable confirmDeleteOrderModalShown = false;
  @observable removingRecord: { id: number } = null;
  @observable tab;
  @observable table;

  removeMapping = [
    {
      label: transNode('Time'),
      valueGetter: 'time',
      format: value => <p>{moment(value).format('HH:mm:ss, DD/MM')}</p>,
    },
    {
      label: transNode('Price ETH'),
      valueGetter: 'price',
      format: (value, rec) => (
        <span style={{ color: rec.isGreen ? '#3dbd7d' : '#ff0000', fontWeight: 'bold' }}>
          {spaceSeparateThousands(value.toFixed(rec.precisionPrice))}
        </span>
      ),
    },
    {
      label: transNode('Total LA'),
      valueGetter: 'total',
      format: value => <p>{value}</p>,
    },
  ];

  getTitle(title, pairFrom, pairTo) {
    const { t } = this.props;

    switch (title) {
      case 'Price':
        return `${t('Price')} ${pairTo}`;
      case 'Value':
        return `${t('Value')} ${pairTo}`;
      case 'Filled':
        return `${t('Filled')} ${pairFrom}`;
      case 'Total':
        return `${t('Total')} ${pairFrom}`;
      default:
        return t(title);
    }
  }

  generateColumn = column => ({
    ...column,
    title: this.getTitle(column.title, this.pairFrom, this.pairTo),
  });

  componentDidMount() {
    if (_.isFunction(this.props.updateDomStyles)) {
      this.props.updateDomStyles();
    }
  }

  componentDidUpdate() {
    if (_.isFunction(this.props.updateDomStyles)) {
      this.props.updateDomStyles();
    }
  }

  generateData = source => {
    const { precisionPrice, precisionAmount, precisionTotal } = this.props.assetConfig;
    const data = source.map(rec => ({ ...rec }));

    for (let i = data.length - 1; i >= 0; i--) {
      const item = data[i];
      const prevItem = data[i + 1];
      const prevPricePrecised = _.isNumber(_.get(prevItem, 'pricePrecised'))
        ? _.floor(_.get(prevItem, 'pricePrecised'), precisionPrice)
        : null;

      item.pricePrecised = _.floor(item.price, precisionPrice);
      item.precisionPrice = precisionPrice;
      item.precisionAmount = precisionAmount;
      item.precisionTotal = precisionTotal;

      /**
       * Зеленым рисуем цену, если цена выше предыдущей сделки.
       * Первую цену раскрашиваем по направлению сделки
       * *
       */

      item.isGreen = item.side === 'buy';

      if (_.isNumber(prevPricePrecised)) {
        if (prevPricePrecised === item.pricePrecised) {
          item.isGreen = prevItem.isGreen;
        } else {
          item.isGreen = item.pricePrecised > prevPricePrecised;
        }
      }
    }

    return data;
  };

  onChangeTab = tab => {
    this.tab = tab;

    if (_.isFunction(this.props.onTabsChange)) {
      this.props.onTabsChange(tab);
    }
  };

  @computed
  get marketHistoryData() {
    return this.generateData(this.props.marketHistory);
  }

  @computed
  get filledOrdersData() {
    return this.generateData(this.props.filledOrders);
  }

  @computed
  get myOrdersActive() {
    return this.generateData(this.props.userOrders);
  }

  @computed
  get myOrdersAll() {
    const filledOrdersData = this.generateData(this.props.filledOrders);

    return [].concat(
      this.myOrdersActive,
      filledOrdersData.map(rec => ({ ...rec, disabled: true, isFilled: true }))
    );
  }

  @computed
  get myTrades() {
    return this.generateData(this.props.userTrades);
  }

  render() {
    const { t } = this.props;
    const { historyHiding } = this.props;

    const { marketHistoryData, myOrdersActive, myOrdersAll, myTrades } = this;

    const MyOrdersTab = (
      <div className={styles.infoPreviewWrap}>
        {t('MY ORDERS')}
        {myOrdersActive.length > 0 && (
          <div className={styles.infoPreview}>{myOrdersActive.length}</div>
        )}
      </div>
    );

    let tableHeight = 298;

    if (this.props.isMobile) {
      tableHeight = this.props.height;
    }

    const showMyOrders = this.frontType === 'Crypto' || this.frontType === 'Assets';
    // TODO move this boolean to up level
    const showMarketHistory = historyHiding && this.frontType === 'ICO' ? false : true;

    return (
      <div className={styles.ordersContainer}>
        <Tabs
          onChange={this.onChangeTab}
          defaultActiveKey={this.tab || (showMyOrders ? 'myOrders' : 'myTrades')}
          className={styles.orderTabs}
        >
          {showMyOrders && (
            <TabPane tab={MyOrdersTab} key="myOrders">
              <TableScroll className={cn(styles.ordersTable, styles.myOrders)}>
                <Table
                  ref={node => (this.table = node)}
                  size="small"
                  columns={this.myOrdersColumns}
                  dataSource={myOrdersAll}
                  rowKey={(dataSource, i) => String(i)}
                  scroll={{ y: tableHeight }}
                  pagination={false}
                  striped
                  rowClassName={rec => (rec.disabled ? styles.disabledRow : '')}
                />
              </TableScroll>
            </TabPane>
          )}
          <TabPane tab={t('MY TRADES')} key="myTrades">
            <TableScroll className={cn(styles.ordersTable, styles.myOrders)}>
              <Table
                size="small"
                columns={this.myTradesColumns}
                dataSource={myTrades}
                rowKey={(dataSource, i) => String(i)}
                scroll={{ y: tableHeight }}
                pagination={false}
                striped
              />
            </TableScroll>
          </TabPane>
          {showMarketHistory && (
            <TabPane tab={t('MARKET HISTORY')} key="marketHistory">
              <TableScroll className={cn(styles.ordersTable, styles.marketHistory)}>
                <Table
                  size="small"
                  columns={this.marketHistoryColumns}
                  dataSource={marketHistoryData}
                  rowKey={(dataSource, i) => String(i)}
                  scroll={{ y: tableHeight }}
                  pagination={false}
                  striped
                />
              </TableScroll>
            </TabPane>
          )}
        </Tabs>
        <Modal
          visible={this.confirmDeleteOrderModalShown}
          width={250}
          className={styles.mobileOrderRemoveConfirm}
          onCancel={() => (this.confirmDeleteOrderModalShown = false)}
          closable={true}
          style={{ top: this.props.isMobile ? '0' : '48%' }}
          footer={[
            <Button
              key="back"
              size="large"
              onClick={() => (this.confirmDeleteOrderModalShown = false)}
            >
              CANCEL
            </Button>,
            <Button
              key="submit"
              size="large"
              onClick={() => {
                this.props.deleteOrder(this.removingRecord.id);
                this.confirmDeleteOrderModalShown = false;
              }}
            >
              {t('REMOVE ORDER')}
            </Button>,
          ]}
        >
          <Col>
            {mappingInfoProcessor({
              data: toJS(this.removingRecord),
              fieldsArray: this.removeMapping,
              template: (label, value) => (
                <div className={styles.recordRow}>
                  <span>{label}</span>
                  {value}
                </div>
              ),
            })}
          </Col>
        </Modal>
      </div>
    );
  }
}
