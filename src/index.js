// import autosize from 'autosize';
import {deleteElementBySelector} from './util';
import autosize from "autosize/src/autosize";


// Globals.

const formElement = document.querySelector('#form');
const tasksContainer = document.querySelector('#tasks-container');
const doneTasksContainer = document.querySelector('#done-tasks-container');

const main = () => {
  generateTodaysDateAndTime();
  loadTasksFromLocalStorage();
  loadTasksDoneFromLocalStorage();
  loadSortedByFromLocalStorage();
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
  doneTasksContainer.addEventListener('focusout', deleteCompletedTaskIfTaskTextRemoved);

  tasksContainer.addEventListener('change', sortTasksOnChange);
  window.addEventListener('load', sortTasksOnPageLoad);
  // tasksContainer load event listener needed to be added. Don't know why,
  // but the code didn't just work with the window event listener above.
  tasksContainer.addEventListener('load', sortTasksOnPageLoad);
  tasksContainer.addEventListener('click', sortTasksOnClick);
};


// Tasks.

let tasks;
const loadTasksFromLocalStorage = () => {
  tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  // tasksContainer.addEventListener('change', sortTasksOnChange);
};

let sortBy;
const loadSortedByFromLocalStorage = () => {
  sortBy = JSON.parse(localStorage.getItem('sortBy')) || [{selectedValue: "Priority"}];
};

