import React from 'react';
import { Col, Row } from 'antd';
import { Name, FullSelect } from '@latoken-component/field/Field';
import { rules } from '@latoken-component/utils';
import styles from './styles.styl';
import { createCmpProps } from './helpers';

const createProps = createCmpProps.bind(null, 'wizard-token');

const colProps = { md: 12 };
const rowProps = { gutter: 20 };

const protokolOptions = [
  { text: 'ERC20', value: 'ERC20' },
  { text: 'ERC223', value: 'ERC223' },
  { text: 'Other', value: 'Other' },
];

const marketPriceOptions = [{ text: 'ETH', value: 'ETH' }, { text: 'USI', value: 'USI' }];

const traidingPairsOptions = [{ text: 'ETH', value: 'ETH' }, { text: 'BTC', value: 'BTC' }];

export default class StepOne extends React.PureComponent {
  render() {
    return (
      <div>
        <div className={styles.warningInfo}>
          <p>WARNING:</p>
          <p>
            The only official link to apply for listing on LATOKEN is on this page. Please double
            check to make sure it is hosted on latoken.com.
          </p>
          <p>
            DO NOT send any form of payment (crypto or fiat) to any parties claiming to assist with
            the listing process and beware of spoofed emails.
          </p>
          <p>
            When in doubt, kindly email us at info@latoken.com to verify if any correspondence was
            legitimate.
          </p>
        </div>
        <h3 className={styles.stepTitle}>Token info</h3>
        <Col>
          <Row {...rowProps}>
            <Col {...colProps}>
              <Name {...createProps(['project', 'name'])} />
            </Col>
            <Col {...colProps}>
              <Name
                {...createProps(['project', 'website'])}
                rules={[rules.isWebsite, rules.isRequired]}
              />
            </Col>
          </Row>
          <Row {...rowProps}>
            <Col {...colProps}>
              <FullSelect {...createProps(['token', 'protokol'])} options={protokolOptions} />
            </Col>
            <Col {...colProps}>
              <Name {...createProps(['coinmarketcap', 'link'])} rules={[rules.isWebsite]} />
            </Col>
          </Row>
          <Row {...rowProps}>
            <Col {...colProps}>
              <Name
                {...createProps(['current', 'market', 'cap'])}
                label="Current Market Cap of your Token"
              />
            </Col>
            <Col {...colProps}>
              <FullSelect
                {...createProps(['current', 'market', 'price'])}
                label="Current Market Price of your Token"
                options={marketPriceOptions}
              />
            </Col>
          </Row>
          <Row {...rowProps}>
            <Col {...colProps}>
              <Name {...createProps(['listing', 'on', 'exchanges'])} rules={[]} />
            </Col>
            <Col {...colProps}>
              <FullSelect
                {...createProps(['traiding', 'pairs'])}
                label="Which traiding pairs you like to list on LATOKEN?"
                options={traidingPairsOptions}
              />
            </Col>
          </Row>
        </Col>
      </div>
    );
  }
}
