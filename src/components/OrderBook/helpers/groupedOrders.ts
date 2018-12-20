import _ from 'lodash';
import { IGroupedOrder } from '../OrderBook';

export default function groupedOrders({ orders, precision, customRoundFunction }): IGroupedOrder[] {
  const precisionMultiplier = Math.pow(10, precision);
  const groupedObject = _.groupBy(orders, function(order) {
    return (
      customRoundFunction(Math.round(order.price * precisionMultiplier * 10) / 10) /
      precisionMultiplier
    ).toFixed(precision);
  });

  return _.map(groupedObject, (ordersToMerge, key) => ({
    price: _.toNumber(key),
    amount: _.sumBy(ordersToMerge, 'amount'),
    total: _.sumBy(ordersToMerge, 'total'),
  }));
}
