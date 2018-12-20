import { IGroupedOrder } from '../OrderBook';

export default function correlatingPriceValue(
  orders: IGroupedOrder[],
  index: number
): number | null {
  if (orders[index]) {
    return orders[index].price;
  }

  return null;
}
