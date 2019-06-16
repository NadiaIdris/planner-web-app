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
  //  - create methods to mutate the underlying data
  //  - save underlying data when changed using `Storage.save(this)`
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
