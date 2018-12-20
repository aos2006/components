import React, { Component } from 'react';
import _ from 'lodash';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import moment from 'moment';
import cn from 'classnames';
import Icon from 'react-fontawesome';

import SVGGraph from '@latoken-component/svggraph';
import Tooltip from '@latoken-component/tooltip';
import Progress from '@latoken-component/progress';
import { spaceSeparateThousands, convertCdnUrl } from '@latoken-component/utils';
import styles from './styles.styl';

@inject('assets', 'globals')
@observer
export default class Plate extends Component {
  static getPriceChangeValue(item) {
    if (!item.lastPrice || !item.prevDayPrice || item.lastPrice === item.prevDayPrice) {
      return 0.0;
    }

    return (item.lastPrice - item.prevDayPrice) / item.prevDayPrice * 100;
  }

  render() {
    const { assets, globals, id, onPlateClick } = this.props;
    const asset = assets.assetsData.find(item => item.id === id);
    let logoUrl = `url(${asset.logoUrl})`;

    if (!asset.logoUrl && _.get(asset, `assetData.logo`)) {
      const { logo } = asset.assetData;

      if (_.isArray([].concat(logo)) && logo[0].url) {
        convertCdnUrl(asset.assetData.logo);
        logoUrl = `url(${asset.assetData.logo[0].url})`;
      }
    }

    if (!asset.logoUrl && _.get(asset, `assetData.tokenLogo`)) {
      const { tokenLogo } = asset.assetData;

      if (_.isArray([].concat(tokenLogo)) && tokenLogo[0].url) {
        convertCdnUrl(asset.assetData.tokenLogo);

        logoUrl = `url(${asset.assetData.tokenLogo[0].url})`;
      }
    }

    const assetData = asset.assetData;
    const targetCap = _.get(assetData, 'targetCap') || 0;
    let totalRaised = _.get(assetData, 'totalRaised') || 0;

    totalRaised = Number(totalRaised);
    totalRaised = isNaN(totalRaised) || !Number.isFinite(totalRaised) ? 0 : totalRaised;

    const currencyObject = globals.getCurrencyByCurrId(asset.baseCurrencyId) || {};
    const price = spaceSeparateThousands(asset.lastPrice.toFixed(asset.precisionPrice), ',');

    const bottomText = _.get(assetData, 'industry');
    const saleType = _.get(assetData, 'icoStage');
    const icoCurrency = _.get(assetData, 'projectCurrency') || 'ETH';
    const assetClass = _.get(assetData, 'assetClass') || '';

    const isFav = assets.favAssetsIds.indexOf(asset.id) !== -1;
    const frontType = asset.frontType;
    const chartsData = toJS(asset.charts);
    const currency = currencyObject.shortName || 'Unknown';
    const discount = asset.discount;
    const fullName = asset.fullName;
    const icoEnd = _.get(assetData, 'icoEnd');
    const isHighlighted = Boolean(asset.isHighlighted);
    const assetId = asset.id;
    const onFavClick = assets.toggleFavAsset;
    const priceChangePercent = Plate.getPriceChangeValue(asset);
    const shortName = asset.shortName;
    const dashedName = asset.dashedName;
    const valuationUSD = asset.valuationUSD;
    const settlementTimestamp = asset.settlementTimestamp;
    const isTradable = asset.frontType === 'ICO' ? Boolean(asset.isTradable) : true;

    let icoEndMoment = null;
    let icoEndElapsed = null;
    const saleDatePassed = 'TOKEN SELL ENDED';

    if (_.isNumber(icoEnd)) {
      icoEndMoment = moment.unix(icoEnd).startOf('day');
      const days = icoEndMoment.diff(moment().startOf('day'), 'd') + 1; // 88

      if (days <= 0) {
        icoEndElapsed = saleDatePassed;
      } else {
        icoEndElapsed = moment
          .localeData()
          .relativeTime(days, false, days === 1 ? 'd' : 'dd', true);
      }
    }

    let percent = null;

    if (_.isNumber(targetCap) && _.isNumber(totalRaised)) {
      percent = Math.round(totalRaised / targetCap * 100);
      percent = percent || 0.1; // Show 0.1 percent instead of zero
    }

    const saleTextPostfix = saleType === 'pre' ? 'UNTIL PUBLIC SALE' : 'OF TOKEN SALE LEFT';
    const saleEndDatePrefix = saleType === 'pre' ? 'ICO start date' : 'End date';

    const indText = _.isString(assetClass)
      ? assetClass
      : _.isString(bottomText)
        ? bottomText
        : null;

    const assetFullname = fullName.split('/')[0].trim();

    const overflowElement = !isInsideStatic ? null : (
      <div className={styles.overflow}>
        <div className={styles.overflowButton}>
          {frontType === 'Assets' ? `Apply for verification` : `Trade ${assetFullname}`}
        </div>
      </div>
    );

    const lastPriceClassName = cn({
      [styles.price]: true,
      [styles.red]: asset.lastPrice < asset.prevLastPrice,
      [styles.green]: asset.lastPrice > asset.prevLastPrice,
    });

    return frontType === 'ICO' ? (
      // ICO CARD
      <div
        className={cn(styles.container, isHighlighted && styles.isHighlighted)}
        onClick={() => onPlateClick(assetId, dashedName)}
        id={`ICO_${id}_${shortName}`}
      >
        <div className={styles.topline}>
          <div className={styles.logo} style={{ backgroundImage: logoUrl }} />
          {/* nonExistingClass hack prevents fonts change */}
          <Tooltip title={`${fullName} - ${shortName}`} openClassName="nonExistingClass">
            <div className={styles.title}>
              {fullName}
              <div className={styles.subtitle}>{shortName}</div>
            </div>
          </Tooltip>
          <Icon
            className={cn(styles.star, isFav && styles.isFav)}
            name="star"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onFavClick(assetId);
            }}
          />
        </div>
        <div className={lastPriceClassName}>
          {isTradable && (
            <div>
              {price}&nbsp;{currency}
              {_.isNumber(discount) &&
                discount > 0 && (
                  <div className={styles.discount}>
                    Discount&nbsp;<span>{Number(discount.toFixed(2))}%</span>
                  </div>
                )}
            </div>
          )}
        </div>
        {_.isString(icoEndElapsed) && (
          <Tooltip
            title={`${saleEndDatePrefix}: ${icoEndMoment.format('L')}`}
            openClassName="nonExistingClass"
          >
            <div className={styles.untilEnd}>
              <Icon className={styles.clock} name="clock-o" />
              {icoEndElapsed === saleDatePassed ? (
                <span>{icoEndElapsed.toUpperCase()}</span>
              ) : (
                <span>
                  {icoEndElapsed.toUpperCase()} {saleTextPostfix}
                </span>
              )}
            </div>
          </Tooltip>
        )}
        {_.isNumber(percent) &&
          percent > 0 && (
            <div className={styles.raised}>
              <div className={styles.title}>Raised:</div>
              <Progress
                className={styles.progress}
                strokeWidth={5}
                percent={percent}
                status="success"
                showInfo={false}
              />
              <div className={styles.subtitle}>
                {spaceSeparateThousands(String(totalRaised))} {icoCurrency} /{' '}
                {spaceSeparateThousands(String(targetCap))} {icoCurrency}
              </div>
            </div>
          )}
        {indText && <div className={styles.bottomText}>{indText}</div>}
        {overflowElement}
      </div>
    ) : (
      // CRYPTO CARD
      <div
        className={cn(styles.container, isHighlighted && styles.isHighlighted)}
        onClick={() => onPlateClick(assetId, dashedName)}
        id={`CRYPTO_${id}_${shortName}`}
      >
        <div className={styles.topline}>
          <div className={styles.logo} style={{ backgroundImage: logoUrl }} />
          {/* nonExistingClass hack prevents fonts change */}
          <Tooltip title={`${fullName} - ${shortName}`} openClassName="nonExistingClass">
            <div className={styles.title}>
              {fullName}
              <div className={styles.subtitle}>{shortName}</div>
            </div>
          </Tooltip>
          <Icon
            className={cn(styles.star, isFav && styles.isFav)}
            name="star"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onFavClick(assetId);
            }}
          />
          {frontType !== 'UnsupportType' && (
            <div
              className={cn(
                styles.change,
                priceChangePercent === 0 && styles.nil,
                priceChangePercent > 0 && styles.up
              )}
            >
              {priceChangePercent > 0 && '+'}
              {priceChangePercent.toFixed(2)}%
            </div>
          )}
        </div>
        <div className={lastPriceClassName}>
          <span>{frontType === 'UnsupportType' ? '' : `${price} ${currency}`}</span>
          {_.isNumber(valuationUSD) && (
            <span className={styles.valuation}>${valuationUSD.toFixed(2)}</span>
          )}
        </div>
        <SVGGraph data={chartsData} height={66} lineOfssetBottom={10} strokeWidth={2} />
        {indText && <div className={styles.bottomText}>{indText}</div>}
        {frontType === 'Assets' &&
          _.isNumber(settlementTimestamp) && (
            <div className={styles.settlementTimestamp}>
              EXP. Date: {moment.unix(settlementTimestamp).format('DD.MM.YY')}
            </div>
          )}
        {overflowElement}
      </div>
    );
  }
}
