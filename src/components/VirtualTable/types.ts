export const types = {
  small: {
    headerHeight: 22,
    rowHeight: 22,
  },
  medium: {
    headerHeight: 30,
    rowHeight: 30,
  },
};

export const getType = type => {
  const data = types[type];
  if (!data) {
    throw new Error('Uncorrect table type, check props');
  }
  return data;
};
