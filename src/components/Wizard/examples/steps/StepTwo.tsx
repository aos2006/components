import React from 'react';
import { Col, Row } from 'antd';
import { Name, FullSelect, Website } from '@latoken-component/field/Field';
import { rules } from '@latoken-component/utils';
import styles from './styles.styl';
import { createCmpProps } from './helpers';

const createProps = createCmpProps.bind(null, 'wizard-token');

const colProps = { md: 12 };
const rowProps = { gutter: 20 };

const priceOptions = [{ text: 'ETH', value: 'ETH' }, { text: 'USD', value: 'USD' }];

const finishOptions = [{ text: 'Yes', value: true }, { text: 'No', value: false }];

const linkItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
  wrapperClassName: styles.linkWrapper,
};

export default class StepOne extends React.PureComponent {
  render() {
    return (
      <div>
        <h3 className={styles.stepTitle}>Project details</h3>
        <Col>
          <Row {...rowProps}>
            <Col {...colProps}>
              <FullSelect
                {...createProps(['finish', 'ICO'])}
                label="Did your project finish ICO"
                options={finishOptions}
                rules={[rules.isBoolean]}
              />
            </Col>
            <Col {...colProps}>
              <FullSelect
                {...createProps(['raised', 'count'])}
                label="How much was raised during ICO?"
                options={priceOptions}
              />
            </Col>
          </Row>
          <Row {...rowProps}>
            <Col {...colProps}>
              <Name
                {...createProps(['participated', 'count'])}
                label="How many people participated in ICO?"
              />
            </Col>
            <Col {...colProps}>
              <FullSelect
                {...createProps(['last', 'ICO', 'price'])}
                label="What was the last ICO price?"
                options={priceOptions}
              />
            </Col>
          </Row>
          <h4 className={styles.sectionTitle}>Links</h4>
          <Row {...rowProps}>
            <Col span={12}>
              <Website label="GitHub" name="github" {...linkItemLayout} />
              <Website label="Facebook" name="facebook" {...linkItemLayout} />
              <Website label="Youtube" name="youtube" {...linkItemLayout} />
              <Website label="WebsiteedIn" name="linkedIn" {...linkItemLayout} />
            </Col>
            <Col span={12}>
              <Website label="Twitter" name="twitter" {...linkItemLayout} />
              <Website label="Telegram" name="telegram" {...linkItemLayout} />
              <Website label="Blog" name="blog" {...linkItemLayout} />
              <Website label="Slack" name="slack" {...linkItemLayout} />
            </Col>
          </Row>
        </Col>
      </div>
    );
  }
}
