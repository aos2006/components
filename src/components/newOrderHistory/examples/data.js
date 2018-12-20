import uuid from 'uuid/v1';

const res = [];

for (let i = 0; i < 100; i++) {
  res.push({
    time: Math.random() * 100,
    cost: '1000.11',
    price: '1000.11',
    value: '1000.11',
    side: 'buy',
    total: '1000.1',
    isFilled: i % 2 === 1,
    quantity: '111.1',
    id: uuid(),
  });
}

export const orders = res;

const markets = [];

for (let i = 0; i < 100; i++) {
  markets.push({
    asset: '02a72a13-cd11-4a50-b708-1d5e3ec129bf',
    cost: '0.00000135',
    filled: '0.00000000',
    id: uuid(),
    price: Math.random(),
    quantity: '0.00000253',
    side: 'buy',
    status: 'PLACED',
    time: 1544808959,
  });
}

export const marketHistory = markets;

const tradesData = [];

for (let i = 0; i < 100; i++) {
  tradesData.push({
    asset: '02a72a13-cd11-4a50-b708-1d5e3ec129bf',
    cost: '0.00000135',
    filled: '0.00000000',
    id: uuid(),
    price: Math.random(),
    quantity: '0.00000253',
    side: 'buy',
    status: 'PLACED',
    time: 1544808959,
  });
}

export const trades = tradesData;
