import { keccak256 } from 'js-sha3';
import countryData from './country_data';
import { some } from 'lodash/collection';
import { startsWith } from 'lodash/string';
import { Buffer } from 'safe-buffer';
import bs58check from 'bs58check';
import spaceSeparate from '../spaceSeparate';
import hexEncoding from 'crypto-js/enc-hex';
import SHA256 from 'crypto-js/sha256';
import base58 from 'bs58';

// generate validate object wth special format

export function createValidate(func: (value: any) => boolean, error) {
  return {
    validator(rule, value, callback, source, options) {
      const errors = [];

      if (func(value)) {
        errors.push(error);
      }
      callback(errors);
    },
  };
}

export function normlizeTrim(e) {
  if (e.target && e.target.value) {
    e.target.value = e.target.value.replace(/\s/g, '').replace(/\W/g, '');
  }
  return e;
}

export function normlizeNIMIQ(e) {
  if (e.target && e.target.value) {
    const str = e.target.value.replace(/\s/g, '').replace(/\W/g, '');
    return spaceSeparate(str, ' ', 4);
  }
  return e;
}

export const isEmptyArray = value => !value || value.length === 0;

export function isChecksumAddress(address) {
  // Check each case
  const addressClear = address.replace('0x', '');
  const addressHash = keccak256(addressClear.toLowerCase());

  for (let i = 0; i < 40; i++) {
    // the nth letter should be uppercase if the nth digit of casemap is 1
    if (
      (parseInt(addressHash[i], 16) > 7 && addressClear[i].toUpperCase() !== addressClear[i]) ||
      (parseInt(addressHash[i], 16) <= 7 && addressClear[i].toLowerCase() !== addressClear[i])
    ) {
      return false;
    }
  }

  return true;
}

export function isLatokenAddress(address) {
  const ADDRESS_LATOKEN = '0xE50365f5D679CB98a1dd62D6F6e58e59321BcdDf';

  if (address === ADDRESS_LATOKEN) {
    return true;
  }

  return false;
}

export function isValidEthereumAddress(address: string, checkRequired = true): boolean {
  if (!address && !checkRequired) {
    return true;
  }
  if (/^(0x)?[0]*$/i.test(address)) {
    return false;
  }
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    // check if it has the basic requirements of an address
    return false;
  } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
    // If it's all small caps or all all caps, return true
    return true;
  }
  // Otherwise check each case

  return isChecksumAddress(address);
}

export const isPhoneNumber = inputNumber => {
  const countries = countryData.allCountries;

  return some(countries, function(country) {
    return startsWith(inputNumber, country.dialCode) || startsWith(country.dialCode, inputNumber);
  });
};

export function isEmptyString(value) {
  if (typeof value === 'string') {
    const parts = value.split(' ').length;

    if (parts === 1) {
      return !value.length;
    }

    if (value.length - parts < 0) {
      return true;
    }
  }

  return false;
}

export function isValidBTCAddress(address, checkRequired = true): boolean {
  function fromBase58Check(address) {
    const payload = bs58check.decode(address);

    // TODO: 4.0.0, move to "toOutputScript"
    if (payload.length < 21) throw new TypeError(address + ' is too short');
    if (payload.length > 21) throw new TypeError(address + ' is too long');

    const version = payload.readUInt8(0);
    const hash = payload.slice(1);

    return { version: version, hash: hash };
  }

  // function fromBech32(address) {
  //   const result = bech32.decode(address);
  //   const data = bech32.fromWords(result.words.slice(1));
  //
  //   return {
  //     version: result.words[0],
  //     prefix: result.prefix,
  //     data: Buffer.from(data),
  //   };
  // }

  if (!address && !checkRequired) {
    return true;
  }

  let result = false;

  try {
    fromBase58Check(address);
    result = true;
  } catch (e) {}
  // try {
  //   fromBech32(address);
  //   result = true;
  // } catch (e) {}
  if (result) {
    return true;
  }
  return false;
}

