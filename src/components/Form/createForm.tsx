import MobxForm, { IWrappedComponent } from './MobxForm';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

interface IOptions {
  prefix?: string; // support lodash.get
  defaultItemProps?: object;
}

export default function createForm<T>(options: IOptions = {}) {
  return function decorate(WrappedComponent: IWrappedComponent<T>) {
    @observer
    class WrapMobxForm extends MobxForm<T> {
      WrappedComponent = WrappedComponent;
      prefix = options.prefix || '';
      defaultItemProps = options.defaultItemProps || {};
      @observable errors = new Map();
      @observable fieldOptions = new Map();
    }

    return WrapMobxForm;
  };
}
