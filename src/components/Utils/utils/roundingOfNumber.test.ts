import roundingOfNumber from './roundingOfNumber';
import expect from 'expect.js';

describe('roundingOfNumber', () => {
  const testOptions = [
    { input: 0, output: 0 },
    { input: 1, output: 1 },
    { input: -1, output: -1 },
    { input: 1.1, output: 1.1 },
    { input: 1.9999999999, output: 1.99999999 },
    { input: -1.9999999999, output: -1.99999999 },
    { input: 1.9999999999, output: 1.9999, precision: 4 },
    { input: -1.9999999999, output: -1.9999, precision: 4 },
    { input: 1, output: 1, precision: 4 },
    { input: 0.00009, output: 0, precision: 4 },
    { input: 0.00009, output: 0, precision: 4 },
    { input: 0.000000999, output: 0, precision: 4 },
    { input: 0.000000999, output: 0.00000099, precision: 8 },
    { input: 0.0000000000999, output: 0, precision: 10 },
    { input: 0.0000000000999, output: 0.00000000009, precision: 11 },
    { input: -0.00009, output: 0, precision: 4 },
    { input: -0.00009, output: 0, precision: 4 },
    { input: -0.000000999, output: 0, precision: 4 },
    { input: -0.000000999, output: -0.00000099, precision: 8 },
    { input: -0.0000000000999, output: 0, precision: 10 },
    { input: -0.0000000000999, output: -0.00000000009, precision: 11 },
  ];

  testOptions.forEach((item, index) => {
    const result = roundingOfNumber(item.input, item.precision);
    it(`Option ${index + 1}: ${item.input} => ${item.output} precision=${
      item.precision
    } result=${result}`, () => {
      expect(result).to.be(item.output);
    });
  });
});
