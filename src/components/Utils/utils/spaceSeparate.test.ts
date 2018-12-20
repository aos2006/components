import spaceSeparate from './spaceSeparate';
import expect from 'expect.js';

describe('spaceSeparate', () => {
  const testOptions = [
    {
      input: 'NQ12MPM1SC790CMCYD7R6DEYL6YEADD1Q30E',
      output: 'NQ12 MPM1 SC79 0CMC YD7R 6DEY L6YE ADD1 Q30E',
      lengthStrong: 4,
    },
    {
      input: 'NQ12MPM1SC790CMCYD7R6DEYL6YEADD1Q30',
      output: 'NQ12 MPM1 SC79 0CMC YD7R 6DEY L6YE ADD1 Q30',
      lengthStrong: 4,
    },
    {
      input: 'NQ12MPM1SC790CMCYD7R6DEYL6YEADD1Q30',
      output: 'NQ 12 MP M1 SC 79 0C MC YD 7R 6D EY L6 YE AD D1 Q3 0',
      lengthStrong: 2,
    },
    {
      input: 'NQ12MPM1SC790CMCYD7R6DEYL6YEADD1Q30',
      output: 'NQ12-MPM1-SC79-0CMC-YD7R-6DEY-L6YE-ADD1-Q30',
      lengthStrong: 4,
      customSeparator: '-',
    },
  ];

  testOptions.forEach((item, index) => {
    const result = spaceSeparate(item.input, item.customSeparator, item.lengthStrong);
    it(`Option ${index + 1}:  ${item.input} => ${item.output} customSeparator='${
      item.customSeparator
    }' lengthStrong='${item.lengthStrong}' result=${result}`, () => {
      expect(result).to.be(item.output);
    });
  });
});
