import React from 'react';

import { Radio } from 'antd';
import Icon from 'react-fontawesome';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default props => (
  <RadioGroup size="large" name={'sex'} {...props}>
    <RadioButton value="M">
      <Icon name="mars" /> Male
    </RadioButton>
    <RadioButton value="F">
      <Icon name="venus" /> Female
    </RadioButton>
  </RadioGroup>
);
