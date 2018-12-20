import safeParse from './utils/safeParse';
import getLogoLink from './utils/getLogoLink';
import { createError, errorTypes, logError } from './utils/api/errors';
import {
  arrayItemsType,
  checkParamsType,
  checkType,
  getParam,
  makeRequest,
} from './utils/api/actions';
import { apiUrl } from './utils/api/constants';
import {
  mockUnauthorized,
  mockUnauthorizedCalledWith,
  mockUnauthorizedWithModal,
  mockUnauthorizedWithModalCalledWith,
  mockUnauthorizedWithRedirectCalledWith,
} from './utils/mockActions';
import divideEmptyZeros from './utils/divideEmptyZeros';
import clearObject from './utils/clearObject';
import getMomentLocale from './utils/getMomentLocale';
import getUrlParams from './utils/getUrlParams';
import objectToEncoded from './utils/objectToEncoded';
import spaceSeparateThousands from './utils/spaceSeparateThousands';
import convertToDashedName from './utils/convertToDashedName';
import safeDivide from './utils/safeDivide';
import getChangeStr from './utils/getChangeStr';
import moveElementInArray from './utils/moveElementInArray';
import mergeChartData from './utils/mergeChartData';
import roundingOfNumber from './utils/roundingOfNumber';
import spaceSeparate from './utils/spaceSeparate';
import convertCdnUrl from './utils/convertCdnUrl';
import * as rules from './utils/validations/index';

const constantColors = {
  blue1: '#0096AC',
  blue2: '#0e75ee',
  green1: '#38aa2e',
  grey1: '#E2E2E2',
  grey2: '#d3d3d3',
  grey3: '#949494',
  grey4: '#464646',
  orange1: '#f5a623',
  orange2: '#c98a21',
  red1: '#ff0000',
};

export {
  apiUrl,
  arrayItemsType,
  checkParamsType,
  checkType,
  constantColors,
  convertToDashedName,
  createError,
  divideEmptyZeros,
  errorTypes,
  getChangeStr,
  getLogoLink,
  getMomentLocale,
  getParam,
  getUrlParams,
  logError,
  makeRequest,
  mockUnauthorized,
  mockUnauthorizedCalledWith,
  mockUnauthorizedWithModal,
  mockUnauthorizedWithModalCalledWith,
  mockUnauthorizedWithRedirectCalledWith,
  moveElementInArray,
  objectToEncoded,
  rules,
  safeDivide,
  safeParse,
  spaceSeparateThousands,
  mergeChartData,
  clearObject,
  roundingOfNumber,
  spaceSeparate,
  convertCdnUrl,
};
