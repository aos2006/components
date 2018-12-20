import { action, observable } from 'mobx';
import { Collection } from '../../latoken-data';

class History {
  @observable markets = new Collection();

  @observable orders = new Collection([], 'ASC', 'time');

  @observable trades = new Collection();

  @observable pricesHash = new Map();

  @action.bound
  comparePrices(current, next, isFirst) {
    const currentPrice = Number(current.price);
    const nextPrice = Number(next.price);
    const isPositive = 1;
    const isNegative = 0;

    if (isFirst && nextPrice === currentPrice) {
      this.pricesHash.set(current.id, isPositive);
    }
    if (nextPrice === currentPrice) {
      this.pricesHash.set(next.id, this.pricesHash.get(current.id));
    }

    if (nextPrice > currentPrice) {
      this.pricesHash.set(next.id, isPositive);
    }

    if (nextPrice < currentPrice) {
      this.pricesHash.set(next.id, isNegative);
    }
  }

  @action.bound
  addMarketHistory(item) {
    const isFirst = false;
    this.comparePrices(this.markets[0], item, isFirst);
    this.markets.add(item);
  }

  isNegative(id) {
    return this.pricesHash.get(id) === 0;
  }

  isPositive(id) {
    return this.pricesHash.get(id) === 1;
  }

  @action.bound
  buildPriceAverage(list) {
    list.reduceRight((current, next, i, arr) => {
      const isFirst = i === arr.length - 1;

      this.comparePrices(current, next, isFirst);
      return next;
    }, list[list.length - 1]);
  }

  @action.bound
  setOrders(orders) {
    this.orders.set(orders);
  }

  @action.bound
  addOrder(order) {
    this.orders.add(order);
  }

  @action.bound
  setMarketHistory(markets) {
    this.buildPriceAverage(markets);
    this.markets.set(markets);
  }

  @action.bound
  setTrades(trades) {
    this.trades.set(trades);
  }

  @action.bound
  addTrade(trade) {
    this.trades.add(trade);
  }
}

export default History;
