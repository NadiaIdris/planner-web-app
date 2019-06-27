// import autosize from 'autosize';
import {deleteElementBySelector} from './util';
// import autosize from 'autosize/src/autosize';
import {appData, SortByValues, Task} from './app_data';
import {
  markTaskDone,
  editTaskText,
  keyboardShortcutToSaveTaskText,
  changeTaskPriority,
  addDeadlineToTask,
  deleteTask,
  deleteTaskIfTaskTextRemoved,
} from './edit_task';
import {
  generateTableWithHeader,
  generateListOfTasks,
  generateListOfTasksDone,
  createEmptyStatePlanner,
  createEmptyStateDone,
  initializePlannerUI,
  initializeDoneUI,
  handleWindowResize,
  generatePageLayout,
  viewCompletedTasks,
  ifNoCompletedTasksAddEmptyStateToDone,
} from './paint_ui';

// Globals.

const formElement = document.querySelector('#form');
const tasksContainer = document.querySelector('#tasks-container');
const doneTasksContainer = document.querySelector('#done-tasks-container');
const checkboxButton = document.querySelector('#checkbox-button');

const main = () => {
  generateTodaysDateAndTime();
  createEmptyStatePlanner();
  createEmptyStateDone();
  initializePlannerUI();
  initializeDoneUI();
  handleWindowResize();

  window.addEventListener('load', generatePageLayout);
  formElement.addEventListener('submit', addTask);
  checkboxButton.addEventListener('click', viewCompletedTasks);

  tasksContainer.addEventListener('click', markTaskDone);
  tasksContainer.addEventListener('keyup', editTaskText);
  tasksContainer.addEventListener('keydown', keyboardShortcutToSaveTaskText);
  tasksContainer.addEventListener('change', changeTaskPriority);
  tasksContainer.addEventListener('change', addDeadlineToTask);
  tasksContainer.addEventListener('click', deleteTask);
  tasksContainer.addEventListener('focusout', deleteTaskIfTaskTextRemoved);

  doneTasksContainer.addEventListener('click', markTaskUndone);
  doneTasksContainer.addEventListener('keyup', editTextInDoneTask);
  doneTasksContainer.addEventListener('focusout',
      deleteDoneTaskIfTaskTextRemoved
  );

  window.addEventListener('load', sortTasksOnPageLoad);
  tasksContainer.addEventListener('click', sortTasksOnClick);
};

// Sorting tasks.

/**
 * Function to sort the tasks by priority or deadline.
 */
const sortTasks = () => {
  const deadlineArrowIcon = document.querySelector('#deadline i');
  const sortedByDeadline = deadlineArrowIcon.classList.contains('visible');
  sortedByDeadline ?
      sortTasksBy(SortByValues.Deadline) : sortTasksBy(SortByValues.Priority);
};

/**
 * @param {string} value Can be Deadline or Priority.
 */
const sortTasksBy = (value) => {
  const sortByDeadline = () => {
    // Separating tasks without deadline
    const noDeadlineTasks = [];
    const deadlineTasks = [];
    appData.tasks.forEach((task) => {
      if (!task.deadline || task.deadline === '') {
        noDeadlineTasks.push(task);
      } else {
        deadlineTasks.push(task);
      }
    });

    // Sorting array by deadline.
    deadlineTasks.sort((a, b) => {
      if (a.deadline < b.deadline) return -1;
      if (a.deadline > b.deadline) return 1;
      return 0;
    });

    appData.tasks = [...deadlineTasks, ...noDeadlineTasks];

    appData.saveSortBy(value);
    generateTableWithHeader();
    generateListOfTasks(appData.tasks);
  };

  const sortByPriority = () => {
    // Sort the array by priority.
    appData.tasks.sort((a, b) => {
      if (a.priority < b.priority) return -1;
      if (a.priority > b.priority) return 1;
      return 0;
    });

    appData.saveSortBy(value);
    generateTableWithHeader();
    generateListOfTasks(appData.tasks);
  };

  value === SortByValues.Deadline ? sortByDeadline() : sortByPriority();
};

const sortTasksOnPageLoad = () => {
  if (appData.tasks.length === 0) return;
  sortTasks();
};

