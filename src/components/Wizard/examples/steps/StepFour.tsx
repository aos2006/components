import React from 'react';
import { Col } from 'antd';
import { Checkbox } from '@latoken-component/field/Field';
import { rules } from '@latoken-component/utils';
import styles from './styles.styl';
import { IWizardFieldsBlockProps } from '../../Wizard';

const confirmationBlockProps = { className: styles.confirmationRow };

const confirmationCheckboxProps = {
  className: styles.confirmationCheckbox,
  rules: [rules.isConfirm],
};

export default class StepFour extends React.PureComponent<IWizardFieldsBlockProps> {
  render() {
    const idGenerate = fieldName => `tokenization-wizrad-${fieldName}`;

    return (
      <div>
        <h3 className={styles.stepTitle}>Legal</h3>
        <Col>
          <div {...confirmationBlockProps}>
            <Checkbox
              id={idGenerate('confirmation_1')}
              name="confirmation_1"
              {...confirmationCheckboxProps}
            >
              I confirm that my project’s token is a utility token
            </Checkbox>
          </div>
          <div {...confirmationBlockProps}>
            <Checkbox
              id={idGenerate('confirmation_2')}
              name="confirmation_2"
              {...confirmationCheckboxProps}
            >
              I confirm that my project does not breach the laws of any jurisdiction, in which my
              project is operating
            </Checkbox>
          </div>
          <div {...confirmationBlockProps}>
            <Checkbox
              id={idGenerate('confirmation_3')}
              name="confirmation_3"
              {...confirmationCheckboxProps}
            >
              I confirm that my project’s team members have not been convicted of any financial or
              other crimes
            </Checkbox>
          </div>
          <div {...confirmationBlockProps}>
            <Checkbox
              id={idGenerate('confirmation_4')}
              name="confirmation_4"
              {...confirmationCheckboxProps}
            >
              I acknowledge and represent that all information I have provided to LATOKEN is true,
              complete and up-to-date. I and/or legal entity of my project are liable for any losses
              or damages to LATOKEN or any third party, as a result of any inaccuracies, errors or
              misrepresentations on my side.
            </Checkbox>
          </div>
          <div {...confirmationBlockProps}>
            <Checkbox
              id={idGenerate('confirmation_5')}
              name="confirmation_5"
              {...confirmationCheckboxProps}
            >
              I agree that LATOKEN can disclose publicly any information I have provided to LATOKEN
            </Checkbox>
          </div>
        </Col>
        <div className={styles.infoBlock}>
          <p>
            By filling out and submitting this form, you attest that all information provided is
            true and accurate to the best of your knowledge.
          </p>
          <p>
            LATOKEN does not endorse any tokens added onto the platform. LATOKEN endeavors to list
            all tokens intended for legal use, and therefore, LATOKEN’s act of adding a token on the
            platform should not be considered as investment advice. There is no guarantee that
            LATOKEN will list your token despite you providing all the information above. The
            decision to list a token is solely determined by LATOKEN and is final. LATOKEN, under
            its sole discretion, may also choose to de-list any token at any time and for any
            reason.
          </p>
        </div>
      </div>
    );
  }
}
