/* eslint-disable no-param-reassign */
function identifyIsFramed() {
  let isFramed = false;

  try {
    isFramed = window !== window.top || document !== top.document || self.location !== top.location;
  } catch (e) {
    isFramed = true;
  }

  return isFramed;
}

export const isFramed = identifyIsFramed();

export const isFunction = obj => Boolean(obj) && typeof obj === 'function';

export const isArray = obj => Array.isArray(obj);

export const isObject = obj =>
  Boolean(obj) && Object.prototype.toString.call(obj) === '[object Object]';

export const isString = obj => (Boolean(obj) || obj === '') && typeof obj === 'string';

export const isNumber = (val)=> {
  return Number(parseFloat(val)) === val;
}

export const isElement = obj =>
  typeof HTMLElement === 'object'
    ? obj instanceof HTMLElement
    : obj &&
    typeof obj === 'object' &&
    obj !== null &&
    obj.nodeType === 1 &&
    typeof obj.nodeName === 'string';

export const ready = f => setTimeout(document.readyState === 'complete' ? f : ready, 9, f);

export function chrkLoadetGlobalFunction(nameFunction, cb) {
  setTimeout(
    isFunction(window[nameFunction]) ? cb : chrkLoadetGlobalFunction.bind({}, nameFunction, cb),
    9
  );
}

export function oneRun(cb) {
  let isRun = false;

  if (!isFunction(cb)) {
    throw new Error('cb is not a function');
  }

  return function () {
    if (!isRun) {
      isRun = true;

      return cb();
    }
  };
}