const sortTasksOnClick = (event) => {
  const element = event.target;
  let elementValue;

  if (!element.matches('#priority') &&
      !element.matches('#deadline') &&
      !element.matches('i.arrow-down')) return;

  const priorityArrowIcon = document.querySelector('#priority i');
  const deadlineArrowIcon = document.querySelector('#deadline i');

  if (element.textContent.includes('Priority') ||
      element.matches('#priority i.arrow-down')) {
    elementValue = 'Priority';

    // Add arrow to priority.
    priorityArrowIcon.classList.add('visible');
    priorityArrowIcon.classList.remove('hidden');
    // If arrow exists in deadline, remove arrow.
    deadlineArrowIcon.classList.remove('visible');
    deadlineArrowIcon.classList.add('hidden');
  } else if (element.textContent.includes('Deadline') ||
      element.matches('#deadline i.arrow-down')) {
    elementValue = 'Deadline';
    // Add arrow to deadline.
    deadlineArrowIcon.classList.add('visible');
    deadlineArrowIcon.classList.remove('hidden');
    // If arrow exists in priority, remove arrow.
    priorityArrowIcon.classList.remove('visible');
    priorityArrowIcon.classList.add('hidden');
  }
  sortTasksBy(elementValue);
};

// Add task.

/**
 * Create a task table given an event. The event is generated on form submit.
 * @param {Event} event
 */
const addTask = (event) => {
  event.preventDefault();
  // If no tasks present, set the default sorting to priority.
  const tasksTable = document.querySelector('#tasks-table');
  if (!tasksTable) {
    appData.saveSortBy(SortByValues.Priority);
    generateTableWithHeader();
    // Add arrow to priority and remove arrow from deadline.
    const priorityArrowIcon = document.querySelector('#priority i');
    const deadlineArrowIcon = document.querySelector('#deadline i');
    priorityArrowIcon.classList.add('visible');
    priorityArrowIcon.classList.remove('hidden');
    deadlineArrowIcon.classList.remove('visible');
    deadlineArrowIcon.classList.add('hidden');
  }

  const text = document.querySelector('#add-task').value;
  // If text field is empty, stop executing the rest of the function.
  if (checkIfTaskIsEmpty(text)) return;

  const task = new Task(text, false, 'P2');
  appData.addTask(task);
  formElement.reset();
  generateListOfTasks(appData.tasks);
  highlightTask(task);
};

const highlightTask = (task) => {
  const index = appData.getTaskIndex(task);

  // Paint the backgrounds of the elements inside the taskContainer same
  // color as taskContainer.
  const gray = '#dddddd';
  const white = 'RGB(255, 255, 255)';
  const timeItTakesToAddHighlight = '.3s';
  const timeItTakesToRemoveHighlight = '1.5s';

  const textBox =
      document.querySelector(`.text-cell[data-index="${index}"]`);
  textBox.style.backgroundColor = gray;
  textBox.style.transition =
      `background-color ${timeItTakesToAddHighlight}`;
  const prioritySelector =
      document.querySelector(`.priority[data-index="${index}"]`);
  prioritySelector.style.backgroundColor = gray;
  prioritySelector.style.transition =
      `background-color ${timeItTakesToAddHighlight}`;
  const deadlineSelector =
      document.querySelector(`.deadline[data-index="${index}"]`);
  deadlineSelector.style.backgroundColor = gray;
  deadlineSelector.style.transition =
      `background-color ${timeItTakesToAddHighlight}`;
  // Select task to paint background image
  const taskContainer =
      document.querySelector(`.task[data-index="${index}"]`);
  taskContainer.style.backgroundColor = gray;
  taskContainer.style.transition =
      `background-color ${timeItTakesToAddHighlight}`;

  // Remove the highlight.
  setTimeout(() => {
    textBox.style.backgroundColor = white;
    textBox.style.transition =
        `background-color ${timeItTakesToRemoveHighlight}`;
    prioritySelector.style.backgroundColor = white;
    prioritySelector.style.transition =
        `background-color ${timeItTakesToRemoveHighlight}`;
    deadlineSelector.style.backgroundColor = white;
    deadlineSelector.style.transition =
        `background-color ${timeItTakesToRemoveHighlight}`;
    taskContainer.style.backgroundColor = white;
    taskContainer.style.transition =
        `background-color ${timeItTakesToRemoveHighlight}`;
  }, 300);
};

const highlightTaskDone = () => {
  const index = appData
      .tasksDone.indexOf(appData.tasksDone[appData.tasksDone.length - 1]);

  // Highlight the task done.
  const gray = 'RGB(151, 191, 56)';
  const white = 'RGB(185, 216, 112)';
  const timeItTakesToAddHighlight = '.3s';
  const timeItTakesToRemoveHighlight = '1.5s';

  const textBox =
      document.querySelector(`.done-text-cell[data-index="${index}"]`);
  console.log(textBox);
  textBox.style.backgroundColor = gray;
  textBox.style.transition =
      `background-color ${timeItTakesToAddHighlight}`;
  const taskContainer =
      document.querySelector(`.task-done[data-index="${index}"]`);
  taskContainer.style.backgroundColor = gray;
  taskContainer.style.transition =
      `background-color ${timeItTakesToAddHighlight}`;

  // Remove the highlight.
  setTimeout(() => {
    textBox.style.backgroundColor = white;
    textBox.style.transition =
        `background-color ${timeItTakesToRemoveHighlight}`;
    taskContainer.style.backgroundColor = white;
    taskContainer.style.transition =
        `background-color ${timeItTakesToRemoveHighlight}`;
  }, 300);
};

