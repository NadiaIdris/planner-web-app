import {appData} from './app_data';

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
    const data = {
      tasks: appData.tasks,
      sortBy: appData.sortBy,
      tasksDone: appData.tasksDone,
    };
    localStorage.setItem(Key, JSON.stringify(data));
  }

  // TODO migrate this function to AppData
  saveSortBy(value) {
    this.sortBy.length = 0;
    this.sortBy.push(value);
    localStorage.setItem('sortBy', JSON.stringify(this.sortBy));
  }
  
  // TODO migrate this function to AppData
  markTaskDone(index) {
    this.tasks[index].done = !this.tasks[index].done;

    // Move the element at index from tasks array -> tasksDone array.
    const checkedTask = this.tasks.splice(index, 1);
    this.tasksDone.push(checkedTask[0]);

    // Save the tasksDone and tasks arrays to local storage.
    localStorage.setItem('tasksDone', JSON.stringify(this.tasksDone));
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}

export {Storage};
