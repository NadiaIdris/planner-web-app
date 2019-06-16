import {appData} from "./app_data";

class Storage {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    this.sortBy = JSON.parse(localStorage.getItem('sortBy')) || [];
    this.tasksDone = JSON.parse(localStorage.getItem('tasksDone')) || [];
  }

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

const storage = new Storage();

export {storage};
