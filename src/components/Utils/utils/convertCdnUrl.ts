export interface IFile {
  name: string;
  status: string;
  uid: number;
  url: string;
}

type ISizeFile = 'medium' | 'small';

export default function convertCdnUrl(fileList: IFile[], size?: ISizeFile) {
  if (fileList) {
    fileList.forEach(file => {
      if (file.url.indexOf('/file/file/') !== -1) {
        file.url = file.url.replace('/file/file/', '/file/');
      }
      if (file.url.indexOf(process.env.CDN_URL) !== -1 && !size) {
        return;
      }
      const expExecArray = /\/file\/(medium|small)?\/?([0-9a-f]+)/gi.exec(file.url);
      if (!expExecArray) {
        return;
      }
      const sizeOrigin = expExecArray[1];
      const secret = expExecArray[2];
      if (!secret) {
        return;
      }
      const ext = file.name.split('.').pop();
      if (!ext) {
        return;
      }

      if (size || sizeOrigin) {
        file.url = `${process.env.CDN_URL}/file/${size || sizeOrigin}/${secret}.${ext}`;
        return;
      }

      file.url = `${process.env.CDN_URL}/file/${secret}.${ext}`;
    });
  }
}
