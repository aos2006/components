import React from 'react';
import _ from 'lodash';
import { spaceSeparateThousands } from '@latoken-component/utils';
import styles from '../styles.styl';

const defaultPrecision = 2;
const tailLength = 2;

const formatValue = (value, precision) => {
  const number = _.toNumber(value);

  return spaceSeparateThousands(number.toFixed(precision || defaultPrecision), ',');
};

const MeaningfulNumber = props => {
  const { value, correlatingValue, precision } = props;
  const formattedValue = formatValue(value, precision);
  const headOfValue = formattedValue.substring(0, formattedValue.length - tailLength);

  const headOfCorrelatingValue = () => {
    if (correlatingValue) {
      const formattedCorrelatingValue = formatValue(correlatingValue, precision);

      return formattedCorrelatingValue.substring(0, formattedCorrelatingValue.length - 2);
    } else {
      return null;
    }
  };

  const everythingIsMeaningful = headOfValue !== headOfCorrelatingValue();

  const [nonMeaningfulPart, meaningfulPart] = everythingIsMeaningful
    ? [null, formattedValue]
    : [headOfValue, formattedValue.substring(formattedValue.length - tailLength)];

  return (
    <span className={styles.meaningfulNumber}>
      {nonMeaningfulPart && <span className={styles.nonMeaningful}>{nonMeaningfulPart}</span>}
      <span>{meaningfulPart}</span>
    </span>
  );
};

export default MeaningfulNumber;
