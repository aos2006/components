import React from 'react';
import PropTypes from 'prop-types';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'lodash';
import { ColProps } from '@latoken-component/utils/types/antd/col/index';
import MobxForm, { IRuleObj } from './MobxForm';
import { checkIsRequired } from './helpers';
import { autobind } from 'core-decorators';
import { isRequired } from '@latoken-component/utils/utils/validations';

export interface IBasicMobxFormItemProps {
  name: string;
  label?: string | React.ReactNode | JSX.Element;
  required?: any;
  rules?: ReadonlyArray<object>;
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  componentClassName?: string;
  componentStyle?: React.CSSProperties;
  onChange?: (value: any) => void;
  normalize?: (value: any) => any;
  changeTouchEvent?: string;

  [propName: string]: any;
}

export interface IFieldParams {
  component: any;
  wrapper: any;
  mobxFormItemProps?: Partial<IBasicMobxFormItemProps>;
  componentParams?: any;
  wrapperParams?: any;
  normalize?: (value: any) => any;
}

export interface IMobxFormItemProps extends IBasicMobxFormItemProps {
  name: string;
  fieldParams?: IFieldParams;
}

@observer
export default class MobxFormItem extends React.Component<IMobxFormItemProps> {
  static contextTypes = {
    form: PropTypes.object, // the form object
    defaultItemProps: PropTypes.object, // global default FormItem props
  };
  context: {
    form: MobxForm;
    defaultItemProps: object;
  };

  rules: Array<IRuleObj>;
  isRequired: boolean;

  changeTouchEvent = 'onBlur';

  constructor(props: IMobxFormItemProps) {
    super(props);

    this.rules = props.rules || _.get(props, 'fieldParams.componentParams.rules') || [];

    if (!_.isArray(this.rules)) {
      this.rules = [this.rules];
    }
    const hasRequiredRule = checkIsRequired(this.rules);

    if (props.required && !hasRequiredRule) {
      // add required rule
      this.rules = this.rules.concat(isRequired);
    }

    this.isRequired = hasRequiredRule || props.required;
  }

  componentDidMount() {
    const { form } = this.context;
    const { name } = this.props;

    const validFiled = _.debounce((value, rules) => {
      if (form.fieldTouched.get(name)) {
        form.validateField(name, value, rules);
      }
    }, 200);

    autorun(() => {
      if (form.fieldTouched.get(name)) {
        validFiled(form.getFieldValue(name), this.rules);
      }
    });
  }

  componentWillUnmount() {
    const { removeField } = this.context.form;

    removeField(this.props.name);
  }

  @autobind
  handlerOnTouch() {
    this.context.form.touchedField(this.props.name);
  }

  render() {
    const { getFieldProps, getFieldValue } = this.context.form;
    const {
      onChange,
      label,
      labelCol,
      wrapperCol,
      wrapperClassName,
      wrapperStyle = {},
      componentClassName,
      componentStyle = {},
      name,
      fieldParams,
      rules,
      help,
      normalize,
      wrapperRef,
      componentRef,
      changeTouchEvent = this.changeTouchEvent,
      ...otherProps
    } = this.props;

    const {
      component: Component,
      wrapper: Wrapper,
      wrapperParams = {},
      componentParams = {},
    } = fieldParams;

    const userComponentProps: any = {};
    if (componentClassName) {
      userComponentProps.className = componentClassName;
    }
    if (!_.isEmpty(componentStyle)) {
      userComponentProps.style = componentStyle;
    }
    // generate component props
    const componentProps = getFieldProps(name, {
      ...componentParams,
      rules: this.rules,
      otherProps: Object.assign(
        {
          ref: componentRef,
        },
        otherProps,
        userComponentProps
      ),
      onChange,
    });

    // generate wrapper props
    const wrapperProps = _.merge({}, this.props, wrapperParams, {
      label,
      labelCol,
      wrapperCol,
      style: wrapperStyle,
      className: wrapperClassName,
      required: this.isRequired,
      rootRef: wrapperRef,
    });

    const err = this.context.form.getFieldError(name);
    const hasError = Boolean(err && err.length);

    //generate errors texts
    if (hasError) {
      wrapperProps.validateStatus = 'error';
      wrapperProps.help = err.map(({ message }) => [message, ' ']);
    } else {
      wrapperProps.validateStatus = componentProps.value
        ? (wrapperProps.validateStatus = 'success')
        : '';
    }

    let onValueChange = componentProps.onChange;

    if (_.isFunction(normalize)) {
      let onValueChangeOld = onValueChange;
      onValueChange = value => {
        const normalizeValue = normalize(value);

        if (normalizeValue !== false) {
          onValueChangeOld(normalizeValue);
        }
      };
    }

    if ('onChange' === changeTouchEvent) {
      let onValueChangeOld = onValueChange;
      onValueChange = value => {
        onValueChangeOld(value);
        this.handlerOnTouch();
      };
    } else {
      componentProps[changeTouchEvent] = this.handlerOnTouch;
    }

    return (
      <Wrapper {...wrapperProps} {...this.context.defaultItemProps}>
        <Component {...componentProps} onChange={onValueChange} data-value={getFieldValue(name)} />
      </Wrapper>
    );
  }
}
