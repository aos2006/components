import mergeChartData from './mergeChartData';

describe('mergeChartData', () => {
  it('Correctly merges', () => {
    const data1 = [{ time: 1000, close: 0 }, { time: 1001, close: 1 }, { time: 1002, close: 2 }];
    const data2 = [{ time: 1000, close: 3 }, { time: 999, close: 4 }, { time: 1005, close: 5 }];

    const sorted = mergeChartData(data1, data2);

    const expected = [
      { time: 999, close: 4 },
      { time: 1000, close: 3 },
      { time: 1001, close: 1 },
      { time: 1002, close: 2 },
      { time: 1005, close: 5 },
    ];

    expect(sorted).to.deep.equal(expected);
  });
});
