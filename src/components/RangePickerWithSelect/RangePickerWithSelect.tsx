import Button from '@latoken-component/Button';
import { DatePicker, Input } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';
import cn from 'classnames';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './styles.styl';

const RangePicker = DatePicker.RangePicker;

export type IResult = [moment.Moment, moment.Moment];

export interface IRangePickerWithSelectProps {
  className?: string;
  style?: React.CSSProperties;
  value?: IResult;
  isMobile?: boolean;
  propsRange?: RangePickerProps;

  onChange?(val: IResult): void;
}

@observer
export default class RangePickerWithSelect extends Component<IRangePickerWithSelectProps> {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    value: PropTypes.array,
    onChange: PropTypes.func,
  };
  static defaultProps = {};
  @observable radio?: string = 'all';

  @observable oldRange?: number[];
  radioList = ['All', 'Today', 'Week', '2 week', 'Month', '3 month', '6 month', 'Year'];
  @observable range: IResult;
  nodeInputEnd: HTMLInputElement;
  @observable isTouched: boolean = false;

  @computed
  get start() {
    return this.range && this.range[0] ? this.range[0].format('YYYY-MM-DD') : null;
  }

  @computed
  get end() {
    return this.range && this.range[1] ? this.range[1].format('YYYY-MM-DD') : null;
  }

  @computed
  get isValidStart() {
    if (_.isArray(this.range) && this.isTouched) {
      return !!this.start;
    }
    return true;
  }

  @computed
  get isValidEnd() {
    if (_.isArray(this.range) && this.isTouched) {
      return !!this.end;
    }
    return true;
  }

  @autobind
  getInputEnd(el: Input) {
    if (el && el.input) {
      this.nodeInputEnd = el.input;
    }
  }

  @autobind
  handlerChangeRange(range: IResult) {
    range[0].startOf('day');
    range[1].endOf('day');

    this.pushChange(range);

    const [start, end] = range || [null, null];
    const [oldStart, oldEnd] = this.oldRange || [null, null];

    if (
      (start && oldStart && start.valueOf() !== oldStart) ||
      (end && oldEnd && end.valueOf() !== oldEnd)
    ) {
      this.radio = '';
      this.oldRange = null;
    }
  }

  @action.bound
  handlerChangeRadio(value) {
    this.radio = value;
    const start = moment().startOf('day');
    const end = moment().endOf('day');
    const range: IResult = [start, end];
    this.isTouched = true;

    if (this.radio === 'all') {
      return this.pushChange(null);
    }

    switch (this.radio) {
      case 'today':
        this.oldRange = [start.valueOf(), end.valueOf()];
        break;
      case 'week':
        this.oldRange = [start.subtract(6, 'd').valueOf(), end.valueOf()];
        break;
      case '2week':
        this.oldRange = [start.subtract(13, 'd').valueOf(), end.valueOf()];
        break;
      case 'month':
        this.oldRange = [
          start
            .subtract(1, 'M')
            .add(1, 'd')
            .valueOf(),
          end.valueOf(),
        ];
        break;
      case '3month':
        this.oldRange = [
          start
            .subtract(3, 'M')
            .add(1, 'd')
            .valueOf(),
          end.valueOf(),
        ];
        break;
      case '6month':
        this.oldRange = [
          start
            .subtract(6, 'M')
            .add(1, 'd')
            .valueOf(),
          end.valueOf(),
        ];
        break;
      case 'year':
        this.oldRange = [
          start
            .subtract(1, 'y')
            .add(1, 'd')
            .valueOf(),
          end.valueOf(),
        ];
        break;
    }

    this.pushChange(range);
  }

  pushChange(range: IResult) {
    this.range = range;
    if (this.props.onChange) {
      this.props.onChange(range);
    }
  }

  @autobind
  optionsRateList() {
    return this.radioList.map((item, index) => {
      const name = item.replace(' ', '').toLocaleLowerCase();
      return (
        <Button
          key={index}
          size={'small'}
          onClick={e => {
            this.handlerChangeRadio(name);
          }}
          active={this.radio === name}
          style={{ marginRight: 8, marginTop: 8 }}
        >
          {item}
        </Button>
      );
    });
  }

  @autobind
  handlerChangeStart(e) {
    if (!this.range) {
      this.range = [null, null];
    }
    const value = moment(e.target.value);
    if (value.isValid()) {
      this.range[0] = value;
    } else {
      this.range[0] = null;
    }
    if (this.start && this.end) {
      this.handlerChangeRange(this.range);
    }
  }

  @autobind
  handlerChangeEnd(e) {
    if (!this.range) {
      this.range = [null, null];
    }
    const value = moment(e.target.value);
    if (value.isValid()) {
      this.range[1] = value;
    } else {
      this.range[1] = null;
    }
    if (this.start && this.end) {
      this.handlerChangeRange(this.range);
    }
  }

  @autobind
  handlerBlurStart() {
    if (this.nodeInputEnd && !this.end) {
      this.nodeInputEnd.focus();
    }
  }

  @autobind
  handlerBlurEnd() {
    this.isTouched = true;
  }

  render() {
    const { style, value, className, propsRange, isMobile } = this.props;
    return (
      <div
        className={cn('RangePickerWithSelect', className, styles.RangePickerWithSelect)}
        style={style}
      >
        {isMobile ? (
          <>
            <div key={'start'} className={cn(styles.row, !this.isValidStart && 'has-error')}>
              <div className={styles.label}>from:</div>
              <Input
                value={this.start}
                type={'date'}
                // @ts-ignore
                max={this.end}
                onChange={this.handlerChangeStart}
                onBlur={this.handlerBlurStart}
              />
            </div>
            <div key={'end'} className={cn(styles.row, !this.isValidEnd && 'has-error')}>
              <div className={styles.label}>to:</div>
              <Input
                ref={this.getInputEnd}
                value={this.end}
                // @ts-ignore
                min={this.start}
                type={'date'}
                onBlur={this.handlerBlurEnd}
                onChange={this.handlerChangeEnd}
              />
            </div>
            {this.optionsRateList()}
          </>
        ) : (
          <RangePicker
            {...propsRange}
            onChange={this.handlerChangeRange}
            value={value}
            renderExtraFooter={this.optionsRateList}
          />
        )}
      </div>
    );
  }
}

for (var i = 0; i < 10; i++) {
  setTimeout(()=>{
    console.log(i)
  })

}
