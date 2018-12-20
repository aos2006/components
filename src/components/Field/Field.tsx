import { createField } from '@latoken-component/form';
import { rules } from '@latoken-component/utils';
import {
  normlizeNIMIQ,
  normlizeTrim,
} from '@latoken-component/utils/utils/validations/pureFunctions';
import RangePickerWithSelectInput from '@latoken-component/RangePickerWithSelect/RangePickerWithSelect';
import {
  AutoComplete as AntAutoComplete,
  Checkbox as AntCheckbox,
  DatePicker as AntDatePicker,
  Form,
  Input as AntInput,
  InputNumber as AntInputNumber,
  Radio as AntRadio,
} from 'antd';
import { omit } from 'lodash';
import React from 'react';
import BaseSelect from './components/BaseSelect';
import DatePickerInput from './components/DatePicker';
import DocumentLoaderInput, { IDocumentLoaderProps } from './components/DocumentLoader';
import DocumentTypeInput from './components/DocumentType';
import GenderInput from './components/Gender';
import ImageLoaderInput, { IImageLoaderProps } from './components/ImageLoader';
import PhoneInput from './components/Phone';
import SelectCountryInput from './components/SelectCountry';
import SliderBlock from './components/Slider';
import UploadInput, { IUploadProps } from './components/Upload';
import { formItemLayout } from './layouts';

const AntTextArea = AntInput.TextArea;
const AntRangePicker = AntDatePicker.RangePicker;
const AntRadioGroup = AntRadio.Group;

const lightWrapper = props => (
  <div className={typeof props.className !== 'undefined' ? props.className : ''}>
    {props.children}
    <p style={{ color: 'red' }}>{props.help}</p>
  </div>
);

const defaultWrapper = Form.Item;

const wrapperWithLabel = props => {
  const { label, extensions, labelInOneLine } = props;
  let newLabel = label;

  if (extensions) {
    const supportedText = extensions.join(', ');
    newLabel = (
      <span>
        {label} {labelInOneLine ? '' : <br />} (only {supportedText})
      </span>
    ); //TODO fix error 'each child in array ...'
  }

  return (
    <Form.Item {...props} label={newLabel}>
      {props.children}
    </Form.Item>
  );
};

const defaultFieldParams = {
  wrapper: defaultWrapper,
  wrapperParams: { ...formItemLayout, hasFeedback: false },
  component: props => <AntInput {...omit(props, ['maskChar', 'mask'])} />,
};

export const wrappers = {
  light: lightWrapper,
  default: defaultWrapper,
};

export const Input = createField({
  ...defaultFieldParams,
});

export const TextArea = createField({
  ...defaultFieldParams,
  component: AntTextArea,
  wrapperParams: {
    ...defaultFieldParams.wrapperParams,
    hasFeedback: false,
  },
});

export const InputNumber = createField({
  ...defaultFieldParams,
  component: AntInputNumber,
  wrapperParams: {
    ...defaultFieldParams.wrapperParams,
    hasFeedback: false,
  },
});

export const Name = createField({
  ...defaultFieldParams,
  componentParams: {
    rules: [...rules.def.name],
  },
});

export const Email = createField({
  ...defaultFieldParams,
  componentParams: {
    rules: [rules.isEmail],
  },
});

export const PhoneMask = createField({
  ...defaultFieldParams,
  componentParams: {
    rules: rules.phoneNumberRules,
  },
  component: props => <PhoneInput defaultCountry={'us'} {...props} />,
});

export const Phone = createField({
  ...defaultFieldParams,
  componentParams: {
    rules: [rules.isNumber],
  },
  component: props => <AntInput addonBefore={'+'} {...props} />,
});

export const Address = createField({
  ...defaultFieldParams,
  componentParams: {
    rules: [...rules.def.address],
  },
});

export const Select = createField({
  ...defaultFieldParams,
  component: BaseSelect,
  wrapper: wrappers.light,
  wrapperParams: {
    ...defaultFieldParams.wrapperParams,
  },
});

export const FullSelect = createField({
  ...defaultFieldParams,
  component: BaseSelect,
  wrapperParams: {
    ...defaultFieldParams.wrapperParams,
  },
});

