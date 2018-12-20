import { logError, createError, errorTypes } from './api/errors';
import _ from 'lodash';

export default function safeDivide(firstNum, secondNum) {
  if (!_.isNumber(firstNum) || !_.isNumber(secondNum)) {
    logError(createError(errorTypes.INCORRECT_TYPE, `safeDivide: not numeric value passed`));

    return 0;
  }

  const final = firstNum / secondNum;

  return isNaN(final) || !Number.isFinite(final) ? 0 : final;
}
