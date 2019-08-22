
const key = 'appData';

class Storage {
  /**
   * If data is available in local storage, then copy it into appData.
   * @param {AppData} appData
   */
  static load(appData) {
    const dataFromStorage = JSON.parse(localStorage.getItem(key));
    if (!dataFromStorage) return;
    Object.assign(appData, dataFromStorage);
  }

  /**
   * @param {AppData} appData
   */
  static save(appData) {
    localStorage.setItem(key, JSON.stringify(appData));
  }
}

export {Storage};
