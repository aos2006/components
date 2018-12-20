Стакан пример 
пример VM:
```jsx static
import * as React from 'react';
import { computed, toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import AssetsStore from 'stores/AssetsStore';
import GlobalsStore, { ICurrenciesItem } from 'stores/GlobalsStore';
import OrderBook, { IOrderType } from '../../../../../../components-library/src/components/OrderBook/OrderBook';
import styles from '../styles.styl';

interface IOrderBookContainerProps {
  assets?: AssetsStore;
  globals?: GlobalsStore;
  onOrderClicked?: (
    result: {
      price: number;
      amount: number;
      total: number;
      orderType: IOrderType;
    }
  ) => void;
}

@inject('assets', 'globals')
@observer
export default class OrderBookContainer extends React.Component<IOrderBookContainerProps> {
  @computed
  get baseCurrency(): ICurrenciesItem {
    const { globals, assets } = this.props;
    return (
      globals.getCurrencyByCurrId(assets.currentAssetData.baseCurrencyId) || ({} as ICurrenciesItem)
    );
  }

  @computed
  get tradedCurrency(): ICurrenciesItem {
    const { globals, assets } = this.props;
    return (
      globals.getCurrencyByCurrId(assets.currentAssetData.tradedCurrencyId) ||
      ({} as ICurrenciesItem)
    );
  }

  render() {
    const {
      assets: { currentAssetData },
      globals,
    } = this.props;
    const { buyOrders, sellOrders } = currentAssetData;

    return (
      <OrderBook
        className={styles.orderBookContainer}
        onOrderClicked={this.props.onOrderClicked}
        baseCurrency={this.baseCurrency}
        tradedCurrency={this.tradedCurrency}
        currentAsset={currentAssetData}
        buyOrders={buyOrders}
        sellOrders={sellOrders}
        size={globals.isMobile ? 'small' : 'default'}
        innerStyle={globals.isMobile && toJS(globals.mobileDomStyles.mobileOrderbookTablesWrap)}
      />
    );
  }
}


```