/**
 * Check if task entered is empty.
 * @param {string} taskText
 * @return {boolean} true
 */
const checkIfTaskIsEmpty = (taskText) => {
  if (taskText.trim() === '') {
    alert('Task is empty');
    formElement.reset();
    return true;
  }
};

// Edit task done.

const generateTasksHeader = () => {
  let deadlineArrowIcon = document.querySelector('#deadline i');
  // If tasks header doesn't exist, generate it.
  if (deadlineArrowIcon === null) {
    appData.saveSortBy(SortByValues.Priority);
    generateTableWithHeader();
    deadlineArrowIcon = document.querySelector('#deadline i');
  }
  return deadlineArrowIcon;
};

const markTaskUndone = (event) => {
  const element = event.target;
  const index = element.dataset.index;
  if (!element.matches(`img[data-index="${index}"]`)) return;
  appData.tasksDone[index].done = !appData.tasksDone[index].done;

  const deadlineArrowIcon = generateTasksHeader();
  let undoneTask;
  const sortedByDeadline = deadlineArrowIcon.classList.contains('visible');

  const handleSortedByDeadline = () => {
    const deadline = appData.tasksDone[index].deadline;
    const firstTaskWithSameDeadline =
        appData.tasks.find((task) => task.deadline === deadline);
    if (firstTaskWithSameDeadline === undefined) {
      undoneTask = appData.tasksDone.splice(index, 1);
      appData.tasks.push(undoneTask[0]);
    } else {
      const indexOfDuplicate =
          appData.tasks.indexOf(firstTaskWithSameDeadline);
      undoneTask = appData.tasksDone.splice(index, 1);
      appData.tasks.splice(indexOfDuplicate, 0, undoneTask[0]);
    }
  };

  const handleSortedByPriority = () => {
    const priority = appData.tasksDone[index].priority;
    const firstTaskWithSamePriority =
        appData.tasks.find((task) => task.priority === priority);
    if (firstTaskWithSamePriority === undefined) {
      undoneTask = appData.tasksDone.splice(index, 1);
      appData.tasks.push(undoneTask[0]);
    } else {
      const indexOfDuplicate = appData.tasks.indexOf(firstTaskWithSamePriority);
      undoneTask = appData.tasksDone.splice(index, 1);
      appData.tasks.splice(indexOfDuplicate, 0, undoneTask[0]);
    }
  };

  sortedByDeadline ? handleSortedByDeadline() : handleSortedByPriority();
  generateListOfTasksDone(appData.tasksDone);
  sortTasks();
  highlightTask(undoneTask[0]);

  if (appData.tasksDone.length === 0) {
    deleteElementBySelector('#tasks-done');
    createEmptyStateDone();
  }
  appData.save();
};

const editTextInDoneTask = (event) => {
  const element = event.target;
  const text = element.value;
  const index = element.dataset.index;
  if (!element.matches('.done-text-cell')) return;

  appData.tasksDone[index].text = text;
  appData.save();
};

const deleteDoneTaskIfTaskTextRemoved = (event) => {
  const element = event.target;
  const text = element.value;
  const index = element.dataset.index;
  if (!element.matches('.done-text-cell')) return;

  if (text.trim() === '') {
    appData.tasksDone.splice(index, 1);
    appData.save();
    generateListOfTasksDone(appData.tasksDone);
    ifNoCompletedTasksAddEmptyStateToDone();
  }
  document.querySelector('#add-task').focus();
};

/**
 * Function to add a current date and time on the web app.
 */
const generateTodaysDateAndTime = () => {
  const displayTime = () => {
    const dateContainer = document.querySelector('#date');
    const today = new Date();

    const date = today.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });

    const time = today.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const spaces = '\u00A0\u00A0|\u00A0\u00A0';
    dateContainer.innerHTML = `Today ${spaces} ${date} ${spaces} ${time}`;
  };
  setInterval(displayTime, 1000);
  displayTime();
};

// Run on document loaded.
document.addEventListener('DOMContentLoaded', main);

export {
  tasksContainer,
  sortTasksBy,
  highlightTask,
  highlightTaskDone,
};
