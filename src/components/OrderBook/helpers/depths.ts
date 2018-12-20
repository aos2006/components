import { IGroupedOrder, IKeysGroupedOrder } from '../OrderBook';

export default function depths(orders: IGroupedOrder[], byParam: IKeysGroupedOrder): number[] {
  let currentDepth = 0;
  const result = [];
  for (let i = 0; i < orders.length; i++) {
    currentDepth += orders[i][byParam];
    result[i] = currentDepth;
  }
  return result;
}
