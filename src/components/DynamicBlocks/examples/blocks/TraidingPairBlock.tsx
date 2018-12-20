import React from 'react';
import { Row, Col } from 'antd';
import { rules } from '@latoken-component/utils';
import * as Field from '@latoken-component/field/Field';
import { IDataBlock } from '../../DynamicBlocks';

const defaultFieldsProps = { rules: [rules.isRequired] };

export const TradingPairModel = {
  tradeIn: null,
  precisionPrice: null,
  precisionAmount: null,
  precisionTotal: null,
};

const allCrypto = [
  { text: 'LA', value: 'LA' },
  { text: 'ETH', value: 'ETH' },
  { text: 'BTC', value: 'BTC' },
  { text: 'USDT', value: 'USDT' },
];

export default class TraidingPairBlock extends React.Component<IDataBlock> {
  render() {
    const { index } = this.props;

    return (
      <Col>
        <Row>
          <Col span={12}>
            <Field.FullSelect
              name={`pairs[${index}].tradeIn`}
              label="Trade in"
              options={allCrypto}
              {...defaultFieldsProps}
            />
          </Col>
        </Row>
        <Row gutter={20}>
          <Col md={6}>
            <Field.InputNumber
              name={`pairs[${index}].precisionPrice`}
              label="Precision Price"
              {...defaultFieldsProps}
            />
          </Col>
          <Col md={6}>
            <Field.InputNumber
              name={`pairs[${index}].precisionAmount`}
              label="Precision Amount"
              {...defaultFieldsProps}
            />
          </Col>
          <Col md={6}>
            <Field.InputNumber
              name={`pairs[${index}].precisionTotal`}
              label="Precision Total"
              {...defaultFieldsProps}
            />
          </Col>
        </Row>
      </Col>
    );
  }
}
