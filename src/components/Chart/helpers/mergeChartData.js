import _ from 'lodash';

// TODO: измерить влияние на производительность и улучшить алгоритм

export default function mergeChartData(initialData, newData) {
  const result = initialData.slice();
  const resultLength = result.length;

  newData.forEach(value => {
    const existingObjectIndex = _.findIndex(result, ['time', value.time]);

    if (existingObjectIndex !== -1) {
      result[existingObjectIndex] = value;
    } else {
      result.push(value);
    }
  });

  // Сортировка не нужна, мы только обновили данные
  if (result.length === resultLength) {
    return result;
  }

  return _.sortBy(result, 'time');
}
