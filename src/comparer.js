import _ from 'lodash';

export default function getComparison(obj1, obj2) {
  const sortedKeys = _.sortBy(_.union(_.keys(obj1), _.keys(obj2)));
  const result = sortedKeys.map((key) => {
    if (_.isObject(obj1[key]) && _.isObject(obj2[key])) {
      return { key, type: 'nested', children: getComparison(obj1[key], obj2[key]) };
    }
    if (!_.has(obj1, key)) {
      return { key, type: 'added', value: obj2[key] };
    }
    if (!_.has(obj2, key)) {
      return { key, type: 'deleted', value: obj1[key] };
    }

    if (obj1[key] !== obj2[key]) {
      return {
        key,
        type: 'changed',
        newValue: obj1[key],
        oldValue: obj2[key],
      };
    }

    return { key, type: 'unchanged', value: obj1[key] };
  });
  return result;
}
