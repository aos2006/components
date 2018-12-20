import { action, computed, observable, toJS } from 'mobx';
import React, { ReactNode } from 'react';
import { getValueFromEvent } from './helpers';
import { observer } from 'mobx-react';
import AsyncValidator from 'async-validator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

export type IRuleFunc = (cb: (errors: string[]) => void) => void;

export type ITypeRule =
  | 'object'
  | 'string'
  | 'boolean'
  | 'array'
  | 'date'
  | 'enum'
  | 'float'
  | 'integer'
  | 'null'
  | 'number'
  | 'regexp';

export type IMessageFunc = (message: string, parameters: any) => string;

export type IValidator = (rule, value, callback, source, options) => void;

/**
 * {@link https://www.npmjs.com/package/async-validate#rules Document Rules}
 */
export interface IRuleObj {
  type?: ITypeRule | ITypeRule[] | string | string[];
  required?: boolean;

  pattern?: RegExp;
  match?: RegExp;
  message?: ReactNode | IMessageFunc;
  placeholder?: () => string;
  min?: number;
  max?: number;
  len?: number;
  whitespace?: boolean;
  validator?: IValidator;
  resolve?: () => any;
  // Determines if additional properties are allowed.
  additional?: boolean;
  //for type: "date",
  format?: string;
  //for  type: "object",
  fields?: {
    [key: string]: IRuleObj;
  };
  //for  type: "enum",
  list?: any[];
  validateType?: string;
}

export type IRule = Array<IRuleObj> | IRuleObj;

export interface IMobxFormProps {
  form?: object;
  store?: any;
  editable?: boolean;
  defaultItemProps?: object;
  ref?: (form: MobxForm) => void;
  rootRef?: (form: JSX.Element) => void;
  onSubmit?: Function;
  type?: any;
  validateFieldsOnly?: string[];
  // children?: React.ReactChildren;
}

export interface IErrorField {
  field: string;
  message: string;
}

export interface IErrorFields {
  [key: string]: IErrorField[];
}

export interface IWrappedComponentProps {
  children?: ReactNode;
  form?: MobxForm;
  ref?: React.Ref<HTMLFormElement>;
}

export interface IFieldOptions {
  rules: IRule;
  // TODO: add method
}

export type IWrappedComponent<T = {}> =
  | React.SFC<T & IWrappedComponentProps>
  | React.ComponentClass<T & IWrappedComponentProps>;

const DEFAULT_VALIDATE_TRIGGER = 'onChange';
const DEFAULT_TRIGGER = DEFAULT_VALIDATE_TRIGGER;

@observer
export default class MobxForm<T = {}> extends React.Component<IMobxFormProps & T, any> {
  static childContextTypes = {
    form: PropTypes.object, // the form object
    defaultItemProps: PropTypes.object, // global default FormItem props
  };
  static defaultProps = {
    editable: true,
  };
  WrappedComponent: IWrappedComponent<T> = props => <form {...props} />;
  prefix?: string;
  defaultItemProps?: object;
  @observable errors = new Map<string, IErrorField[]>();
  @observable fieldOptions = new Map<string, IFieldOptions>();
  @observable fieldTouched = new Map<string, boolean>();

  @computed
  get fieldsNames(): string[] {
    return Array.from(this.fieldOptions.keys());
  }

  @observable _store = {};

  @computed
  get store() {
    return this.props.store || this._store;
  }

  getChildContext() {
    return {
      form: this,
      defaultItemProps: this.defaultItemProps,
    };
  }

  @autobind
  getFieldDecorator(name: string, customFieldOption = {}) {
    return element => React.cloneElement(element, this.getFieldProps(name, customFieldOption));
  }

  @autobind
  getFieldError(name: string): IErrorField[] {
    if (!this.errors.has(name)) {
      this.errors.set(name, []);
    }
    return this.errors.get(name);
  }

  @autobind
  getFieldsError(): Map<string, IErrorField[]> {
    return toJS(this.errors);
  }

  @autobind
  isEditable(): boolean {
    return this.props.editable;
  }

  @autobind
  getFieldProps(name: string, customFieldOption = {}) {
    const store = this.store;
    if (!store) throw new Error('Must pass `store` with Mobx instance.');
    if (!name) {
      throw new Error('Must call `getFieldProps` with valid name string!');
    }

    const storeOptions = (store.__options && store.__options[name]) || {};
    const fieldOption = {
      getValueFromEvent,
      name,
      valuePropName: 'value',
      trigger: DEFAULT_TRIGGER,
      validateTrigger: DEFAULT_VALIDATE_TRIGGER,
      appendProps: {},
      ...storeOptions,
      ...customFieldOption,
    };
    const {
      trigger,
      validateTrigger,
      valuePropName,
      parseValue,
      appendProps,
      // initialValue,
      otherProps,
    } = fieldOption;
    const value = this.getFieldValue(name);
    this.setFieldOption(name, fieldOption);
    this.setStartFilchedFiled(name);
    const props = {
      [valuePropName]: parseValue ? parseValue(value) : value,
      [trigger]: this.createHandler(fieldOption),
      'data-field-name': name,
      ...appendProps,
      ...otherProps,
    };
    if (!this.isEditable()) {
      props.disabled = true;
    }
    if (validateTrigger !== trigger)
      props[validateTrigger] = this.createValidateHandler(fieldOption);
    return props;
  }

