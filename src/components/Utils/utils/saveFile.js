export default function saveFile(data, fileName) {
  const byteCharacters = atob(data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  // eslint-disable-next-line no-undef
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'octet/stream' });

  const a = document.createElement('a');

  document.body.appendChild(a);
  a.style = 'display: none';
  const url = window.URL.createObjectURL(blob);

  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
}
