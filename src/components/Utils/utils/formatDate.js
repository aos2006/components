import moment from 'moment';

export default function formatDate(date) {
  const diff = Number(moment()) - Number(moment(date)); // разница в миллисекундах

  if (diff < 1000) {
    // прошло менее 1 секунды
    return 'только что';
  }

  const sec = Math.floor(diff / 1000); // округлить diff до секунд

  if (sec < 60) {
    return `${sec} сек. назад`;
  }

  let min = Math.floor(diff / 60000); // округлить diff до минут

  if (min < 60) {
    return `${min} мин. назад`;
  }

  min = Math.floor(diff / 60000); // округлить diff до часов
  if (min < 24) {
    return `${min} час. назад`;
  }

  return moment(date).format('DD.MM.YYYY HH:mm:ss');
}
