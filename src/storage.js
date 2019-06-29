// import {appData} from './app_data';

const Key = 'appData';

class Storage {
  /**
   * If data is available in local storage, then copy it into appData.
   * @param {AppData} appData
   */
  static load(appData) {
    const dataFromStorage = JSON.parse(localStorage.getItem(Key));
    if (!dataFromStorage) return;
    appData.tasks = dataFromStorage.tasks;
    appData.sortBy = dataFromStorage.sortBy;
    appData.tasksDone = dataFromStorage.tasksDone;
  }

  /**
   * @param {AppData} appData
   */
  static save(appData) {
    localStorage.setItem(Key, JSON.stringify(appData));
  }
}

export {Storage};
