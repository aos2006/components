/* eslint-disable no-undef */
export const apiUrl =
  ((window || {}).config || {}).api ||
  API_URL ||
  (() => {
    const { protocol, hostname, port } = document.location;

    if (isInsideWallet) {
      let apiHostname = hostname.replace('wallet.', 'api.');
      let portPrepared = port ? `:${port}` : '';

      if (apiHostname === 'api.latoken.com') {
        apiHostname = 'wallet.latoken.com/api';
        portPrepared = '';
      }

      return `${protocol}//${apiHostname}${portPrepared}`;
    }

    const hostnameWithoutPort = hostname.split(':')[0];
    let portSuffix = '';

    let environment = 'production';

    if (hostnameWithoutPort.substring(0, 4) === 'dev-') {
      environment = 'development';
    } else if (
      hostnameWithoutPort.substring(hostnameWithoutPort.length - 3, hostnameWithoutPort.length) ===
      '.lc'
    ) {
      environment = 'local';
    }

    if (Number(port) === 8070) {
      portSuffix = `:8070`;
    } else if (Number(port) === 6700) {
      portSuffix = `:6770`;
    } else if (environment === 'local') {
      portSuffix = ':27384';
    }

    if (environment === 'production') {
      return `${protocol}//api.latoken.com${portSuffix}`;
    } else if (environment === 'development') {
      return `${protocol}//dev-api.latoken.com${portSuffix}`;
    } else if (environment === 'local') {
      return `${protocol}//api.latoken.lc${portSuffix}`;
    }
  })();
