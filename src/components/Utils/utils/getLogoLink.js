import { apiUrl } from './api/constants';

export default function getLogoLink(secret) {
  if (!secret) {
    return null;
  }

  return `url('${apiUrl}/file/${secret}/thumbnail/medium')`;
}
