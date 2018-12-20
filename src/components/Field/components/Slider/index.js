import _ from 'lodash';
import React from 'react';
import { Slider, InputNumber, Col, Row } from 'antd';
import styles from './styles.styl';
import PropTypes from 'prop-types';

const SliderBlock = props => (
  <Col className={styles.sliderContainer}>
    <Row>
      <Col span={16}>
        <Slider {...props} />
      </Col>
      <Col span={4} offset={1} style={{ textAlign: 'center' }}>
        <InputNumber
          min={0}
          {...props}
          onChange={val => _.isNumber(val) && props.onChange(val)}
          placeholder=""
        />
      </Col>
      <Col span={2} offset={1} style={{ textAlign: 'left' }}>
        <b>{props.symbol}</b>
      </Col>
    </Row>
    <div className={styles.placeholder}>{props.placeholder}</div>
  </Col>
);

SliderBlock.displayName = 'SliderBlock';

SliderBlock.propsTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};

export default SliderBlock;
