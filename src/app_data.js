import {Storage} from './storage';

/**
 * Model for the application. It contains the source of truth for the following:
 * - tasks.
 * - tasksDone.
 * - sortBy.
 *
 * The model uses Storage to:
 * - Save its state to persistence when any of the data changes.
 * - It also attempts to load its state from persistence when it is constructed.
 */
class AppData {
  constructor() {
    this.tasks = [];
    this.sortBy = SortByValues.Priority;
    this.tasksDone = [];
    Storage.load(this);
  }
  // TODO
  //  - create methods to mutate the properties
  //  - when props change call `Storage.save(this)`

  /**
   * @param {Object} value Expected to have selectedValue key.
   */
  saveSortBy(value) {
    this.sortBy.length = 0;
    this.sortBy.push(value);
    localStorage.setItem('sortBy', JSON.stringify(this.sortBy));
  }

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

/** Enumeration of valid values for sortBy. */
const SortByValues = {
  Priority: 'Priority',
  Deadline: 'Deadline',
};

// TODO create Task class
class Task {

}

const appData = new AppData();

export {appData, Task, SortByValues};
