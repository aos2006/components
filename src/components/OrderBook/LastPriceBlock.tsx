import Icon from '@latoken-component/icon';
import { spaceSeparateThousands } from '@latoken-component/utils';
import cn from 'classnames';
import _ from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import { InjectedI18nAndTranslateProps, translate } from 'react-i18next';
import styles from './LastPriceBlock.styl';
import { ICurrency, ICurrentAsset } from './OrderBook';

function percentageChangeClasses(percentageChange) {
  if (percentageChange === '-') {
    return styles.percentageChange;
  }
  if (_.startsWith(percentageChange, '+')) {
    return `${styles.percentageChange} ${styles.up}`;
  }
  if (_.startsWith(percentageChange, '-')) {
    return `${styles.percentageChange} ${styles.down}`;
  }

  return styles.percentageChange;
}

interface ILastPriceBlock {
  precision: number;
  baseCurrency: ICurrency;
  currentAsset: ICurrentAsset;
  priceDynamics?: {
    isUp: boolean;
    isDown: boolean;
  };
}

@translate('Market')
@observer
export default class LastPriceBlock extends React.Component<
  ILastPriceBlock & InjectedI18nAndTranslateProps
> {
  render() {
    const { precision, baseCurrency, currentAsset, priceDynamics, t } = this.props;

    const { isUp, isDown } = priceDynamics;

    const { change24h } = currentAsset;
    const lastPrice = currentAsset.lastPrice || 0;
    const lastPriceInUsd = _.isNil(baseCurrency.rate) ? 0 : baseCurrency.rate * lastPrice;

    const priceValueClasses = cn({
      [styles.priceValue]: true,
      [styles.up]: isUp,
      [styles.down]: isDown,
    });

    return (
      <div className={styles.lastPriceContainer}>
        <span className={styles.lastPriceValue}>
          <span className={priceValueClasses}>
            {spaceSeparateThousands(lastPrice.toFixed(precision), ',')} {baseCurrency.shortName}
          </span>
          <span className={styles.icon}>
            {isUp ? <Icon glyph={'long-arrow-up'} /> : null}
            {isDown ? <Icon glyph={'long-arrow-down'} /> : null}
            {isDown || isUp ? ' ' : null}
          </span>
        </span>

        {!_.isNil(baseCurrency.rate) ? (
          <span className={styles.lastPriceValueInUsd}>
            ${spaceSeparateThousands(lastPriceInUsd.toFixed(2), ',')}
          </span>
        ) : null}

        <span className={styles.percentageChangeContainer}>
          <span className={styles.percentageChangeLabel}>{t('Change 24H')}</span>
          <span className={`${styles.percentageChange} ${styles.up}`}>
            <span className={percentageChangeClasses(change24h)}>{change24h || '-'}</span>
          </span>
        </span>
      </div>
    );
  }
}