  @action.bound
  setFieldOption(name: string, value: IFieldOptions) {
    this.fieldOptions.set(name, value);
  }

  @action.bound
  removeField(name: string) {
    this.fieldOptions.delete(name);
    this.fieldTouched.delete(name);
  }

  getTargetFields() {
    const store = this.store;
    return this.prefix ? _.get(store, this.prefix) : store;
  }

  @autobind
  getFieldValue(path: string, defaultValue?: any) {
    return toJS(
      _.get(this.store, this.prefix ? [this.prefix, path].join('.') : path, defaultValue)
    );
  }

  @action.bound
  setField(path: string, value: any) {
    const store = this.store;
    return _.set(store, this.prefix ? [this.prefix, path].join('.') : path, value);
  }

  @action.bound
  setStartFilchedFiled(name: string) {
    if (!this.fieldTouched.has(name)) {
      this.fieldTouched.set(name, false);
    }
  }

  @action.bound
  touchedField(name: string) {
    this.fieldTouched.set(name, true);
  }

  _getAllowRules(fieldName, rules) {
    const { validateFieldsOnly } = this.props;

    let allowFieldRules = rules;

    if (
      _.isArray(allowFieldRules) &&
      _.isArray(validateFieldsOnly) &&
      validateFieldsOnly.indexOf(fieldName) === -1
    ) {
      allowFieldRules = allowFieldRules.filter(rule => {
        return !rule.required && !(rule.validateType === 'requiredValidator');
      });
    }

    return allowFieldRules;
  }

  @action.bound
  validateFields(): Promise<any> {
    this.fieldsNames.forEach(name => this.fieldTouched.set(name, true));

    const needValidateName = [];
    const rules = this.fieldsNames.reduce((o, name) => {
      const fieldRules = toJS(this.fieldOptions.get(name).rules);
      if ((!_.isArray(fieldRules) && fieldRules) || (_.isArray(fieldRules) && fieldRules.length)) {
        const allowRules = this._getAllowRules(name, fieldRules);

        if (allowRules && allowRules.length) {
          needValidateName.push(name);
          o[name] = allowRules;
        }
      }

      return o;
    }, {});

    const validator = new AsyncValidator(rules);
    return new Promise((resolve, reject) => {
      const values = toJS(this.getTargetFields());
      // flatten values that need validate
      const flattenValue = needValidateName.reduce((o, cur) => {
        o[cur] = this.getFieldValue(cur);
        return o;
      }, {});

      validator.validate(flattenValue, (err: IErrorField[], fields: IErrorFields) => {
        if (fields) {
          this.resetErrors();
          return reject(fields);
        }
        return resolve(values);
      });
    }).catch(
      action(errors => {
        const ErrorMap = new Map();
        for (const name in errors) {
          ErrorMap.set(name, errors[name]);
        }
        this.errors = ErrorMap;
        return Promise.reject(errors);
      })
    );
  }

  @autobind
  validateField(name: string, value: any, rules: IRule): Promise<void> {
    const allowRules = this._getAllowRules(name, rules);

    if (!allowRules || !allowRules.length) return Promise.resolve();

    return new Promise((res, rej) => {
      const validator = new AsyncValidator({ [name]: allowRules });
      validator.validate(
        { [name]: value },
        action((err: IErrorField[], fields: IErrorFields) => {
          this.errors.set(name, err || []);
          res();
        })
      );
    });
  }

  createHandler({ name, onChange }) {
    return e => {
      const value = getValueFromEvent(e);
      if (this.isEditable()) {
        if (onChange) {
          onChange(value);
        }
        this.setField(name, value);
      }
    };
  }

  createValidateHandler({ name, rules }) {
    return e => {
      const value = getValueFromEvent(e);
      this.validateField(name, value, rules);
    };
  }

  @action.bound
  resetErrors(): void {
    this.fieldsNames.forEach(name => {
      this.errors.delete(name);
      this.errors.set(name, []);
    });
  }

  @action.bound
  resetTouched() {
    this.fieldsNames.forEach(name => {
      this.fieldTouched.set(name, false);
    });
  }

  @action.bound
  resetValue() {
    this.fieldsNames.forEach(name => {
      this.setField(name, null);
    });
  }

  @action.bound
  reset(isResetValue = true) {
    if (isResetValue) {
      this.resetValue();
    }
    this.resetErrors();
    this.resetTouched();
  }

  render() {
    let WrappedComponent = this.WrappedComponent;
    return <WrappedComponent {...this.props} form={this} ref={this.props.rootRef} />;
  }
}
