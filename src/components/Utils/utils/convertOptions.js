// Набор простых функций, обеспечивающих конвертацию map'ов или массивов в массивы пригодные для поля options
// у компонента Select.

// Value - число (обязательно для map'а с ключами из primary keys!)
const func = obj => {
  const result = [];

  if (Array.isArray(obj)) {
    return func.easy(obj);
  }

  for (const name in obj) {
    if (obj.hasOwnProperty(name)) {
      result.push({
        value: parseInt(name, 10),
        label: obj[name],
      });
    }
  }

  return result;
};

// Value и Label - одинаковые
func.easy = arr => arr.map(e => ({ value: e, label: e }));
func.easyString = arr => arr.map(e => ({ value: String(e), label: `${e}` }));
func.easyInt = arr => arr.map(e => ({ value: parseInt(e, 10), label: parseInt(e, 10) }));

// Value - строка
func.stringy = obj => {
  const result = [];

  if (Array.isArray(obj)) {
    return func.easy(obj);
  }
  for (const name in obj) {
    if (obj.hasOwnProperty(name)) {
      result.push({
        value: name,
        label: obj[name],
      });
    }
  }

  return result;
};

export default func;
