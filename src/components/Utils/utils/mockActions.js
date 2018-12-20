import _ from 'lodash';
import React, { Component } from 'react';
import { logError, errorTypes, createError } from './api/errors';
import { notification } from 'antd';
import { isObservable } from 'mobx';

/**
 * ИНСТРУКЦИЯ к декораторам
 * Работают только с методами Реакт-компонентов и Мобх-сторов.
 *
 * ВАЖНО: не работают со стрелочными функциями! (из-за хитрых babel-преобразований)
 *
 * @mockUnauthorized
 * myMethod = () => { ... } // Не сработает!
 *
 * Используйте @action.bound для mobx методов
 * import { action } from 'mobx';
 * @action.bound
 * @mockUnauthorized
 * myMethod() { ... } // сработает
 *
 * либо @autobind для реакт-методов
 * import { autobind } from 'core-decorators';
 * @autobind
 * @mockUnauthorized
 * myMethod() { ... } // сработает
 *
 *
 * ПРИНЦИП РАБОТЫ:
 *
 * - Пробуют подключиться к сторам modals и identity, и если их не находят - выдают ошибку
 * - Если пользователь залогинен - не изменяют метод
 * - Если не залогинен, то используют разные подходы:
 * -- mockUnauthorized по-тихому заменяет метод на Promise.resolve()
 * -- mockUnauthorizedWithModal заменяет метод на Promise.resolve() и вызывает модальное окно с просьбой авторизоваться
 * -- mockUnauthorizedCalledWith и
 * -- mockUnauthorizedWithModalCalledWith принимают в себя аргументы (либо конкретное значение, либо функцию):
 *
 * @mockUnauthorizedWithModalCalledWith('hello', 'test')
 * myMethod(myParam, myParam2) { ... }
 * // Если myMethod вызовется с myParam === 'hello' или myParam2 === 'test', то метод замокается и вызовется модальное окно
 *
 * @mockUnauthorizedWithModalCalledWith(myParam => myParam !== 'hello', myParam2 => myParam2 !== 'test')
 * myMethod(myParam, myParam2) { ... }
 * // Если myMethod вызовется с myParam !== 'hello' или myParam2 !== 'test', то метод замокается и вызовется модальное окно
 *
 */

const paths = {
  isLoggedReact: 'props.identity.isLogged',
  isLoggedMobx: 'stores.identity.isLogged',
  registerModalOpenedReact: 'props.modals.registerModalOpened',
  registerModalOpenedMobx: 'stores.modals.registerModalOpened',
  redirectReact: 'props.routing.push',
  redirectMobx: 'stores.routing.push',
};

function getParams(key) {
  const isReactComponent = this instanceof Component;
  const isMobxStore = isObservable(this);

  let isLogged;
  let registerModalOpened;
  let errorMessage;
  let redirect;

  if (isReactComponent) {
    redirect = _.get(this, paths.redirectReact);
    isLogged = _.get(this, paths.isLoggedReact);
    registerModalOpened = _.get(this, paths.registerModalOpenedReact);
  } else if (isMobxStore) {
    redirect = _.get(this, paths.redirectMobx);
    isLogged = _.get(this, paths.isLoggedMobx);
    registerModalOpened = _.get(this, paths.registerModalOpenedMobx);
  } else {
    errorMessage = `mockUnauthorized decorators are usable on React.Component or mobx.stores only, check method ${key}`;
  }

  if (!_.isBoolean(isLogged) || !_.isBoolean(registerModalOpened)) {
    if (isReactComponent) {
      errorMessage = `Cannot connect to "identity" and "modals" props in component method ${key}, be sure to inject them`;
    } else if (isMobxStore) {
      errorMessage = `Cannot connect to "identity" and "modals" stores in store method ${key}, be sure to inject them`;
    }
  }

  return {
    errorMessage,
    isLogged,
    isMobxStore,
    isReactComponent,
    redirect,
    registerModalOpened,
  };
}

function mockGenerator(customCallback) {
  return function mockDecorator(target, key, descriptor) {
    if (isTest) {
      return descriptor;
    }

    const original = _.isFunction(descriptor.value) ? descriptor.value : null;

    if (original) {
      descriptor.value = function(...callArgs) {
        const params = getParams.call(this, key);
        const { isLogged, errorMessage } = params;

        if (errorMessage) {
          notification.error({
            message: `App error`,
            description: `Not able to make an action`,
            duration: 3,
          });

          return logError(createError(errorTypes.INCORRECT_DECORATOR_CALL, errorMessage));
        }

        if (isLogged) {
          return original.apply(this, callArgs);
        }

        if (customCallback) {
          return customCallback.call(this, params, callArgs, original);
        }

        return Promise.resolve();
      };
    }

    return descriptor;
  };
}

const mockUnauthorized = mockGenerator();

const mockUnauthorizedWithModal = mockGenerator(function customCallback(params) {
  if (params.isReactComponent) {
    _.set(this, paths.registerModalOpenedReact, true);
  } else if (params.isMobxStore) {
    _.set(this, paths.registerModalOpenedMobx, true);
  }

  return Promise.resolve();
});

const mockUnauthorizedCalledWith = function mockUnauthorizedCalledWith(...checkArgs) {
  return mockGenerator(function customCallback(params, callArgs, original) {
    for (let i = 0; i < checkArgs.length; i++) {
      const checkFunction = checkArgs[i];

      if (_.isFunction(checkFunction)) {
        if (checkFunction(callArgs[i])) {
          return Promise.resolve();
        }
      } else if (_.isEqual(checkArgs[i], callArgs[i])) {
        return Promise.resolve();
      }
    }

    return original.apply(this, callArgs);
  });
};

const mockUnauthorizedWithModalCalledWith = function mockUnauthorizedWithModalCalledWith(
  ...checkArgs
) {
  return mockGenerator(function customCallback(params, callArgs, original) {
    for (let i = 0; i < checkArgs.length; i++) {
      const checkFunction = checkArgs[i];

      if (_.isFunction(checkFunction)) {
        if (checkFunction(callArgs[i])) {
          if (params.isReactComponent) {
            _.set(this, paths.registerModalOpenedReact, true);
          } else if (params.isMobxStore) {
            _.set(this, paths.registerModalOpenedMobx, true);
          }

          return Promise.resolve();
        }
      } else if (_.isEqual(checkArgs[i], callArgs[i])) {
        if (params.isReactComponent) {
          _.set(this, paths.registerModalOpenedReact, true);
        } else if (params.isMobxStore) {
          _.set(this, paths.registerModalOpenedMobx, true);
        }

        return Promise.resolve();
      }
    }

    return original.apply(this, callArgs);
  });
};

const mockUnauthorizedWithRedirectCalledWith = function mockUnauthorizedWithRedirectCalledWith(
  ...checkArgs
) {
  return mockGenerator(function customCallback(params, callArgs, original) {
    for (let i = 0; i < checkArgs.length; i++) {
      const checkFunction = checkArgs[i];

      if (_.isFunction(checkFunction)) {
        if (checkFunction(callArgs[i])) {
          params.redirect('/login/auth');

          return Promise.resolve();
        }
      } else if (_.isEqual(checkArgs[i], callArgs[i])) {
        params.redirect('/login/auth');

        return Promise.resolve();
      }
    }

    return original.apply(this, callArgs);
  });
};

export {
  mockUnauthorized,
  mockUnauthorizedWithModal,
  mockUnauthorizedCalledWith,
  mockUnauthorizedWithModalCalledWith,
  mockUnauthorizedWithRedirectCalledWith,
};
