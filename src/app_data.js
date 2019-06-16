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
    /** @type{Array<Type>} */
    this.tasks = [];

    /** @type{string} */
    this.sortBy_ = SortByValues.Priority;

    /** @type{Array<Type>} */
    this.tasksDone = [];

    Storage.load(this);
  }
  // TODO
  //  - create methods to mutate the properties
  //  - when props change call `Storage.save(this)`

  // `sortBy` property getter.
  get sortBy() {
    return this.sortBy_;
  }

  // `sortBy` property setter.
  /**
   * @param {string} value Set this value and save to storage.
   */
  set sortBy(value) {
    this.sortBy_ = value;
    Storage.save(this);
  }

  /**
   * @param {string} value Expected to have a SortByValues.
   */
  saveSortBy(value) {
    this.sortBy = value;
    Storage.save(this);
  }

  /**
   * @param {string} index Value of the data-index attribute.
   */
  markTaskDone(index) {
    this.tasks[index].done = !this.tasks[index].done;
    const checkedTask = this.tasks.splice(index, 1);
    this.tasksDone.push(checkedTask[0]);
    Storage.save(this);
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
