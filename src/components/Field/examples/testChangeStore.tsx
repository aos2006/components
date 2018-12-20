import React from 'react';
import { inject, observer } from 'mobx-react';
import { InputNumber } from '../Field';
import Form from '@latoken-component/form';
import { Col } from 'antd';
import FormDemoStore from '../../../stores/__demo__/FormDemoStore';

const defaultItemProps = { className: 'my-item-class' };

@inject('formDemo')
@observer
export default class TestChangeStore extends React.Component<{ formDemo: FormDemoStore }, {}> {
  input: any;
  inputRef = ref => (this.input = ref);
  wrap: any;
  wrapRef = ref => (this.wrap = ref);
  form: Form;
  formRef = ref => (this.form = ref);
  onSubmit = e => {
    e.preventDefault();
    this.form
      .validateFields()
      .then(data => console.log(data)) // add here store action
      .catch(err => console.log(err));
  };

  componentDidMount() {
    setTimeout(() => {
      console.log(`!!!! testChangeStore.tsx:29 \n this.form `, this.form, '\n !!!!');
      console.log('set vanila value');
      this.form.touchedField('number');
      this.input.inputNumberRef.setValue(23);
    }, 1000);
    setTimeout(() => {
      console.log('set store value');
      this.props.formDemo.data.number = 4;
    }, 2000);
  }

  render() {
    const { formDemo } = this.props;
    console.log('render TestChangeStore');
    return (
      <Col>
        <Form
          ref={this.formRef}
          onSubmit={this.onSubmit}
          store={formDemo.data}
          defaultItemProps={defaultItemProps}
          layout={'vertical'}
        >
          <br />
          <br />
          <InputNumber
            id="number"
            label="Test Store Change"
            name="number"
            wrapperRef={this.wrapRef}
            componentRef={this.inputRef}
            rules={[
              {
                type: 'number',
                max: 10,
              },
            ]}
          />
          <InputNumber
            id="number1"
            label="Test show required after change first fields"
            name="number2"
            rules={[
              {
                required: true,
              },
            ]}
          />
        </Form>
      </Col>
    );
  }
}
