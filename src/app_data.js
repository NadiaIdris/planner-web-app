const SortByValues = {
  Priority,
  Deadline,
};

class App_data {
  constructor() {
    this.tasks = [];
    this.sortBy = SortByValues.Priority;
    this.tasksDone = [];
  }
}

class Task {

}

const appData = new App_data();

export {appData};
