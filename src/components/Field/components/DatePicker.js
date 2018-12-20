import React, { Component } from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'lodash';

@observer
export default class WrapDatePicker extends Component {
  static propTypes = {
    startMode: PropTypes.oneOf(['time', 'date', 'month', 'year', 'decade']),
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func,
    minDate: PropTypes.object,
    maxDate: PropTypes.object,
    name: PropTypes.string,
  };
  static defaultProps = {
    startMode: 'year',
  };

  @observable mode = 'year';
  disabledDate = startValue => {
    if (!startValue) {
      return false;
    }
    let result = false;

    if (this.props.maxDate && this.props.maxDate.isBefore(startValue)) {
      result = true;
    }
    if (this.props.minDate && this.props.minDate.isAfter(startValue)) {
      result = true;
    }

    return result;
  };

  handlerPanelChange = (date, mode) => {
    if (this.mode === 'year' && (mode === 'date' || _.isNull(mode))) {
      return (this.mode = 'month');
    }
    this.mode = mode;
  };

  handlerChange = date => {
    if (!date) {
      return this.props.onChange(null);
    }
    this.props.onChange(date.utc(moment().utcOffset()).unix());
  };

  constructor(props) {
    super(props);
    this.mode = props.startMode;
  }

  render() {
    let value;

    if (!this.props.value) {
      value = null;
    } else if (typeof this.props.value === 'number') {
      value = moment.utc(this.props.value * 1000);
    } else {
      throw new Error('value must be a number');
    }

    const defaultValue = this.props.maxDate || moment();

    return (
      <DatePicker
        {...this.props}
        defaultValue={moment(defaultValue, 'YYYY-MM-DD')}
        showToday={false}
        mode={this.mode}
        onPanelChange={this.handlerPanelChange}
        disabledDate={this.disabledDate}
        onChange={this.handlerChange}
        value={value}
        name={this.props.name}
        disabled={this.props.disabled}
      />
    );
  }
}
