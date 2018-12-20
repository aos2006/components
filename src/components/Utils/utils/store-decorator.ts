import { inject, IReactComponent, observer as _observer } from 'mobx-react';
import { Component } from 'react';

export function store(key: string): PropertyDecorator;
export function store(target: Component, key: string): any;
export function store(target: Component | string, key?: string): any {
  if (typeof target === 'string') {
    let name = target;
    return (prototype: Component, key: string) => decorate(prototype, key, name);
  } else if (key) {
    return decorate(target, key, key);
  } else {
    throw new Error('Invalid usage');
  }

  function decorate(target: any, key: string, name: string): any {
    if (target._stores) {
      target._stores.push(name);
    } else {
      Object.defineProperty(target, '_stores', {
        value: [name],
      });
    }

    return {
      get(this: any): any {
        return this.props[name];
      },
    };
  }
}

export function observer<T extends IReactComponent>(target: T): T {
  target = _observer(target) || target;

  let stores = target.prototype._stores;

  if (stores) {
    target = inject(...stores)(target) || target;
  }

  return target;
}
