import React from 'react';
import { inject } from 'mobx-react';
import * as Field from '../Field';
import Form from '@latoken-component/form';
import { Button, Col, Row } from 'antd';
import FormDemoStore from '../../../stores/__demo__/FormDemoStore';

const defaultItemProps = { className: 'my-item-class' };

@inject('formDemo')
export default class Example extends React.Component<{ formDemo: FormDemoStore }, {}> {
  form: any;
  formRef = ref => {
    (window as any).form = ref;
    this.form = ref;
  };
  onSubmit = e => {
    console.log('onSubmit');
    this.form
      .validateFields()
      .then(data => console.log(data)) // add here store action
      .catch(err => console.log(err));
  };

  componentDidMount() {
    // setTimeout(() => {
    //   this.form.validateFields();
    // }, 1000);
  }

  render() {
    const { formDemo } = this.props;
    return (
      <Col>
        <Form
          ref={this.formRef}
          onSubmit={this.onSubmit}
          store={formDemo.data}
          defaultItemProps={defaultItemProps}
        >
          <Row gutter={20}>
            <Col md={8}>
              <Field.Name id="first-name" label="First name" name="firstName" required />
            </Col>
            <Col md={8}>
              <Field.Email label="Email" name="email" />
            </Col>
            <Col md={8}>
              <Field.PhoneMask label="Phone" name="phone" />
            </Col>
          </Row>
          <Field.DatePicker label="Date of birthday" name="birthDate" required />
          <Field.Gender label="Gender" name="gender" required />
          <Field.SelectCountry label="Select country" name="citizenship" />
          <Field.Checkbox name="checkbox">Click </Field.Checkbox>
          <Field.Upload label="Load files" name="documents" url="/test_url/" />
          <Field.EthereumAddress label="Ethereum Address" name="ethereum" />
          <div>
            <h4>tyoe address</h4>
            <ul>
              <li>0xFf87609c76a932678aE8231F54102536F38650B2</li>
            </ul>
          </div>
          <Field.BTCAddress label="BTC Address" name="btc" />
          <div>
            <h4>tyoe address</h4>
            <ul>
              <li> 15atoGNRznnZKy5Q8tTi9tQ1NRfedYjroP</li>
              <li> 3JLJEcUdGPsngQ4Ewz69R5FotgZ3FnjKEi</li>
              <li> bc1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxswvvzej</li>
            </ul>
          </div>
          <Field.NIMIQAddress label="NIMIQ Address" name="nimiq" />
          <div>
            <h4>tyoe address</h4>
            <ul>
              <li> NQ34 49HF VKMX FHMD 7AMY K59J SFA1 3D8U 2VJP</li>
              <li> NQ41U5D7QEXYHM6UYJLNS9D1BYXYY5QXNQPG</li>
            </ul>
          </div>
          <Field.NEOAddress label="NEO Address" name="neo" />
          <div>
            <h4>tyoe address</h4>
            <ul>
              <li>AS8iEhfeU88vkx6opXtQdEgSaVDArnusRB</li>
            </ul>
          </div>
          <Field.AIONAddress label="AION Address" name="aion" />
          <div>
            <h4>tyoe address</h4>
            <ul>
              <li>0xa04c126f9d2eba02c926210189c7bccf7ad86105dbca1c4d910cf2b692ac7dd5</li>
              <li>0xa04c126F9D2EBa02c926210189c7bcCF7AD86105DBca1C4D910Cf2b692ac7dD5</li>
              <li>0xa0d1565b5b1056942421b2473d25cc2ad2e14d1ed358a908f9a2475fff26d616</li>
              <li>0xA0D1565b5B1056942421B2473D25cC2Ad2E14d1ED358a908f9a2475FfF26D616</li>
              <li>0xa001810b568d7ebea2b89c06904ed051edc8e41b5e586cdb0e4fd7730b5dfc3e</li>
              <li>0xA0Da976c4dD9a1978b357ecE19f7dC3F2f181513c6e4fB9DA8624C8550435bB1</li>
              <li>0xa0a763e214a59d162631e85feb58f2b27b9230b2104e7871cedc73c21e7f0d94</li>
            </ul>
            <h4>tyoe invalid address</h4>
            <ul>
              <li>b01e968221584946dac1e6842bf985de7ff49c8b9913220ed793d64a150b2864</li>
              <li>a0da976c4dD9a1978b357ecE19f7dC3F2f181513c6e4fB9DA8624C8550435bB1</li>
            </ul>
          </div>
          <Field.AutoComplete label="AutoComplete" name="AutoComplete" />
          <Field.RangePicker label="RangePicker" name="RangePicker" />
          <Field.RangePickerWithSelect label="RangePickerWithSelect" name="RangePickerWithSelect" />
          <Field.ImageLoader
            label="RangePickerWithSelect"
            name="ImageLoader"
            baseUrl={'localhost:4100/'}
            url={'file/private/test'}
            onChange={images => {
              console.log(`!!!! index.tsx:110 \n imgs `, images, '\n !!!!');
            }}
          />
          <Field.DocumentLoader
            label="RangePickerWithSelect"
            name="ImageLoader"
            baseUrl={'localhost:4100/'}
            url={'file/private/test'}
            id={'123'}
            onChange={images => {
              console.log(`!!!! index.tsx:110 \n imgs `, images, '\n !!!!');
            }}
          />
          <Button htmlType="submit">Submit</Button>
        </Form>
      </Col>
    );
  }
}
