import React, { ReactNode } from 'react';
import { observer } from 'mobx-react';
import Form from '@latoken-component/form';
import Button from '@latoken-component/button';
import StepsLine from './components/StepsLine';
import EndStep from './components/EndStep';
import styles from './styles.styl';
import { autobind } from 'core-decorators';

export interface IWizardFieldsBlockProps<T = any> {
  allData?: T;
  mode?: string;
}

export interface IWizardStep {
  title: string | ReactNode;
  component: React.ComponentClass<IWizardFieldsBlockProps>;
  validate?: (allData: any) => Promise<void>;
}

export interface IWizardStore {
  nextStep: () => void;
  prevStep: () => void;
  submitData: () => void;
  resetWizard: () => void;
  closeWizard: () => void;
  data: any;
  stepNumber: number;
  isSubmitStep: boolean;
  isFinishStep: boolean;
  loading: boolean;
  validateFieldsOnly?: string[];
  error?: string;
  stepsCount: number;
  mode?: string;
}

export interface IWizardProps {
  store: IWizardStore;
  title?: string;
  finishStep?: React.ComponentClass;
  steps: IWizardStep[];
  prefix?: string;
  mode?: string;
}

@observer
export default class Wizard extends React.Component<IWizardProps> {
  form: Form;

  constructor(props) {
    super(props);
    this.props.store.stepsCount = this.props.steps.length;
  }

  @autobind
  formRef(ref) {
    this.form = ref;
  }

  @autobind
  renderFooter() {
    const { store } = this.props;

    return (
      <div className={styles.stepsButtons}>
        <Button id="back" size="large" onClick={store.prevStep} disabled={store.stepNumber === 0}>
          BACK
        </Button>
        <Button
          id={store.isSubmitStep ? 'submit-request' : 'next'}
          size="large"
          type="primary"
          htmlType="submit"
          loading={store.loading}
        >
          {store.isSubmitStep ? 'SUBMIT REQUEST' : 'NEXT'}
        </Button>
      </div>
    );
  }

  @autobind
  renderForm() {
    const { store, steps } = this.props;

    const FieldsBlock = steps[store.stepNumber] && steps[store.stepNumber].component;

    return (
      <Form
        ref={this.formRef}
        store={store.data}
        onSubmit={this.onSubmit}
        className={styles.wizardForm}
        validateFieldsOnly={store.validateFieldsOnly}
        prefix={this.props.prefix}
      >
        {FieldsBlock ? <FieldsBlock allData={store.data} mode={store.mode} /> : null}
        {this.renderFooter()}
      </Form>
    );
  }

  @autobind
  onSubmit(e) {
    const { store, steps } = this.props;
    const validate =
      (steps[store.stepNumber] && steps[store.stepNumber].validate) ||
      function(allData) {
        return Promise.resolve();
      };

    validate(store.data)
      .catch(e => {
        store.error = e;
        return Promise.reject(e);
      })
      .then(() => {
        store.error = null;
        return this.form.validateFields();
      })
      .then(data => {
        if (store.isSubmitStep) {
          store.submitData();
        } else {
          store.nextStep();
        }
      })
      .catch();
  }

  render() {
    const { store, title, finishStep, steps } = this.props;

    const FinishStep = finishStep ? finishStep : EndStep;

    return (
      <div>
        {title && <h2 className={styles.wizardTitle}>{title}</h2>}
        <StepsLine items={steps.map(item => item.title)} active={store.stepNumber} />
        {store.isFinishStep && (
          <div>
            <FinishStep />
            <div className={styles.stepsButtons}>
              <Button id="finish" size="large" onClick={store.closeWizard} type="primary">
                Finish
              </Button>
            </div>
          </div>
        )}
        {!store.isFinishStep && this.renderForm()}
      </div>
    );
  }
}
