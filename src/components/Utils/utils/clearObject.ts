import _ from 'lodash';

export default function clearObject(obj: object | Array<any>, deletableFields?: string[]) {
  const clearedData = {};

  for (const key in obj) {
    const property = obj[key];

    if (!obj.hasOwnProperty(key)) continue;

    const propertyType = Array.isArray(property) ? 'array' : typeof property;

    if (deletableFields && deletableFields.indexOf(key) > -1 && _.isEmpty(property)) {
      clearedData[key] = null;
      continue;
    }

    switch (propertyType) {
      case 'number':
        if (!_.isNull(property)) clearedData[key] = property;
        break;

      case 'boolean':
        if (!_.isNull(property)) clearedData[key] = property;
        break;

      case 'object':
        if (!_.isEmpty(property)) {
          clearedData[key] = clearObject(property);
        }
        break;

      case 'array':
        if (!_.isEmpty(property)) {
          clearedData[key] = property.map(p => (_.isPlainObject(p) ? clearObject(p) : p));
        }
        break;

      default:
        if (!_.isEmpty(property)) clearedData[key] = property;
    }
  }

  return clearedData;
}
