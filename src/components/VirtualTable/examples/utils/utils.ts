export const listFiller = (arrOfData, arrSize = 300) => {
  const randomPosition = () => Math.floor(Math.random() * arrOfData.length) + 0;
  const arr = [];

  for (let i = 0; i < arrSize; i++) {
    arr.push(arrOfData[randomPosition()]);
  }

  return arr;
};
