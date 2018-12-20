import Badge from '@latoken-component/badge';
import Tabs from '@latoken-component/tabs';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { InjectedI18nAndTranslateProps, translate } from 'react-i18next';
import { markets, orders, trades } from './inner/HistoryTable/configs';
import HistoryTable from './inner/HistoryTable/HistoryTable';
import tableStyles from './inner/HistoryTable/HistoryTable.styl';
import HistoryStore from './models/HistoryStore';
import styles from './OrderHistory.styl';

interface IAssetConfig {
  precisionPrice: number;
  precisionAmount: number;
  precisionTotal: number;
  baseCurrencyName: string;
  targetCurrencyName: string;
}

interface IOrderHistory {
  onDelete(id: string): any;
  assetConfig: IAssetConfig;
  height: number;
  size?: 'small' | 'large';
  store: HistoryStore;
  handleTabChange(key: string): any;
  activeTab: string;
}

const Tab = Tabs.TabPane;

@translate('Market')
@observer
class OrderHistory extends Component<IOrderHistory & InjectedI18nAndTranslateProps> {
  static defaultProps = {
    size: 'large',
    onDelete: () => {},
    activeTab: 'myOrders',
    height: 270,
    handleTabChange: () => {},
    assetConfig: {
      precisionPrice: 8,
      precisionAmount: 8,
      precisionTotal: 8,
      baseCurrencyName: '',
      targetCurrencyName: '',
    },
  };

  @computed
  get ordersColumns() {
    const cols = orders.map(col => col(this.props));

    switch (this.props.size) {
      case 'small':
        return cols.filter(col => col.name !== 'side' && col.name !== 'value');
      default:
        return cols;
    }
  }

  @computed
  get tradesColumns() {
    const columns = trades.map(col => col(this.props));

    switch (this.props.size) {
      case 'small':
        return columns.filter(col => col.name !== 'side');
      default:
        return columns;
    }
  }

  @computed
  get rowHeight() {
    switch (this.props.size) {
      case 'small':
        return 40;
      default:
        return 22;
    }
  }

  @computed
  get marketHistoryColumns() {
    return markets.map(col => col(this.props));
  }

  render() {
    const { activeTab, store, height } = this.props;
    return (
      <div className={styles.orderHistory}>
        <Tabs activeKey={activeTab} onChange={this.props.handleTabChange} animated={false}>
          <Tab
            tab={
              <span>
                {this.props.t('MY ORDERS')}{' '}
                {store.orders.list.length > 0 && (
                  <Badge className={styles.badge}>{store.orders.list.length}</Badge>
                )}
              </span>
            }
            key="myOrders"
          >
            <HistoryTable
              height={height}
              rowHeight={this.rowHeight}
              onRowRender={({ rowData }) => ({
                className: rowData.isFilled ? tableStyles.filled : '',
              })}
              list={store.orders.list}
              columns={this.ordersColumns}
            />
          </Tab>
          <Tab tab={this.props.t('MY TRADES')} key="myTrades">
            <HistoryTable
              height={height}
              list={store.trades.list}
              columns={this.tradesColumns}
              rowHeight={this.rowHeight}
            />
          </Tab>

          <Tab tab={this.props.t('MARKET HISTORY')} key="marketHistory">
            <HistoryTable
              height={height}
              list={store.markets.list}
              columns={this.marketHistoryColumns}
              rowHeight={this.rowHeight}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default OrderHistory;
