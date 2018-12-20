/* eslint-disable no-param-reassign */
import { isObject } from './Constants';

const isProduction = process.env.NODE_ENV === 'production';

export default class Logger {
  constructor(frameName) {
    this.frameName = frameName;
  }

  _logToConsole(object) {
    if (isProduction) return this;

    const { frameCaller, frameNative, funcName } = object;

    const logString = `|${frameCaller} - ${frameNative}|: ${funcName}`;

    // let argString = '';
    //
    // for (const key in object) {
    //   const value = object[key];
    //
    //   argString += `${key}: ${value}, `;
    // }
    //
    // if (argString !== '') {
    //   // Remove last comma
    //
    //   argString = argString.slice(0, argString.length - 2);
    //
    //   logString += ` - {${argString}}`;
    // }

    console.info(logString);

    return this;
  }

  global(funcName, object) {
    if (!isObject(object)) return this;

    object.funcName = funcName;

    if (object.funcName === 'pushToLog') object = object.logObject;

    if (!object.timeCall) object.timeCall = new Date().getTime();

    if (!object.frameNative) object.frameNative = this.frameName;

    if (!object.frameCaller) object.frameCaller = this.frameName;

    object.frameNative = object.frameNative || this.frameName;

    this._logToConsole(object);

    if (object.crit) {
      console.error('Widget: Critical error ', JSON.stringify(object));
    }
  }

  local(object) {
    object.timeCall = new Date().getTime();
    object.frameNative = this.frameName;
    object.frameCaller = this.frameName;

    this.global(object.funcName, object);
  }
}
