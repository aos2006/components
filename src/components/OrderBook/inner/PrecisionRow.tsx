import React from 'react';
import cn from 'classnames';
import { minPrecision } from '../OrderBook';
import { InjectedI18nAndTranslateProps, translate } from 'react-i18next';
import styles from '../styles.styl';
import Button from '@latoken-component/button';

interface IPrecisionRowProps {
  precision: number;
  maxPrecision: number;
  onIncreasePrecision: React.FormEventHandler<any>;
  onDecreasePrecision: React.FormEventHandler<any>;
}

@translate('Market')
export default class PrecisionRow extends React.Component<
  IPrecisionRowProps & InjectedI18nAndTranslateProps
> {
  render() {
    const {
      precision,
      maxPrecision: _maxPrecision,
      onIncreasePrecision,
      onDecreasePrecision,
      t,
    } = this.props;

    return (
      <div className={styles.orderBookUpperPanel} id="Mobile_OrderBookBottomPanel">
        <span className={styles.orderBookHeader}>{t('Order Book')}</span>
        <div className={styles.actionsPanel}>
          <span className={styles.orderBookStatusLabel}>
            {precision} {t('decimals')}
          </span>
          <Button
            className={cn(styles.orderBookAction, precision > minPrecision && styles.active)}
            disabled={precision <= minPrecision}
            onClick={onDecreasePrecision}
            icon="minus"
          />
          <Button
            className={cn(styles.orderBookAction, precision < _maxPrecision && styles.active)}
            disabled={precision >= _maxPrecision}
            onClick={onIncreasePrecision}
            icon="plus"
          />
        </div>
      </div>
    );
  }
}
