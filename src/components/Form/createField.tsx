import React from 'react';
import { default as MobxFormItem, IFieldParams, IMobxFormItemProps } from './MobxFormItem';

export default function<T = {}>(fieldParams: IFieldParams) {
  return function(props: IMobxFormItemProps & T) {
    return (
      <MobxFormItem {...props} fieldParams={fieldParams} {...fieldParams.mobxFormItemProps || {}} />
    );
  };
}
