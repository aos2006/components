import { inject, observer } from 'mobx-react';
import React from 'react';
import OrderHistory, { IOrderHistoryProps } from './OrderHistory';

interface OrderHistoryProps {
  webAnalytics: any;
  globals: any;
  assets: any;
}

@inject('assets', 'globals', 'webAnalytics')
@observer
export default class OrderHistoryContainer extends React.Component<OrderHistoryProps> {
  changeTab = tab => {
    this.props.webAnalytics.eventSegment('click', {
      pageType: 'trading',
      button: tab,
    });
  };

  render() {
    const {
      assets,
      assets: { currentAssetData },
      globals,
    } = this.props;
    const height = globals.mobileDomStyles.mobileOrdersAndHistoryTablesWrap.height;

    const orderHistoryProps: IOrderHistoryProps = {
      height,
      isMobile: globals.isMobile,
      deleteOrder: assets.deleteOrder,
      updateDomStyles: globals.updateDomStyles,
      marketHistory: currentAssetData.marketHistory,
      filledOrders: currentAssetData.filledOrders,
      userOrders: currentAssetData.userOrders,
      userTrades: currentAssetData.userTrades,
      onTabsChange: this.changeTab,
      assetConfig: {
        shortName: currentAssetData.shortName,
        market: currentAssetData.market,
        frontType: currentAssetData.frontType,
        precisionPrice: currentAssetData.precisionPrice,
        precisionAmount: currentAssetData.precisionAmount,
        precisionTotal: currentAssetData.precisionTotal,
      },
    };

    return <OrderHistory {...orderHistoryProps} />;
  }
}
