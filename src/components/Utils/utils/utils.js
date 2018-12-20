import moment from 'moment';
import { keccak256 } from 'js-sha3';

export const strRepeat = (str, times) => {
  if (str.repeat) {
    return str.repeat(times);
  }
  const buf = [];

  for (let i = 0; i < times; i++) {
    buf.push(str);
  }

  return buf.join('');
};

export const toFixedUp = (number, digits) => {
  const nString = String(number);

  if (nString.indexOf('.') > -1) {
    const parts = nString.split('.');
    const fracts = parts[1].substring(0, digits);
    const ns = fracts.length === digits ? fracts : fracts + strRepeat('0', digits - fracts.length);

    return `${parts[0]}.${ns}`;
  }

  return `${nString}.${strRepeat('0', digits)}`;
};

export const isChecksumAddress = address => {
  // Check each case
  const addressStr = address.replace('0x', '');
  const addressHash = keccak256(addressStr.toLowerCase());

  for (let i = 0; i < 40; i++) {
    // the nth letter should be uppercase if the nth digit of casemap is 1
    if (
      (parseInt(addressHash[i], 16) > 7 && addressStr[i].toUpperCase() !== addressStr[i]) ||
      (parseInt(addressHash[i], 16) <= 7 && addressStr[i].toLowerCase() !== addressStr[i])
    ) {
      return false;
    }
  }

  return true;
};

export const isValidEthereumAddress = address => {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    // check if it has the basic requirements of an address
    return false;
  } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
    // If it's all small caps or all all caps, return true
    return true;
  }

  // Otherwise check each case
  return isChecksumAddress(address);
};

export const toBytesHex = value => {
  let base = value.toString(16);

  while (base.length < 72) {
    base = `0${base}`;
  }

  return base;
};

export const transactionDescription = t => {
  let text = null;
  let value = null;

  if (t.direction === 'aibpInput' && t.data.type) {
    if (t.data.type === 'money') {
      value = t.data.value;
      text = `Bought ${t.data.value} AIBP for ${t.data.money} ${t.data.currency}${
        t.data.byCash ? ' by cash' : ''
      }`;
    } else if (t.data.type === 'adopters') {
      value = t.data.value;
      text = `${t.data.isFriend ? 'Friends early' : 'Early'} adopters bonus ${t.data.bonus}% - ${
        t.data.value
      } AIBP`;
    } else if (t.data.type === 'referral') {
      value = t.data.value;
      text = `Referral bonus ${t.data.bonus}% - ${t.data.value} AIBP from ${t.data.referral}`;
    }
  }

  return text
    ? text
    : t.data.description
      ? t.data.description
      : `${
          t.direction === 'aibInput' || t.direction === 'aibpInput' ? 'Investing ' : 'Transfering '
        } ${t.data.value} ${t.data.currency}${
          t.direction === 'aibOutput' || t.direction === 'aibpOutput'
            ? ` to address: ${t.data.address}`
            : ''
        }`;
};

export const unixTimestampToDate = unix => moment.unix(unix).format('YYYY-MM-DD hh:mm');

const KYCStatuses = {
  0: 'Not checked',
  1: 'Verified',
  2: 'Doubts',
  3: 'Rejected',
};

const kycPoints = ['kycTier1', 'kycTier2', 'kycTier3', 'kycTier4'];

const mapStatus = investor => point => {
  if (!investor[point]) return 'Not sent';

  return KYCStatuses[investor[`${point}Verified`] || 0];
};

export const kycStatusFromInvestor = investor => {
  const statusMapper = mapStatus(investor);

  return kycPoints.map(point => ({ status: statusMapper(point), point }));
};
