import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import HistoryStore from '../models/HistoryStore';
import OrderHistory from '../OrderHistory';
import { marketHistory, orders, trades } from './data';

@observer
class Index extends Component {
  model = null;

  constructor(data) {
    super(data);
    this.model = new HistoryStore();
    this.model.setOrders(orders);
    this.model.setMarketHistory(marketHistory);
    this.model.setTrades(trades);
  }

  @observable currentTab = 'myOrders';

  render() {
    return (
      <div style={{ minHeight: 300 }}>
        <span>CurrentTab: {this.currentTab}</span>
        <OrderHistory
          store={this.model}
          onDelete={id => {
            alert(id);
          }}
          assetConfig={{
            precisionPrice: 2,
            precisionAmount: 2,
            precisionTotal: 2,
            baseCurrencyName: 'ETH',
            targetCurrencyName: 'EOS',
          }}
          handleTabChange={tabName => (this.currentTab = tabName)}
          activeTab={this.currentTab}
        />

        <h1>Small size</h1>
        <OrderHistory
          size="small"
          store={this.model}
          onDelete={id => {
            alert(id);
          }}
          assetConfig={{
            precisionPrice: 2,
            precisionAmount: 2,
            precisionTotal: 2,
            baseCurrencyName: 'ETH',
            targetCurrencyName: 'EOS',
          }}
          handleTabChange={tabName => (this.currentTab = tabName)}
          activeTab={this.currentTab}
        />
      </div>
    );
  }
}

export default Index;
