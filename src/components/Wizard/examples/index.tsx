import React from 'react';
import StepsLine from '../components/StepsLine';
import { IWizardStep } from '../Wizard';
import StepFour from './steps/StepFour';
import StepOne from './steps/StepOne';
import StepTwo from './steps/StepTwo';

export const stepsView: IWizardStep[] = [
  {
    title: 'TokenInfo',
    component: StepOne,
  },
  {
    title: 'Project Details',
    component: StepTwo,
  },
  {
    title: 'Legal',
    component: StepFour,
  },
];

export interface IExampleProps {
  tokenization: any;
}

export default class Example extends React.Component<IExampleProps> {
  render() {
    return <StepsLine items={['View', 'Cho', 'ocho', 'bocho']} active={1} />;
  }
}
