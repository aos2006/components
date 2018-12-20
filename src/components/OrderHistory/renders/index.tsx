import React from 'react';
import moment from 'moment';

function renderFullTime(text) {
  return <span>{moment(text * 1000).format('DD.MM HH:mm:ss')}</span>;
}

export { renderFullTime };
