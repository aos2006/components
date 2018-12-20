import _ from 'lodash';

let requests = {};

export function sendMetrics(url, errorCallback) {
  if (_.size(requests) > 0) {
    const i = new Image();
    const time = Date.now();

    i.onerror = errorCallback;
    i.src = `${url}?${JSON.stringify({ time, data: requests })}`;

    requests = {};
  }
}

export function pushQueryToRequests(requestName, requestTimeStart) {
  if (!requests[requestName]) {
    requests[requestName] = [];
  }

  requests[requestName].push(new Date().getTime() - requestTimeStart);
}
