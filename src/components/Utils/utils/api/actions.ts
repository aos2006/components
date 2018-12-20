import _ from 'lodash';
import axios, { AxiosPromise } from 'axios';
import { createError, errorTypes } from './errors';
import { apiUrl } from './constants';
import { pushQueryToRequests } from './metrics';

type allDefaultType = 'number' | 'string' | 'array' | 'object';

export interface IQuery {
  url: string;
  method: string; //"get" | "post" | "delete" | "patch"
  params?: object;
  withCredentials?: boolean;
}

export function makeRequest(query: IQuery): AxiosPromise<any> {
  return new Promise(function makeRequestPromise(resolve, reject) {
    if (_.isPlainObject(query) && _.isString(query.url) && _.isString(query.method)) {
      const params = {
        url: apiUrl + query.url,
        method: query.method,
        withCredentials: query.withCredentials === undefined ? true : query.withCredentials,
      };

      if (_.isPlainObject(query.params)) {
        // Very strange behavior of Axios :(
        params[query.method === 'get' ? 'params' : 'data'] = query.params;
      }

      const requestName = `${query.method}_${query.url}`;
      const requestTimeStart = new Date().getTime();

      return axios(params)
        .then(response => {
          pushQueryToRequests(requestName, requestTimeStart);

          return resolve(response);
        })
        .catch(e => {
          pushQueryToRequests(requestName, requestTimeStart);

          if (
            _.isString(e.message) &&
            e.message.indexOf('Request failed with status code') !== -1
          ) {
            return reject(createError(errorTypes.INCORRECT_STATUS, e.message.replace(/\D/g, '')));
          }

          return reject(e);
        });
    }

    return reject(
      createError(errorTypes.INCORRECT_OBJECT, 'makeRequest: некорректный query запроса')
    );
  });
}

export function getParam(param: string): (data: object) => Promise<any> {
  return response =>
    new Promise(function getResponseDataPromise(resolve, reject) {
      const data = _.get(response, param);
      return !_.isNil(data)
        ? resolve(data)
        : reject(
            createError(
              errorTypes.INCORRECT_RESPONSE,
              `Expected server response to have param ${param}`
            )
          );
    });
}

export function checkError<T>(data: T & { error?: string; result?: boolean }): Promise<T> {
  if (_.isString(data.error)) {
    return Promise.reject(createError(errorTypes.SERVER_RESPONSE, data.error, data));
  }

  if (data.result === false) {
    return Promise.reject(
      createError(errorTypes.SERVER_RESPONSE, 'Expected server response false', data)
    );
  }

  return Promise.resolve(data);
}

export function checkType<T>(type: allDefaultType): (data: T) => Promise<T> {
  return response =>
    new Promise(function checkTypePromise(resolve, reject) {
      if (
        (type === 'number' && !_.isNumber(response)) ||
        (type === 'string' && !_.isString(response)) ||
        (type === 'array' && !_.isArray(response)) ||
        (type === 'object' && !_.isPlainObject(response))
      ) {
        return reject(
          createError(
            errorTypes.INCORRECT_RESPONSE,
            `Expected server response type: ${type}, actual: ${Object.prototype.toString.call(
              response
            )}`
          )
        );
      }
      return resolve(response);
    });
}

export function arrayLengthMin<T>(minLength: number): (data: Array<T>) => Promise<Array<T>> {
  return response =>
    new Promise(function arrayLengthMinPromise(resolve, reject) {
      if (response.length < minLength) {
        return reject(
          createError(
            errorTypes.INCORRECT_RESPONSE,
            `Expected server response array to have length more than ${minLength}, actual ${
              response.length
            }`
          )
        );
      }
      return resolve(response);
    });
}

export function checkParamType<T>(param: string, type: allDefaultType): (data: T) => Promise<T> {
  return object =>
    new Promise((resolve, reject) => {
      if (!_.isPlainObject(object)) {
        return reject(
          createError(errorTypes.INCORRECT_OBJECT, `Can't check param type of not an object!`)
        );
      }
      if (
        (type === 'number' && !_.isNumber(object[param])) ||
        (type === 'string' && !_.isString(object[param])) ||
        (type === 'array' && !_.isArray(object[param])) ||
        (type === 'object' && !_.isPlainObject(object[param]))
      ) {
        return reject(
          createError(
            errorTypes.INCORRECT_RESPONSE,
            `Expected server response to have param ${param} of type ${type}, 
            but got ${typeof object[param]}`
          )
        );
      }
      return resolve(object);
    });
}

export function checkParamsType<T>(isType: (data) => data is T): (data: T) => Promise<T> {
  return object =>
    new Promise((resolve, reject) => {
      if (!_.isPlainObject(object)) {
        return reject(
          createError(errorTypes.INCORRECT_OBJECT, `Can't check param type of not an object!`)
        );
      }

      if (isType(object)) {
        return resolve(object);
      }

      return reject(
        createError(
          errorTypes.INCORRECT_RESPONSE,
          `Expected server response function isType: ${Function.prototype.toString.call(
            isType
          )}  , actual: ${Object.prototype.toString.call(object)}`
        )
      );
    });
}

export function arrayItemsType<T>(isType: (data) => data is T): (data: T[]) => Promise<T[]> {
  return array =>
    new Promise((resolve, reject) => {
      if (!_.isArray(array)) {
        return reject(
          createError(
            errorTypes.INCORRECT_TYPE,
            `Expected server response type: Array, actual: ${Object.prototype.toString.call(array)}`
          )
        );
      }

      let notValidElement = null;
      let notValidElementIndex = null;
      const hasOneElementNotValid = array.some((item, index) => {
        const isValidItem = isType(item);
        if (isValidItem) {
          return false;
        } else {
          notValidElement = item;
          notValidElementIndex = index;
          return true;
        }
      });

      if (array.length === 0 || !hasOneElementNotValid) {
        return resolve(array);
      }

      return reject(
        createError(
          errorTypes.INCORRECT_RESPONSE,
          `Expected server response isType: ${Function.prototype.toString.call(
            isType
          )}, notValidElementIndex: ${notValidElementIndex}, notValidElement: ${Object.prototype.toString.call(
            notValidElement
          )}`
        )
      );
    });
}

export function checkParamEqual<T>(param: string, value: any): (data: T) => Promise<T> {
  return object =>
    new Promise((resolve, reject) => {
      if (!_.isPlainObject(object)) {
        return reject(
          createError(errorTypes.INCORRECT_OBJECT, `Can't check param of not an object!`)
        );
      }
      if (object[param] !== value) {
        return reject(
          createError(
            errorTypes.INCORRECT_VALUE,
            `Expected server response to have param ${param} equal ${value}, 
            but actual value is ${typeof object[value]}`
          )
        );
      }
      return resolve(object);
    });
}

export function retryPromiseFunction<T>(
  action: () => Promise<T>,
  interval: number,
  limit: number
): () => Promise<T> {
  return () =>
    new Promise((resolve, reject) =>
      (function retry(counter = 1) {
        return Promise.resolve(action())
          .then(resolve)
          .catch(error => {
            if (counter >= limit) {
              error.name = errorTypes.LIMIT;
              return reject(error);
            }
            // eslint-disable-next-line no-param-reassign,no-plusplus
            return setTimeout(retry.bind(null, ++counter), interval);
          });
      })()
    );
}
