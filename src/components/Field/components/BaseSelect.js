import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

const Option = Select.Option;

const BaseSelect = ({ options, ...props }) => {
  if (!Array.isArray(options)) return null;

  return (
    <div id={props.id}>
      <Select {...props} dropdownClassName={`${props.id}-dropdown`}>
        {options.map((opt, index) => (
          <Option key={index} value={opt.value}>
            {opt.text}
          </Option>
        ))}
      </Select>
    </div>
  );
};

BaseSelect.displayName = 'BaseSelect';

BaseSelect.propsTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
};

export default BaseSelect;
