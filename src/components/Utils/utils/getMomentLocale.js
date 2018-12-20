export default function getMomentLocale(language) {
  switch (language) {
    case 'kr':
      return 'ko';
    case 'cn':
    case 'zh-Hans':
      return 'zh-cn';
    default:
      return language;
  }
}