export const SelectCountry = createField({
  ...defaultFieldParams,
  component: SelectCountryInput,
  componentParams: {
    rules: [...rules.def.name],
  },
  wrapperParams: {
    ...defaultFieldParams.wrapperParams,
  },
});

export const DatePicker = createField({
  ...defaultFieldParams,
  component: DatePickerInput,
  componentParams: {
    rules: [],
  },
  wrapperParams: {
    ...defaultFieldParams.wrapperParams,
    hasFeedback: false,
  },
});

export const RangePicker = createField({
  ...defaultFieldParams,
  component: AntRangePicker,
});

export const Gender = createField({
  ...defaultFieldParams,
  component: GenderInput,
  wrapperParams: {
    ...defaultFieldParams.wrapperParams,
    hasFeedback: false,
  },
});

export const Upload = createField<IUploadProps>({
  ...defaultFieldParams,
  component: UploadInput,
});

export const DocumentLoader = createField<IDocumentLoaderProps>({
  ...defaultFieldParams,
  component: DocumentLoaderInput,
  wrapperParams: { hasFeedback: false },
  wrapper: wrapperWithLabel,
});

export const ImageLoader = createField<IImageLoaderProps>({
  ...defaultFieldParams,
  component: ImageLoaderInput,
  wrapper: lightWrapper,
});

export const DocumentType = createField({
  ...defaultFieldParams,
  component: DocumentTypeInput,
});

export const Checkbox = createField({
  ...defaultFieldParams,
  component: props => <AntCheckbox checked={props.value} {...props} />,
  mobxFormItemProps: {
    changeTouchEvent: 'onChange',
  },
  wrapperParams: {
    ...defaultFieldParams.wrapperParams,
    hasFeedback: false,
  },
});

export const RadioGroup = createField({
  ...defaultFieldParams,
  component: AntRadioGroup,
});

export const EthereumAddress = createField({
  ...defaultFieldParams,
  componentParams: {
    rules: [...rules.ethereumAddress, rules.isNotLatokenAddress],
  },
  mobxFormItemProps: {
    normalize: normlizeTrim,
  },
  component: props => (
    <AntInput placeholder="0x0000000000000000000000000000000000000000" {...props} />
  ),
});

export const BTCAddress = createField({
  ...defaultFieldParams,
  componentParams: {
    rules: [...rules.btcAddress],
  },
  mobxFormItemProps: {
    normalize: normlizeTrim,
  },
  component: AntInput,
});
export const OMNIAddress = createField({
  ...defaultFieldParams,
  componentParams: {
    rules: [...rules.omniAddress],
  },
  mobxFormItemProps: {
    normalize: normlizeTrim,
  },
  component: AntInput,
});

export const NIMIQAddress = createField({
  ...defaultFieldParams,
  componentParams: {
    rules: [...rules.nimiqAddress],
  },
  mobxFormItemProps: {
    normalize: normlizeNIMIQ,
  },
  component: props => (
    <AntInput placeholder="NQ00 0000 0000 0000 0000 0000 0000 0000 0000" {...props} />
  ),
});

export const NEOAddress = createField({
  ...defaultFieldParams,
  componentParams: {
    rules: [...rules.neoAddress],
  },
  mobxFormItemProps: {
    normalize: normlizeTrim,
  },
  component: AntInput,
});

export const AIONAddress = createField({
  ...defaultFieldParams,
  componentParams: {
    rules: [...rules.aionAddress],
  },
  mobxFormItemProps: {
    normalize: normlizeTrim,
  },
  component: AntInput,
});

export const BOSAddress = createField({
  ...defaultFieldParams,
  componentParams: {
    rules: [...rules.bosAddress],
  },
  mobxFormItemProps: {
    normalize: normlizeTrim,
  },
  component: AntInput,
});

export const AutoComplete = createField({
  ...defaultFieldParams,
  component: AntAutoComplete,
});

export const RangePickerWithSelect = createField({
  ...defaultFieldParams,
  component: RangePickerWithSelectInput,
});

export const Website = createField({
  ...defaultFieldParams,
  componentParams: {
    rules: [rules.isWebsite],
  },
});

export const Slider = createField({
  wrapper: Form.Item,
  component: SliderBlock,
  componentParams: {
    rules: [rules.isNumber],
  },
});
