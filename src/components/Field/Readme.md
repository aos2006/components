**Form and Fields**

```jsx harmony
const Example = require('./examples/index').default;
const TestChangeStore = require('./examples/testChangeStore').default;

<div>
  <Example />
  <TestChangeStore />
</div>

```

```jsx static
import Form from '@latoken-component/form';
import * as Field from '@latoken-component/field';
import { rules } from "@latoken-component/utils";

import { Col, Row, Button } from 'antd';

class DemoStore {
  defaultsInfo = {
    firstName: 'Mike',
    email: null,
    phone: null,
    gender: 'M',
    citizenship: null,
    birthDate: '',
  };

  @observable data = this.defaultsInfo;
}

const demoStore = new DemoStore();

const defaultItemProps = { className: 'my-item-class' };

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.formRef = ref => (this.form = ref);

    this.onSubmit = e => {
      e.preventDefault();

      this.form
        .validateFields()
        .then(data => console.log(data)) // add here store action
        .catch(err => console.log(err));
    };
  }

  render() {
    const { formDemo } = this.props;

    return (
      <Col>
        <Form ref={this.formRef} onSubmit={this.onSubmit} store={formDemo.data} defaultItemProps={defaultItemProps}>
          <Row gutter={20}>
            <Col md={8}>
              <Field.Name label="First name" name="firstName" required />
            </Col>
            <Col md={8}>
              <Field.Email label="Email" name="email" />
            </Col>
            <Col md={8}>
              <Field.Input label="Phone" name="phone" rules={[rules.isNumber, rules.isRequired]} />
            </Col>
          </Row>
          <Field.DatePicker label="Date of birthday" name="birthDate" required />
          <Field.Gender label="Gender" name="gender" required />
          <Field.SelectCountry label="Select country" name="citizenship" />
          <Button  htmlType="submit">Submit</Button>
        </Form>
      </Col>
    );
  }
}
```