export function isValidNIMIQAddress(address: string, checkRequired = true): boolean {
  function _ibanCheck(str) {
    const num = str
      .split('')
      .map(c => {
        const code = c.toUpperCase().charCodeAt(0);
        return code >= 48 && code <= 57 ? c : (code - 55).toString();
      })
      .join('');
    let tmp = '';

    for (let i = 0; i < Math.ceil(num.length / 6); i++) {
      tmp = (parseInt(tmp + num.substr(i * 6, 6)) % 97).toString();
    }

    return parseInt(tmp);
  }

  if (!address && !checkRequired) {
    return true;
  }

  address = address.replace(/ /g, '');
  if (address.substr(0, 2).toUpperCase() !== 'NQ') {
    return false;
  }
  if (address.length !== 36) {
    return false;
  }
  if (_ibanCheck(address.substr(4) + address.substr(0, 4)) !== 1) {
    return false;
  }
  return true;
}

export function isValidNEOAddress(address, checkRequired = true): boolean {
  const hexRegex = /^([0-9A-Fa-f]{2})*$/;

  if (!address && !checkRequired) {
    return true;
  }

  const ab2hexstring = arr => {
    if (typeof arr !== 'object') {
      throw new Error('ab2hexstring expects an array');
    }
    let result = '';
    for (let i = 0; i < arr.length; i++) {
      let str = arr[i].toString(16);
      str = str.length === 0 ? '00' : str.length === 1 ? '0' + str : str;
      result += str;
    }
    return result;
  };

  const hash256 = hex => {
    if (typeof hex !== 'string') throw new Error('reverseHex expects a string');
    if (hex.length % 2 !== 0) throw new Error(`Incorrect Length: ${hex}`);
    let hexEncoded = hexEncoding.parse(hex);
    let ProgramSha256 = SHA256(hexEncoded);
    return SHA256(ProgramSha256).toString();
  };

  const isHex = str => {
    try {
      return hexRegex.test(str);
    } catch (err) {
      return false;
    }
  };

  const ensureHex = str => {
    if (!isHex(str)) throw new Error(`Expected a hexstring but got ${str}`);
  };

  const reverseHex = hex => {
    ensureHex(hex);
    let out = '';
    for (let i = hex.length - 2; i >= 0; i -= 2) {
      out += hex.substr(i, 2);
    }
    return out;
  };

  const ADDR_VERSION = '17';

  const getAddressFromScriptHash = scriptHash => {
    scriptHash = reverseHex(scriptHash);
    const shaChecksum = hash256(ADDR_VERSION + scriptHash).substr(0, 8);
    return base58.encode(Buffer.from(ADDR_VERSION + scriptHash + shaChecksum, 'hex'));
  };

  try {
    let programHash = ab2hexstring(base58.decode(address));
    let shaChecksum = hash256(programHash.slice(0, 42)).substr(0, 8);
    // We use the checksum to verify the address
    if (shaChecksum !== programHash.substr(42, 8)) return false;
    // As other chains use similar checksum methods, we need to attempt to transform the programHash back into the address
    const scriptHash = reverseHex(programHash.slice(2, 42));
    if (getAddressFromScriptHash(scriptHash) !== address) {
      // address is not valid Neo address, could be btc, ltc etc.
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

export function isValidAIONAddress(address: string, checkRequired = true) {
  if (!address && !checkRequired) {
    return true;
  }

  address = address.indexOf('0x') !== 0 ? `0x${address}`.toLowerCase() : address.toLowerCase();
  if (address.substring(0, 4) !== '0xa0') return false;
  else if (!/^(0x)?[0-9a-f]{64}$/i.test(address)) return false;
  else return true;
}

export function isValidBOSAddress(address: string, checkRequired = true) {
  if (!address && !checkRequired) {
    return true;
  }
  return /^G[A-Z\d]{55}$/.test(address);
}

export function isValidOMNIAddress(address: string, checkRequired = true) {
  if (!address && !checkRequired) {
    return true;
  }
  return /^[0-9]+$/.test(address);
}
