import React from 'react';
import { Select } from 'antd';

const Option = Select.Option;

export default props => (
  <Select {...props} style={{ width: '100%' }}>
    {[
      ['passport', 'Passport'],
      ['identity_card', 'Identity Card'],
      ['driver_license', 'Driver License'],
    ].map(item => (
      <Option key={item[0]} value={item[0]}>
        {item[1]}
      </Option>
    ))}
  </Select>
);
