import request from 'rc-upload/lib/request';

export function resizeDataImg(dataImg, callback) {
  return new Promise(function(resolve) {
    const img = document.createElement('img');
    img.src = dataImg;
    img.onload = function() {
      // draw on canvas
      const canvas = document.createElement('canvas');
      canvas.width = 50;
      canvas.height = 50;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 50, 50);
      if (typeof callback === 'function') {
        return callback(canvas.toDataURL());
      }
    };
  });
}

export function customRequest(options) {
  if (options.file && options.file.size) {
    options.headers = options.headers || {};
    options.headers['file-size'] = options.file.size;
  }
  return request(options);
}
