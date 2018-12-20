import spaceSeparateThousands from './spaceSeparateThousands';
import expect from 'expect.js';

describe('spaceSeparateThousands', () => {
  const testOptions = [
    { input: 0, output: '0' },
    { input: 1, output: '1' },
    { input: -1, output: '-1' },
    { input: 1.1, output: '1.1' },

    { input: 1000, output: '1 000' },
    { input: 1000000, output: '1 000 000' },
    { input: 123456789, output: '123 456 789' },

    { input: 1000.001, output: '1 000.001' },
    { input: 1000000.00001, output: '1 000 000.00001' },
    { input: 123456789.000001, output: '123 456 789.000001' },

    { input: 1000, output: '1.000', customSeparator: '.' },
    { input: 1000000, output: '1.000.000', customSeparator: '.' },
    { input: 123456789, output: '123.456.789', customSeparator: '.' },

    { input: 1.1, output: '1.1', lengNumber: 2 },
    { input: 1000, output: '10 00', lengNumber: 2 },
    { input: 1000000, output: '1 00 00 00', lengNumber: 2 },
    { input: 123456789, output: '1 23 45 67 89', lengNumber: 2 },

    { input: 1000, output: '1000', lengNumber: 4 },
    { input: 1000000, output: '100 0000', lengNumber: 4 },
    { input: 123456789, output: '1 2345 6789', lengNumber: 4 },
  ];

  testOptions.forEach((item, index) => {
    const result = spaceSeparateThousands(item.input, item.customSeparator, item.lengNumber);
    it(`Option ${index + 1}: 
    ${item.input} => ${item.output} lengNumber=${item.lengNumber} result=${result}`, () => {
      expect(result).to.be(item.output);
    });
  });
});
