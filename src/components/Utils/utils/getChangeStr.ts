import _ from 'lodash';

export default function getChangeStr(
  current?: number,
  previous?: number,
  replaceZeroToDash?: boolean
): string {
  if (
    !_.isNumber(current) ||
    !_.isNumber(previous) ||
    previous === 0 ||
    (current - previous === 0 && replaceZeroToDash)
  ) {
    return '-';
  }
  const percent = ((current - previous) / previous * 100).toFixed(1);
  if (Number(percent) === 0) {
    if (replaceZeroToDash) {
      return '-';
    }
    return '0.0%';
  }
  return Number(percent) > 0 ? `+${percent}%` : `${percent}%`;
}
