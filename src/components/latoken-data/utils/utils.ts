import _ from 'lodash';
import moment from 'moment';

export const isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);
interface IValuesToNumbers {
  keys: string[];
  sourceObj: object;
}

export const valuesToNumbers = ({ keys = [], sourceObj = {} }: IValuesToNumbers) =>
  keys.reduce(
    (acc, key) => ({
      ...acc,
      ...sourceObj,
      [key]: Number(sourceObj[key]),
    }),
    {}
  );

export const convertFromUnix = unix => moment(unix * 1000).format('DD.MM HH:mm:ss');

export const normalizeInteger = (str, pre) => {
  const value = String(str);
  if (value.indexOf('.') === -1) {
    return `${value}.${'0'.repeat(pre)}`;
  }
  return value;
};

export const getActiveMenuKey = (keys, currentPath) =>
  keys.find(item => currentPath.includes(item));

export const toCapitalize = str => str[0].toUpperCase() + str.slice(1).toLowerCase();

export const formatNumberToPrecision = (value: string = '', precision: number = 8): string => {
  const newValue = value.split('.').map(v => v.replace(/\D/g, ''));

  let [leftPart, rightPart] = newValue;

  leftPart = leftPart.length > 1 ? _.trimStart(leftPart, '0') || '0' : leftPart;
  rightPart = _.isString(rightPart) ? rightPart.substring(0, precision) : null;
  return precision && _.isString(rightPart) ? `${leftPart}.${rightPart}` : leftPart;
};