// Function to sort an array. Takes a param which is dropdown selected value.
const sorting = (value) => {
  const selected = {
    selectedValue: "Priority",
  };

  // Check if change value is "Deadline".
  if (value === "Deadline") {
    selected.selectedValue = value;
    // Separating tasks without deadline
    let noDeadlineTasks = [];
    let deadlineTasks = [];
    tasks.forEach((task) => {
      if (task.deadline === '' || 'deadline' in task === false) {
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

    tasks = [...deadlineTasks, ...noDeadlineTasks];

    sortBy.length = 0;
    sortBy.push(selected);
    localStorage.setItem('sortBy', JSON.stringify(sortBy));
    generateTableWithHeader();
    generateListOfTasks(tasks);
  }

  // If change value is "Priority".
  if (value === "Priority") {
    selected.selectedValue = value;
    // Sort the array by priority.
    tasks.sort((a, b) => {
      if (a.priority < b.priority) return -1;
      if (a.priority > b.priority) return 1;
      return 0;
    });

    // Clear the array.
    sortBy.length = 0;
    sortBy.push(selected);
    localStorage.setItem('sortBy', JSON.stringify(sortBy));
    generateTableWithHeader();
    generateListOfTasks(tasks);
  }
};

// Function to sort tasks when dropdown option is present.
const sortTasksOnChange = (event) => {
  event.preventDefault();
  const element = event.target;
  if (!element.matches('.sort-by')) return;
  const elementValue = element.value;

  sorting(elementValue);
};

// Function to sort tasks when page is loaded.
const sortTasksOnPageLoad = () => {
  // On page load, get from local storage the correct sorting name
  const currentlySelected = sortBy[0].selectedValue;
  sorting(currentlySelected);
};

//
const sortTasksOnClick = (event) => {
  // event.preventDefault();
  let element = event.target;
  let elementValue;

  if (!element.matches('#priority') && !element.matches('#deadline') && !element.matches('i.arrow-down')) return;

  const priorityArrowIcon = document.querySelector('#priority i');
  const deadlineArrowIcon = document.querySelector('#deadline i');

  if (element.textContent.includes('Priority') || element.matches('#priority' +
      ' i.arrow-down')) {
    elementValue = "Priority";

    // Add arrow to priority.
    priorityArrowIcon.classList.add('visible');
    priorityArrowIcon.classList.remove('hidden');
    // If arrow exists in deadline, remove arrow.
    deadlineArrowIcon.classList.remove('visible');
    deadlineArrowIcon.classList.add('hidden');
  } else if (element.textContent.includes('Deadline') || element.matches('#deadline i.arrow-down')) {
    elementValue = "Deadline";
    // Add arrow to deadline.
    deadlineArrowIcon.classList.add('visible');
    deadlineArrowIcon.classList.remove('hidden');
    // If arrow exists in priority, remove arrow.
    priorityArrowIcon.classList.remove('visible');
    priorityArrowIcon.classList.add('hidden');
  }
  sorting(elementValue);
};


// Tasks that are done, parsed from local storage.
let tasksDone;
const loadTasksDoneFromLocalStorage = () => {
  tasksDone = JSON.parse(localStorage.getItem('tasksDone')) || [];
};

// Function to move task to done section once completed
const markTaskCompleted = (event) => {
  debugger;
  const doneEmptyState = document.querySelector('#empty-stage-done');

      const element = event.target;
      const index = element.dataset.index;
      if (!element.matches(`img[data-index="${index}"]`)) return;

      // Remove empty state from done section if present
      if (doneEmptyState) {
        deleteElementBySelector('#empty-stage-done');
      }

      tasks[index].done = !tasks[index].done;

      // Remove the element from the tasks array
      const checkedTask = tasks.splice(index, 1);

      // Push the element to tasksDone
      tasksDone.push(checkedTask[0]);

      // Set the tasksDone in local storage
      localStorage.setItem('tasksDone', JSON.stringify(tasksDone));
      // Repaint the tasks done UI
      generateListOfTasksDone(tasksDone);

      localStorage.setItem('tasks', JSON.stringify(tasks));
      generateListOfTasks(tasks);

      if (tasks.length === 0) {
        deleteElementBySelector('#tasks-table');
        createEmptyStatePlanner();
      }
    }
;

const markTaskUncompleted = (event) => {
  // Get the element
  const element = event.target;
  const index = element.dataset.index;
  if (!element.matches(`img[data-index="${index}"]`)) return;
  //Set tasksDone[index].done to false.
  tasksDone[index].done = !tasksDone[index].done;

  // Remove the element from tasksDone array.
  const uncheckedTask = tasksDone.splice(index, 1);
  // Add the removed element back to tasks array.
  tasks.push(uncheckedTask[0]);

  // Set the tasksDone in local storage
  localStorage.setItem('tasksDone', JSON.stringify(tasksDone));
  // Repaint the tasks done UI
  generateListOfTasksDone(tasksDone);

  localStorage.setItem('tasks', JSON.stringify(tasks));

  // Sort the undone tasks list based on what sorting option is selected.
  if (document.querySelector('#deadline i').classList.contains('visible')) {
    sorting('Deadline');
    // In order to highlight the background of the task, I need task object
    // to have unique identifier in order to be able to find it from the
    // list of tasks.
  } else {
    sorting('Priority');
  }



  if (tasksDone.length === 0) {
    deleteElementBySelector('#tasks-done');
    createEmptyStateDone();
  }
};


/**
 * Create a task table given an event. The event is generated on form submit.
 * @param {Event} event
 */
const addTask = (event) => {
  event.preventDefault();
  // Store the value in an object. Store object inside an array in local
  // storage.
  const text = document.querySelector('#add-task').value;

  // If text field is empty, stop executing the rest of the function.
  if (checkIfTaskIsEmpty(text)) return;

  const task = {
    text,
    done: false,
    priority: "P2",
    deadline: undefined,
  };

  tasks.push(task);
  formElement.reset();
  localStorage.setItem('tasks', JSON.stringify(tasks));
  generateTableWithHeader();
  generateListOfTasks(tasks);
};

/**
 * Check if task entered is empty.
 * @param taskText
 * @returns {boolean} true
 */
const checkIfTaskIsEmpty = (taskText) => {
  if (taskText.trim() === '') {
    alert("Task is empty");
    formElement.reset();
    return true;
  }
};

/**
 * If some tasks present, return and add a task to the existing table with
 * the next function.
 */
const generateTableWithHeader = () => {
  const tasksTable = document.querySelector('#tasks-table');
  if (!tasksTable) {
    // clear the empty state
    deleteElementBySelector('#empty-stage-planner');

    const tasksHeader = document.createElement('table');
    tasksHeader.setAttribute('id', 'tasks-table');
    tasksContainer.appendChild(tasksHeader);
    tasksHeader.innerHTML = `
                <thead>
                <tr id="task-headings">
                    <th></th>
                    <th class="heading-cell">Task</th>
                    <th id="priority" class="heading-cell"><i class="material-icons arrow-down ${sortBy[0].selectedValue === "Priority" ? "visible'" : "hidden"}">arrow_drop_down</i>Priority</th>
                    <th id="deadline" class="heading-cell"><i class="material-icons arrow-down ${sortBy[0].selectedValue === "Deadline" ? "visible" : "hidden"}">arrow_drop_down</i>Deadline</th>
                    <th class="sorting-cell">
                       <select class="sort-by">
                          <option value="Priority" ${sortBy[0].selectedValue === "Priority" ? "selected" : ""}>Priority</option>
                          <option value="Deadline" ${sortBy[0].selectedValue === "Deadline" ? "selected" : ""}>Deadline</option>
                       </select>
                    </th>
                </tr>
                </thead>`;
  }
};

/**
 * @param {Array<Object>} tasksArray this is painted to the screen.
 */
const generateListOfTasks = (tasksArray = []) => {
  const tasksTable = document.querySelector('#tasks-table');

  deleteElementBySelector("#tasks-table > tbody");

  // Make a table body container to store all tasks.
  const tableBody = document.createElement('tbody');
  tasksTable.appendChild(tableBody);

  // Map over each array element and paint them on screen.
  tableBody.innerHTML = tasksArray.map((task, index) => {
    const deadlineAttributeHTML = task.deadline ? `value="${task.deadline}"` : '';
    return `
       <tr class="task">
           <td class="chkbx-cell">
             <img 
               class="chkbx-img-unchecked"
               src="${task.done ? `../images/checkbox-checked.svg` : `../images/checkbox-unchecked.svg`}" 
               data-index="${index}"></td>
           <td class="textarea-cell"><textarea rows="1" class="text-cell" data-index="${index}">${task.text}</textarea></td>
           <td class="priority-cell">
              <select class="priority" data-index="${index}">
                    <option value="P0" ${task.priority === "P0" ? "selected" : ""}>P0</option>
                    <option value="P1" ${task.priority === "P1" ? "selected" : ""}>P1</option>
                    <option value="P2" ${task.priority === "P2" ? "selected" : ""}>P2</option>
              </select></td>
           <td class="deadline-cell">
             <input type="date" class="deadline" ${deadlineAttributeHTML} data-index="${index}">
           </td>
           <td class="icon-cell">
             <i class="material-icons" data-index="${index}">delete</i>
           </td>
       </tr>
       `;
  }).join('');

  autosize(tableBody.querySelectorAll('textarea'));
};


const selectPriority = (event) => {
  // event.preventDefault();
  const element = event.target;
  const index = element.dataset.index;
  if (!element.matches('.priority')) return;
  tasks[index].priority = element.value;
  localStorage.setItem('tasks', JSON.stringify(tasks));

  // If (#priority i) includes class visible, then run sort function
  const priorityArrowIcon = document.querySelector('#priority i');
  if (priorityArrowIcon.classList.contains('visible')) {
    console.log("Change event listener worked");

    sorting("Priority");
    // In order to highlight the background of the task, I need task object
    // to have unique identifier in order to be able to find it from the
    // list of tasks.
  }
};


/**
 * If item(s) in tasks, then generate table with the task(s).
 */
const initializePlannerUI = () => {
  if (tasks.length === 0) return;
  generateTableWithHeader();
  generateListOfTasks(tasks);
};

/**
 * If no tasks created, then paint the empty state into on planner page.
 */
const createEmptyStatePlanner = () => {
  if (tasks.length > 0) return;
  const tasksTable = document.querySelector('#tasks-table');
  if (!tasksTable) {
    addEmptyStateToPlanner();
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

  div.innerHTML = `<img class="sun" src="../images/sun.svg"><p class="empty-stage-text gray">You have no tasks.<br>Add a task below.</p>`;
};

const ifNoTasksAddEmptyStateToPlanner = () => {
  if (tasks.length === 0) {
    deleteElementBySelector('#tasks-table');
    createEmptyStatePlanner();
    document.querySelector('#add-task').focus();
  }
};

const ifNoCompletedTasksAddEmptyStateToDone = () => {
  if (tasksDone.length === 0) {
    deleteElementBySelector('#tasks-done');
    createEmptyStateDone();
    document.querySelector('#add-task').focus();
  }
};

// Function to delete a task.
const deleteTask = (event) => {
  const element = event.target;
  const index = element.dataset.index;
  // Only register the click on delete icon.
  if (!element.matches('.icon-cell i.material-icons')) return;
  tasks.splice(`${index}`, 1);

  localStorage.setItem('tasks', JSON.stringify(tasks));
  generateListOfTasks(tasks);
  ifNoTasksAddEmptyStateToPlanner();
}

const addDeadlineToTask = (event) => {
  // event.preventDefault();
  const element = event.target;
  const index = element.dataset.index;
  if (!element.matches('.deadline-cell input[type="date"]')) return;

  const dateInShort = element.value;
  tasks[index].deadline = dateInShort;

  localStorage.setItem('tasks', JSON.stringify(tasks));
  // If (#deadline i) includes class visible, then run sort function
  const deadlineArrowIcon = document.querySelector('#deadline i');
  if (deadlineArrowIcon.classList.contains('visible')) {
    sorting("Deadline");
    // Add a highlighter to a task.
  }
};

// Function that adds highlighter


// Function that records every key pressed inside task textarea and stores the
// value inside of tasks array object's text key.
const editTaskText = (event) => {
  event.preventDefault();
  const element = event.target;
  const text = element.value;
  const index = element.dataset.index;
  if (!element.matches('.text-cell')) return;
  tasks[index].text = text;
  localStorage.setItem('tasks', JSON.stringify(tasks));
};


const editTextInTaskCompleted = (event) => {
  event.preventDefault();
  const element = event.target;
  const text = element.value;
  const index = element.dataset.index;
  if (!element.matches('.done-text-cell')) return;
  tasksDone[index].text = text;

  localStorage.setItem('tasksDone', JSON.stringify(tasksDone));
};

const deleteTaskIfTaskTextRemoved = (event) => {
  event.preventDefault();
  const element = event.target;
  const text = element.value;
  const index = element.dataset.index;
  if (!element.matches('.text-cell')) return;
  if (text.trim() === '') {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    generateListOfTasks(tasks);
    ifNoTasksAddEmptyStateToPlanner();
  }
  document.querySelector('#add-task').focus();
};

const deleteCompletedTaskIfTaskTextRemoved = (event) => {
  event.preventDefault();
  const element = event.target;
  const text = element.value;
  const index = element.dataset.index;
  if (!element.matches('.done-text-cell')) return;
  if (text.trim() === '') {
    tasksDone.splice(index, 1);
    localStorage.setItem('tasksDone', JSON.stringify(tasksDone));
    generateListOfTasksDone(tasksDone);
    ifNoCompletedTasksAddEmptyStateToDone();
  }
  document.querySelector('#add-task').focus();
};

// Function
const keyboardShortcutToSaveTaskText = () => {

};


// Function to add a current date on the website.
const generateTodaysDateAndTime = () => {
  setInterval(() => {
    const dateContainer = document.querySelector('#date');
    const today = new Date();

    const date = today.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    });

    const time = today.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    dateContainer.innerHTML = `Today \u00A0\u00A0|\u00A0\u00A0 ${date} \u00A0\u00A0|\u00A0\u00A0 ${time}`;
  }, 1000);
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
               src="${task.done ? `../images/checkbox-checked.svg` : `../images/checkbox-unchecked-green.svg`}"
               data-index="${index}"></td>
          <td><textarea class="done-text-cell" rows="1" data-index="${index}">${task.text}</textarea></td>
        </tr>
    `;
  }).join('');

  autosize(tasksDoneTable.querySelectorAll('textarea'));
};

/**
 * If no tasks completed, then paint the empty state into on done page.
 */
const createEmptyStateDone = () => {
  if (tasksDone.length > 0) return;
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

  div.innerHTML = `<img class="checkbox" src="../images/checkbox_icon.svg"><p class="empty-stage-text">Tasks you get done<br>will appear here.</p>`;
};

const initializeDoneUI = () => {
  if (tasksDone.length === 0) return;
  generateListOfTasksDone(tasksDone);
};


// Responsive design JS


const delay = 1;

const handleWindowResize = () => {
  let resizeTaskId = null;

  window.addEventListener('resize', evt => {
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

  if (window.matchMedia("(min-width: 800px)").matches) {
    addButton.style.display = 'flex';
    checkboxButton.style.display = 'none';
    addButtonSmall.style.display = 'none';
    addTasks.style.padding = '0';
    toPlannerButton.style.display = 'none';
    doneContainer.style.width = '530px';
    mainContent.style.display = 'flex';
    doneContainer.style.display = 'flex';
    checkboxClicked = false;
  }

  if (window.matchMedia("(max-width: 799px)").matches) {
    addButton.style.display = 'none';
    checkboxButton.style.display = 'flex';
    addButtonSmall.style.display = 'flex';
    addTasks.style.padding = '0 15px';
    toPlannerButton.style.display = 'flex';
    doneContainer.style.display = 'none';
    mainContent.style.display = 'flex';
  }

  if (window.matchMedia("(max-width: 799px)").matches && checkboxClicked === true) {
    doneContainer.style.display = 'flex';
    mainContent.style.display = 'none';
    console.log("screen width < 719 && checkboxClicked === true")
  }
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
document.addEventListener("DOMContentLoaded", main);