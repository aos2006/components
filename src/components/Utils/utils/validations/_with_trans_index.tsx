import React from 'react';
import _ from 'lodash';

import {
  createValidate,
  isEmptyArray,
  isEmptyString,
  isLatokenAddress,
  isPhoneNumber,
  isValidBTCAddress,
  isValidEthereumAddress,
  isValidNEOAddress,
  isValidNIMIQAddress,
} from './pureFunctions';
import { I18n } from 'react-i18next';

export const isRequired = {
  ...createValidate(v => {
    return v === undefined || v === null || isEmptyString(v);
  }, <I18n ns={'ComponentsLibrary'}>{t => t('Please fill in this field!')}</I18n>),
  validateType: 'requiredValidator',
};

export const isNotEmptyArray = {
  ...createValidate(
    isEmptyArray,
    <I18n ns={'ComponentsLibrary'}>{t => t('Please fill this field!')}</I18n>
  ),
  validateType: 'requiredValidator',
};

export const isNotEmptyImageList = {
  ...createValidate(
    isEmptyArray,
    <I18n ns={'ComponentsLibrary'}>{t => t('Please add image here!')}</I18n>
  ),
  validateType: 'requiredValidator',
};

export const isNotEmptyDocumentList = {
  ...createValidate(
    isEmptyArray,
    <I18n ns={'ComponentsLibrary'}>{t => t('Please add document here!')}</I18n>
  ),
  validateType: 'requiredValidator',
};

export const isConfirm = {
  ...createValidate(
    value => value !== true,
    <I18n ns={'ComponentsLibrary'}>
      {t => t('You must confirm this block before next actions')}
    </I18n>
  ),
  validateType: 'requiredValidator',
};

export const isBoolean = {
  ...createValidate(
    value => typeof value !== 'boolean',
    <I18n ns={'ComponentsLibrary'}>{t => t('You must fill this field!')}</I18n>
  ),
  validateType: 'requiredValidator',
};

export const isName = {
  pattern: /^[\s\dA-Za-z'.-]+$/gi,
  message: (
    <I18n ns={'ComponentsLibrary'}>{t => t("Please use latin characters and symbols '.-")}</I18n>
  ),
};

export const isAddress = {
  pattern: /^[\s\dA-Za-z,.\-"']+$/gi,
  message: (
    <I18n ns={'ComponentsLibrary'}>{t => t('Please use latin characters and symbols ,.-"\'')}</I18n>
  ),
};

export const notEnoughCharacters = {
  min: 2,
  message: <I18n ns={'ComponentsLibrary'}>{t => t('Not enough characters')}</I18n>,
};

export const maxCharacters = {
  max: 255,
  message: (
    <I18n ns={'ComponentsLibrary'}>{t => t('Maximum string length is 255 characters')}</I18n>
  ),
};

export const isNumber = {
  pattern: /^[\d]+$/gi,
  message: (
    <I18n ns={'ComponentsLibrary'}>{t => t('Numbers only, no dash or any other separator.')}</I18n>
  ),
  whitespace: true,
};

export const isFloatingNumber = {
  pattern: /^[+-]?([0-9]*[.])?[0-9]+$/gi,
  message: (
    <I18n ns={'ComponentsLibrary'}>{t => t('Numbers only, no dash or any other separator.')}</I18n>
  ),
  whitespace: true,
};

export const isWebsite = {
  pattern: /^((https?|s?ftp):\/\/)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
  message: <I18n ns={'ComponentsLibrary'}>{t => t('Website url not correct')}</I18n>,
};

export const isEmail = {
  pattern: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
  message: <I18n ns={'ComponentsLibrary'}>{t => t('E-mail not correct')}</I18n>,
};

export const isPositive = createValidate(
  v => _.isNumber(v) && v <= 0,
  <I18n ns={'ComponentsLibrary'}>{t => t('Positive number only!')}</I18n>
);

export const isNotLatokenAddress = createValidate(
  isLatokenAddress,
  <I18n ns={'ComponentsLibrary'}>{t => t("You can't use Latoken Ethereum address!")}</I18n>
);

// * Kits - grouping rules * //

export const phoneNumberRules = [
  isRequired,
  { min: 2 },
  createValidate(
    v => v && !isPhoneNumber(v.replace(/\D/g, '')),
    <I18n ns={'ComponentsLibrary'}>{t => t('Please enter valid phone number!')}</I18n>
  ),
];

export const ethereumAddress = [
  isRequired,
  createValidate(
    v => !isValidEthereumAddress(v, false),
    <I18n ns={'ComponentsLibrary'}>{t => t('Please enter valid address!')}</I18n>
  ),
];

export const btcAddress = [
  isRequired,
  createValidate(
    v => !isValidBTCAddress(v, false),
    <I18n ns={'ComponentsLibrary'}>{t => t('Please enter valid address!')}</I18n>
  ),
];

export const nimiqAddress = [
  isRequired,
  createValidate(
    v => !isValidNIMIQAddress(v, false),
    <I18n ns={'ComponentsLibrary'}>{t => t('Please enter valid address!')}</I18n>
  ),
];

export const neoAddress = [
  isRequired,
  createValidate(
    v => !isValidNEOAddress(v, false),
    <I18n ns={'ComponentsLibrary'}>{t => t('Please enter valid address!')}</I18n>
  ),
];

export const def = {
  name: [isName, notEnoughCharacters, maxCharacters],
  address: [isAddress, notEnoughCharacters],
};
