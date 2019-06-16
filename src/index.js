// import autosize from 'autosize';
import {deleteElementBySelector, generateId} from './util';
import autosize from 'autosize/src/autosize';
import {appData, SortByValues, Task} from './app_data';

// Globals.

const formElement = document.querySelector('#form');
const tasksContainer = document.querySelector('#tasks-container');
const doneTasksContainer = document.querySelector('#done-tasks-container');

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

  tasksContainer.addEventListener('click', markTaskCompleted);
  tasksContainer.addEventListener('change', selectPriority);
  tasksContainer.addEventListener('click', deleteTask);
  tasksContainer.addEventListener('change', addDeadlineToTask);
  tasksContainer.addEventListener('keyup', editTaskText);
  tasksContainer.addEventListener('keydown', keyboardShortcutToSaveTaskText);
  tasksContainer.addEventListener('focusout', deleteTaskIfTaskTextRemoved);

  doneTasksContainer.addEventListener('click', markTaskUncompleted);
  doneTasksContainer.addEventListener('keyup', editTextInTaskCompleted);
  doneTasksContainer.addEventListener(
      'focusout',
      deleteCompletedTaskIfTaskTextRemoved
  );

  window.addEventListener('load', sortTasksOnPageLoad);
  tasksContainer.addEventListener('click', sortTasksOnClick);
};


// Function to sort an array. Takes a param which is dropdown selected value.
const sortTasksBy = (value) => {
  const selected = {
    selectedValue: 'Priority',
  };

  // Check if change value is "Deadline".
  if (value === 'Deadline') {
    selected.selectedValue = value;
    // Separating tasks without deadline
    const noDeadlineTasks = [];
    const deadlineTasks = [];
    appData.tasks.forEach((task) => {
      if (task.deadline === '' || 'deadline' in task === false) {
        noDeadlineTasks.push(task);
      } else {
        deadlineTasks.push(task);
      }
    });

    // Sorting array by deadline.
    deadlineTasks.sort((a, b) => {
      if (a.deadline < b.deadline) {
        return -1;
      }
      if (a.deadline > b.deadline) {
        return 1;
      }
      return 0;
    });

    appData.tasks = [...deadlineTasks, ...noDeadlineTasks];

    appData.saveSortBy(selected.selectedValue);
    generateTableWithHeader();
    generateListOfTasks(appData.tasks);
  }

  // If change value is "Priority".
  if (value === 'Priority') {
    selected.selectedValue = value;
    // Sort the array by priority.
    appData.tasks.sort((a, b) => {
      if (a.priority < b.priority) {
        return -1;
      }
      if (a.priority > b.priority) {
        return 1;
      }
      return 0;
    });

    appData.saveSortBy(selected.selectedValue);
    generateTableWithHeader();
    generateListOfTasks(appData.tasks);
  }
};

// Function to sort tasks when page is loaded.
const sortTasksOnPageLoad = () => {
  if (appData.tasks.length === 0) {
    return;
  }
  sortTasks();
};

