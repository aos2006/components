import _ from 'lodash';
import { logError, createError, errorTypes } from './api/errors';

export default function convertToDashedName(shortName) {
  if (!_.isString(shortName)) {
    logError(
      createError(errorTypes.INCORRECT_VALUE, `convertToDashedName: invalid shortName passed!`)
    );

    return '';
  }

  return shortName.replace(/(\s|\))/g, '').replace(/([/(])/g, '-');
}
