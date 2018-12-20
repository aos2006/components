import { logError } from './api/errors';

function checkLocalStorage() {
  const testKey = 'test';

  try {
    const storage = window.localStorage;
    storage.setItem(testKey, '1');
    storage.getItem(testKey);
    storage.removeItem(testKey);

    return true;
  } catch (error) {
    return false;
  }
}

const LOCAL_STORAGE_ENABLE = checkLocalStorage();

export default class JSONLocalStorage {
  static get(item: string) {
    let data = null;

    if (LOCAL_STORAGE_ENABLE) {
      try {
        data = JSON.parse(window.localStorage.getItem(item));
      } catch (error) {
        logError(error);
      }
    }

    return data;
  }

  static set(item: string, value: any) {
    if (LOCAL_STORAGE_ENABLE) {
      try {
        window.localStorage.setItem(item, JSON.stringify(value));
      } catch (error) {
        logError(error);
      }
    }
  }

  static remove(key: string) {
    if (LOCAL_STORAGE_ENABLE) {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        logError(error);
      }
    }
  }
}