const sortTasksOnClick = (event) => {
  // event.preventDefault();
  const element = event.target;
  let elementValue;

  if (!element.matches('#priority') &&
      !element.matches('#deadline') &&
      !element.matches('i.arrow-down')) {
    return;
  }

  const priorityArrowIcon = document.querySelector('#priority i');
  const deadlineArrowIcon = document.querySelector('#deadline i');

  if (element.textContent.includes('Priority') || element.matches('#priority' +
                                                                      ' i.arrow-down')) {
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

// Function to move task to done section once completed
const markTaskCompleted = (event) => {
  const doneEmptyState = document.querySelector('#empty-stage-done');

  const element = event.target;
  const index = element.dataset.index;
  if (!element.matches(`img[data-index="${index}"]`)) {
    return;
  }

  // Remove empty state from done section if present
  if (doneEmptyState) {
    deleteElementBySelector('#empty-stage-done');
  }

  // Repaint the tasks done UI
  appData.markTaskDone(index);
  generateListOfTasksDone(appData.tasksDone);
  generateListOfTasks(appData.tasks);

  if (appData.tasks.length === 0) {
    deleteElementBySelector('#tasks-table');
    createEmptyStatePlanner();
  }
};

const markTaskUncompleted = (event) => {
  const element = event.target;
  const index = element.dataset.index;
  if (!element.matches(`img[data-index="${index}"]`)) {
    return;
  }
  appData.tasksDone[index].done = !appData.tasksDone[index].done;

  let deadlineArrowIcon = document.querySelector('#deadline i');
  // If table header doesn't exist, generate it.
  if (deadlineArrowIcon === null) {
    // Sort by
    appData.sortBy = SortByValues.Priority;
    generateTableWithHeader();
  }

  let uncheckedTask;
  deadlineArrowIcon = document.querySelector('#deadline i');


  // Move the task in front of others that have the same priority or deadline.
  if (deadlineArrowIcon.classList.contains('visible')) {
    // Get the task deadline value from the tasksDone in localStorage.
    const deadline = appData.tasksDone[index].deadline;
    // Check tasks array to see is there at least one task with the same
    // deadline.
    const found = appData.tasks.find((task) => task.deadline === deadline);

    if (found === undefined) {
      // Remove the element from tasksDone array.
      uncheckedTask = appData.tasksDone.splice(index, 1);
      // Add the unchecked task to tasks array.
      appData.tasks.push(uncheckedTask[0]);
      // Find the task & highlight the background
    } else {
      // If another task has the same deadline, then get its index.
      const indexOfDuplicate = appData.tasks.indexOf(found);
      // Remove the element from tasksDone array.
      uncheckedTask = appData.tasksDone.splice(index, 1);
      // Add the task in front of the first task that has same date.
      appData.tasks.splice(indexOfDuplicate, 0, uncheckedTask[0]);
    }
  } else {
    // Get the task priority value from the tasksDone in localStorage.
    const priority = appData.tasksDone[index].priority;
    // Check tasks array to see is there at least one task with the same
    // priority.
    const found = appData.tasks.find((task) => task.priority === priority);

    if (found === undefined) {
      uncheckedTask = appData.tasksDone.splice(index, 1);
      appData.tasks.push(uncheckedTask[0]);
    } else {
      const indexOfDuplicate = appData.tasks.indexOf(found);
      uncheckedTask = appData.tasksDone.splice(index, 1);
      appData.tasks.splice(indexOfDuplicate, 0, uncheckedTask[0]);
    }
  }

  // Set the tasksDone in local appData.
  localStorage.setItem('tasksDone', JSON.stringify(appData.tasksDone));
  // Repaint the tasks done UI
  generateListOfTasksDone(appData.tasksDone);

  // Sort the tasks.
  sortTasks();
  // Set the local storage with the correct tasks order.
  localStorage.setItem('tasks', JSON.stringify(appData.tasks));
  highlightTask(uncheckedTask[0]);

  if (appData.tasksDone.length === 0) {
    deleteElementBySelector('#tasks-done');
    createEmptyStateDone();
  }
};

// Function to sort the tasks list based on what sorting option is selected.
const sortTasks = () => {
  const deadlineArrowIcon = document.querySelector('#deadline i');
  if (deadlineArrowIcon.classList.contains('visible')) {
    sortTasksBy('Deadline');
  } else {
    sortTasksBy('Priority');
  }
};


/**
 * Create a task table given an event. The event is generated on form submit.
 * @param {Event} event
 */
const addTask = (event) => {
  event.preventDefault();

  // If no tasks present, set the default sorting to priority.
  const tasksTable = document.querySelector('#tasks-table');
  if (!tasksTable) {
    // Sort tasks by default by priority.
    appData.sortBy = SortByValues.Priority;
    // Add table header.
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
  if (checkIfTaskIsEmpty(text)) {
    return;
  }

  const task = new Task(text, false, 'P2', undefined);
  appData.addTask(task);
  formElement.reset();
  generateListOfTasks(appData.tasks);
  highlightTask(task);
};

const highlightTask = (task) => {
  const index = appData.getTaskIndex(task);

  const gray = '#dddddd';
  const white = 'RGB(255, 255, 255)';
  const timeItTakesToAddHighlight = '.3s';
  const timeItTakesToRemoveHighlight = '1.5s';

  // Paint the backgrounds of the elements inside the taskContainer same
  // color as taskContainer.
  const textBox = document.querySelector(`.text-cell[data-index="${index}"]`);
  textBox.style.backgroundColor = gray;
  textBox.style.transition =
      `background-color ${timeItTakesToAddHighlight}`;
  const prioritySelector = document.querySelector(`.priority[data-index="${index}"]`);
  prioritySelector.style.backgroundColor = gray;
  prioritySelector.style.transition =
      `background-color ${timeItTakesToAddHighlight}`;
  const deadlineSelector = document.querySelector(`.deadline[data-index="${index}"]`);
  deadlineSelector.style.backgroundColor = gray;
  deadlineSelector.style.transition =
      `background-color ${timeItTakesToAddHighlight}`;
  // Select task to paint background image
  const taskContainer = document.querySelector(`.task[data-index="${index}"]`);
  taskContainer.style.backgroundColor = gray;
  taskContainer.style.transition =
      `background-color ${timeItTakesToAddHighlight}`;

  // Clear all the styling
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


/**
 * Check if task entered is empty.
 * @param taskText
 * @return {boolean} true
 */
const checkIfTaskIsEmpty = (taskText) => {
  if (taskText.trim() === '') {
    alert('Task is empty');
    formElement.reset();
    return true;
  }
};

/**
 * If some tasks present, return and add a task to the existing table with
 * the next function.
 */
const generateTableWithHeader = () => {
  let tasksTable = document.querySelector('#tasks-table');
  if (!tasksTable) {
    // clear the empty state
    deleteElementBySelector('#empty-stage-planner');

    tasksTable = document.createElement('table');
    tasksTable.setAttribute('id', 'tasks-table');
    tasksContainer.appendChild(tasksTable);

    const priorityArrow =
              appData.sortBy === SortByValues.Priority ? 'visible' : 'hidden';
    const deadlineArrow =
              appData.sortBy === SortByValues.Deadline ? 'visible' : 'hidden';
    const prioritySelected =
              appData.sortBy === SortByValues.Priority ? 'selected' : '';
    const deadlineSelected =
              appData.sortBy === SortByValues.Deadline ? 'selected' : '';

    tasksTable.innerHTML = `
      <thead>
      <tr id="task-headings">
          <th></th>
          <th id="task" class="heading-cell">Task</th>
          <th id="priority" class="heading-cell">
            <i class="material-icons arrow-down ${priorityArrow}">
            arrow_drop_down</i>Priority
          </th>
          <th id="deadline" class="heading-cell">
            <i class="material-icons arrow-down ${deadlineArrow}">
            arrow_drop_down</i>Deadline
          </th>
          <th class="sorting-cell">
             <select class="sort-by">
                <option value="Priority" ${prioritySelected}>Priority</option>
                <option value="Deadline" ${deadlineSelected}>Deadline</option>
             </select>
          </th>
      </tr>
      </thead>
      `;
  }
};

/**
 * @param {Array<Object>} tasksArray this is painted to the screen.
 */
const generateListOfTasks = (tasksArray = []) => {
  const tasksTable = document.querySelector('#tasks-table');

  deleteElementBySelector('#tasks-table > tbody');

  // Make a table body container to store all tasks.
  const tableBody = document.createElement('tbody');
  tasksTable.appendChild(tableBody);

  // Map over each array element and paint them on screen.
  const renderTask = (task, index) => {
    const deadlineAttributeHTML = task.deadline ?
        `value="${task.deadline}"` :'';
    const doneIcon = task.done ?
        `../images/checkbox-checked.svg` : `../images/checkbox-unchecked.svg`;
    const p0Selected = task.priority === 'P0' ? 'selected' : '';
    const p1Selected = task.priority === 'P1' ? 'selected' : '';
    const p2Selected = task.priority === 'P2' ? 'selected' : '';

    return `
      <tr class="task" data-index="${index}">
        <td class="chkbx-cell">
          <img
            class="chkbx-img-unchecked"
            src="${doneIcon}"
            data-index="${index}">
        </td>
        <td class="textarea-cell">
          <textarea 
            rows="1" 
            class="text-cell" 
            data-index="${index}">${task.text}</textarea>
        </td>
        <td class="priority-cell">
          <select class="priority" data-index="${index}">
            <option value="P0" ${p0Selected}>P0</option>
            <option value="P1" ${p1Selected}>P1</option>
            <option value="P2" ${p2Selected}>P2</option>
          </select>
        </td>
        <td class="deadline-cell">
          <input
            type="date"
            class="deadline"
            ${deadlineAttributeHTML}
            data-index="${index}">
        </td>
        <td class="icon-cell">
          <i class="material-icons" data-index="${index}">delete</i>
        </td>
      </tr>
       `;
  };
  tableBody.innerHTML = tasksArray.map(renderTask).join('');

  autosize(tableBody.querySelectorAll('textarea'));
};


const selectPriority = (event) => {
  const element = event.target;
  const index = element.dataset.index;
  if (!element.matches('.priority')) {
    return;
  }
  appData.tasks[index].priority = element.value;
  sortTasks();
  localStorage.setItem('tasks', JSON.stringify(appData.tasks));
};


/**
 * If item(s) in tasks, then generate table with the task(s).
 */
const initializePlannerUI = () => {
  if (appData.tasks.length === 0) {
    return;
  }
  generateTableWithHeader();
  generateListOfTasks(appData.tasks);
};

/**
 * If no tasks created, then paint the empty state into on planner page.
 */
const createEmptyStatePlanner = () => {
  if (appData.tasks.length > 0) {
    return;
  }
  const tasksTable = document.querySelector('#tasks-table');
  if (!tasksTable) {
    addEmptyStateToPlanner();
    appData.sortBy = SortByValues.Priority;
  }
};


/**
 * Function to add empty state paragraph to Planner section.
 */
const addEmptyStateToPlanner = () => {
  const container = document.querySelector('#tasks-container');
  const div = document.createElement('div');
  container.appendChild(div);
  div.setAttribute('id', 'empty-stage-planner');
  div.setAttribute('class', 'empty-stage');

  div.innerHTML =
      `<img class="sun" src="../images/sun.svg"><p class="empty-stage-text gray">You have no tasks.<br>Add a task below.</p>`;
};

const ifNoTasksAddEmptyStateToPlanner = () => {
  if (appData.tasks.length === 0) {
    deleteElementBySelector('#tasks-table');
    createEmptyStatePlanner();
    document.querySelector('#add-task')
        .focus();
  }
};

const ifNoCompletedTasksAddEmptyStateToDone = () => {
  if (appData.tasksDone.length === 0) {
    deleteElementBySelector('#tasks-done');
    createEmptyStateDone();
    document.querySelector('#add-task')
        .focus();
  }
};

// Function to delete a task.
const deleteTask = (event) => {
  const element = event.target;
  const index = element.dataset.index;
  // Only register the click on delete icon.
  if (!element.matches('.icon-cell i.material-icons')) {
    return;
  }
  appData.tasks.splice(`${index}`, 1);

  localStorage.setItem('tasks', JSON.stringify(appData.tasks));
  generateListOfTasks(appData.tasks);
  ifNoTasksAddEmptyStateToPlanner();
};

const addDeadlineToTask = (event) => {
  // event.preventDefault();
  const element = event.target;
  const index = element.dataset.index;
  if (!element.matches('.deadline-cell input[type="date"]')) {
    return;
  }

  const dateInShort = element.value;
  appData.tasks[index].deadline = dateInShort;

  localStorage.setItem('tasks', JSON.stringify(appData.tasks));
  // If (#deadline i) includes class visible, then run sort function
  const deadlineArrowIcon = document.querySelector('#deadline i');
  if (deadlineArrowIcon.classList.contains('visible')) {
    sortTasksBy('Deadline');
  }
};


// Function that records every key pressed inside task textarea and stores the
// value inside of tasks array object's text key.
const editTaskText = (event) => {
  event.preventDefault();
  const element = event.target;
  const text = element.value;
  const index = element.dataset.index;
  if (!element.matches('.text-cell')) {
    return;
  }
  appData.tasks[index].text = text;
  localStorage.setItem('tasks', JSON.stringify(appData.tasks));
};


const editTextInTaskCompleted = (event) => {
  event.preventDefault();
  const element = event.target;
  const text = element.value;
  const index = element.dataset.index;
  if (!element.matches('.done-text-cell')) {
    return;
  }
  appData.tasksDone[index].text = text;

  localStorage.setItem('tasksDone', JSON.stringify(appData.tasksDone));
};

const deleteTaskIfTaskTextRemoved = (event) => {
  event.preventDefault();
  const element = event.target;
  const text = element.value;
  const index = element.dataset.index;
  if (!element.matches('.text-cell')) {
    return;
  }
  if (text.trim() === '') {
    appData.tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(appData.tasks));
    generateListOfTasks(appData.tasks);
    ifNoTasksAddEmptyStateToPlanner();
  }
  document.querySelector('#add-task')
      .focus();
};

const deleteCompletedTaskIfTaskTextRemoved = (event) => {
  event.preventDefault();
  const element = event.target;
  const text = element.value;
  const index = element.dataset.index;
  if (!element.matches('.done-text-cell')) {
    return;
  }
  if (text.trim() === '') {
    appData.tasksDone.splice(index, 1);
    localStorage.setItem('tasksDone', JSON.stringify(appData.tasksDone));
    generateListOfTasksDone(appData.tasksDone);
    ifNoCompletedTasksAddEmptyStateToDone();
  }
  document.querySelector('#add-task')
      .focus();
};

// Function
const keyboardShortcutToSaveTaskText = () => {

};


// Function to add a current date on the website.
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

    dateContainer.innerHTML =
        `Today \u00A0\u00A0|\u00A0\u00A0 ${date} \u00A0\u00A0|\u00A0\u00A0 ${time}`;
  };
  setInterval(displayTime, 1000);
  displayTime();
};


// TODO Clean up code below.

// Function to generate list of tasks that are done
const generateListOfTasksDone = (tasksDoneArray = []) => {
  const tasksDoneContainer = document.querySelector('#done-tasks-container');

  // Delete all the done tasks on UI
  deleteElementBySelector('#tasks-done');

  const table = document.createElement('table');
  table.setAttribute('id', 'tasks-done');
  tasksDoneContainer.appendChild(table);

  const tasksDoneTable = document.querySelector('#tasks-done');

  tasksDoneTable.innerHTML = tasksDoneArray.map((task, index) => {
    return `
        <tr class="task-done">
          <td class="chkbx-cell"><img
               class="chkbx-img-checked"
               src="${task.done ? `../images/checkbox-checked.svg` :
        `../images/checkbox-unchecked-green.svg`}"
               data-index="${index}"></td>
          <td><textarea class="done-text-cell" rows="1" data-index="${index}">${task.text}</textarea></td>
        </tr>
    `;
  })
      .join('');

  autosize(tasksDoneTable.querySelectorAll('textarea'));
};

/**
 * If no tasks completed, then paint the empty state into on done page.
 */
const createEmptyStateDone = () => {
  if (appData.tasksDone.length > 0) {
    return;
  }
  const tasksDoneTable = document.querySelector('#tasks-done');
  if (!tasksDoneTable) {
    addEmptyStateToDone();
  }
};


// Function to add empty state paragraph to Done section
const addEmptyStateToDone = () => {
  const container = document.querySelector('#done-tasks-container');
  const div = document.createElement('div');
  div.setAttribute('id', 'empty-stage-done');
  div.setAttribute('class', 'empty-stage top-padding');
  container.appendChild(div);

  div.innerHTML =
      `<img class="checkbox" src="../images/checkbox_icon.svg"><p class="empty-stage-text">Tasks you get done<br>will appear here.</p>`;
};

const initializeDoneUI = () => {
  if (appData.tasksDone.length === 0) {
    return;
  }
  generateListOfTasksDone(appData.tasksDone);
};


// Responsive design JS


const delay = 1;

const handleWindowResize = () => {
  let resizeTaskId = null;

  window.addEventListener('resize', (evt) => {
    if (resizeTaskId !== null) {
      clearTimeout(resizeTaskId);
    }

    resizeTaskId = setTimeout(() => {
      resizeTaskId = null;
      generatePageLayout();
    }, delay);
  });
};


const generatePageLayout = () => {
  const checkboxButton = document.querySelector('#checkbox-button');
  const addButtonSmall = document.querySelector('#add-button-small');
  const addButton = document.querySelector('#add-button');
  const addTasks = document.querySelector('#add-tasks');
  const toPlannerButton = document.querySelector('#back-to-planner');
  const doneContainer = document.querySelector('#done-container');
  const mainContent = document.querySelector('#main-content');

  if (window.matchMedia('(min-width: 800px)').matches) {
    addButtonSmall.style.display = 'none';
    addButton.style.display = 'flex';
    checkboxButton.style.display = 'none';
    addTasks.style.padding = '0';
    toPlannerButton.style.display = 'none';
    doneContainer.style.width = '530px';
    doneContainer.style.display = 'flex';
    // mainContent.style.display = 'flex';
    checkboxClicked = false;
  }

  if (window.matchMedia('(max-width: 799px)').matches) {
    addButtonSmall.style.display = 'none';
    addButton.style.display = 'flex';
    checkboxButton.style.display = 'flex';
    addTasks.style.padding = '0 15px';
    toPlannerButton.style.display = 'flex';
    doneContainer.style.display = 'none';
    mainContent.style.display = 'flex';
  }

  if (window.matchMedia('(max-width: 499px)').matches) {
    addButton.style.display = 'none';
    addButtonSmall.style.display = 'flex';
  }

  // if (window.matchMedia("(max-width: 799px)").matches && checkboxClicked ===
  // true) { doneContainer.style.display = 'flex'; mainContent.style.display =
  // 'none'; console.log("screen width < 799 && checkboxClicked === true") }
};

// Function to view done tasks if screen is smaller then 720px;

// Add event listener to the checkbox button
const checkboxButton = document.querySelector('#checkbox-button');
let checkboxClicked = false;

const viewCompletedTasks = () => {
  checkboxClicked = true;
  const doneContainer = document.querySelector('#done-container');
  doneContainer.style.display = 'flex';
  doneContainer.style.height = '100vh';
  doneContainer.style.width = '100%';
  doneContainer.style.minWidth = '320px';

  const mainContent = document.querySelector('#main-content');
  mainContent.style.display = 'none';
};


// Run on document loaded.
document.addEventListener('DOMContentLoaded', main);
