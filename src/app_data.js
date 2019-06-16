import {Storage} from './storage';
import {generateId} from "./util";

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
    /** @type{Array<Task>} */
    this.tasks = [];

    /** @type{string} */
    this.sortBy_ = SortByValues.Priority;

    /** @type{Array<Task>} */
    this.tasksDone = [];

    Storage.load(this);
  }

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

  /**
   * @param {Task} task
   */
  addTask(task) {
    this.tasks.push(task);
    Storage.save(this);
  }

  // TODO add editTask (make sure to save)
  // TODO add removeTask (make sure to save)

  /**
   * @param {Task} task
   * @return {number} Index of task in tasks array.
   */
  getTaskIndex(task) {
    return appData.tasks.findIndex((element) => element.id ===
        task.id);
  }
}

/** Enumeration of valid values for sortBy. */
const SortByValues = {
  Priority: 'Priority',
  Deadline: 'Deadline',
};

class Task {
  /**
   * @param {string} text
   * @param {boolean} done
   * @param {string} priority
   */
  constructor(text, done, priority) {
    /** @type{string} */
    this.text = text;
    /** @type{boolean} */
    this.done = done;
    /** @type{string} */
    this.priority = priority;
    /** @type{string} */
    this.deadline = undefined;
    /** @type{string} */
    this.id = generateId();
  }
}

const appData = new AppData();

export {appData, Task, SortByValues};
