import React from 'react';
import { Select } from 'antd';
import iso3311a2 from 'iso-3166-1-alpha-2';

const Option = Select.Option;

export default props => (
  <Select {...props} optionFilterProp="desc" showSearch name={'country'} style={{ width: '100%' }}>
    {Object.keys(iso3311a2.getData()).map(key => {
      const country = iso3311a2.getCountry(key);

      return (
        <Option
          key={key}
          value={key}
          title={country}
          desc={`${key} ${key.toLowerCase()} ${country} ${country.toLowerCase()} ${country.toUpperCase()}`}
        >
          {country}
        </Option>
      );
    })}
  </Select>
);
