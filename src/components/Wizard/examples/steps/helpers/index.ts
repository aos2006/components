function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const createCmpProps = (idPrefix: string, nameArr: string[]) => {
  const cmpProps = {
    id: `${idPrefix}-${nameArr.join('-')}`,
    label: nameArr.map(capitalizeFirstLetter).join(' '),
    name: nameArr.map((name, i) => (i ? capitalizeFirstLetter(name) : name)).join(''),
    placeholder: `Please enter the ${nameArr.join(' ')}`,
    rules: [
      {
        required: true,
        message: `Please fill ${nameArr.join(' ')} in this field!`,
        whitespace: true,
      },
    ],
  };

  return cmpProps;
};
