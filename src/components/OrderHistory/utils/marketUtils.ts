import _ from 'lodash';
import { ReactNode } from 'react';

type IValueGetterFun<T> = (data: T) => any;

export interface IFieldsArray<T = any> {
  label: ReactNode;
  valueGetter: IValueGetterFun<T> | string;
  isVisible?: (value: any, record: T) => boolean;
  format?: (value: any, record: T) => ReactNode;
}

export interface IMappingInfoProcessorProps<T = any> {
  data: T;
  fieldsArray: IFieldsArray<T>[];
  template: (label: ReactNode, value: any, index: number) => ReactNode;
}

export function mappingInfoProcessor<T = any>({
  data,
  fieldsArray,
  template,
}: IMappingInfoProcessorProps<T>) {
  return fieldsArray.map(({ valueGetter, format, label, isVisible }, index) => {
    let value = _.isFunction(valueGetter) ? valueGetter(data) : _.get(data, valueGetter);

    if (_.isFunction(format) && value != null) {
      value = format(value, data);
    }

    const visible = _.isFunction(isVisible) ? isVisible(value, data) : true;

    return visible ? template(label, value, index) : null;
  });
}
