export const splitBy = (str, blockLength) => {
  let result = '';

  for (let i = 0; i < str.length; i++) {
    result += str[i];
    if ((str.length - i - 1) % blockLength === 0 && i !== str.length - 1) {
      result += ' ';
    }
  }

  return result;
};

export const parseNumber = (value, precision) => {
  if (precision === 0) {
    return {
      ceil: {
        leading: '',
        main: splitBy(parseFloat(Math.ceil(value)).toString(), 3),
        closing: '',
      },
      divider: false,
      decimals: {
        leading: '',
        main: '',
        closing: '',
      },
    };
  }
  const stringValue = parseFloat(value)
    .toFixed(precision)
    .toString();
  const ceil = stringValue.split('.')[0];
  const decimals = stringValue.split('.')[1];
  let isLeading = true;
  const ceilPart = {
    leading: '',
    main: '',
    closing: '',
  };
  const decimalsPart = {
    leading: '',
    main: '',
    closing: '',
  };

  if (ceil === '0') {
    ceilPart.main = '0';
  } else {
    ceilPart.main = splitBy(String(ceil), 3);
    isLeading = false;
  }
  let lastMain = -1;

  for (let i = decimals.length - 1; i >= 0; i--) {
    if (decimals[i] !== '0') {
      lastMain = i;
      break;
    }
  }
  for (let i = 0; i < decimals.length; i++) {
    if (isLeading) {
      if (decimals[i] === '0') {
        decimalsPart.leading += decimals[i];
      } else {
        decimalsPart.main += decimals[i];
        isLeading = false;
      }
    } else if (i <= lastMain) {
      decimalsPart.main += decimals[i];
    } else {
      decimalsPart.closing += decimals[i];
    }
  }

  return {
    ceil: ceilPart,
    divider: true,
    decimals: decimalsPart,
  };
};
