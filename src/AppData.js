const SortByValues = {
  Priority,
  Deadline,
};

class AppData {
  constructor() {
    this.tasks = [];
    this.sortBy = SortByValues.Priority;
    this.tasksDone = [];
  }
}

class Task {

}

const appData = new AppData();

export {appData};
