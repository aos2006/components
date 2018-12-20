import React, { ReactNode } from 'react';
import createForm from './createForm';
import createField from './createField';
import cn from 'classnames';
import MobxForm from './MobxForm';
import { autobind } from 'core-decorators';

const defaultClassName = 'ant-form';

export interface FormProps {
  renderElement?: string;
  className?: string;
  onSubmit?: Function;
  children?: ReactNode;
  layout?: 'horizontal' | 'vertical' | 'inline';
  ref?: any;
  validateFieldsOnly?: string[];
  prefix?: string;
}

export default class Form extends MobxForm<FormProps> {
  constructor(props) {
    super(props);
    this.prefix = this.props.prefix;
  }
  @autobind
  handlerOnSubmit(e: Event) {
    e.preventDefault();
    this.props.onSubmit && this.props.onSubmit(e);
  }

  WrappedComponent = props => {
    const { renderElement, className, layout = 'vertical', children } = props;
    const renderTagName = renderElement || 'form';

    const formProps = {
      className: cn(defaultClassName, className, 'ant-form-' + layout),
      onSubmit: renderTagName === 'form' ? this.handlerOnSubmit : null,
    };

    return React.createElement(renderTagName, formProps, children);
  };
}

export { createForm, createField };
