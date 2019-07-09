import {deleteElementBySelector} from './util';
import autosize from 'autosize/src/autosize';
import {appData, SortByValues} from './app_data';
import {tasksContainer} from './index';

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
            <i class="material-icons arrow-down ${priorityArrow}"
              >arrow_drop_down</i>Priority
          </th>
          <th id="deadline" class="heading-cell">
            <i class="material-icons arrow-down ${deadlineArrow}"
            >arrow_drop_down</i>Deadline
          </th>
          <th class="sorting-cell">
             <select id="sort-by">
                <option value="Priority" ${prioritySelected}>Priority</option>
                <option value="Deadline" ${deadlineSelected}>Deadline</option>
             </select>
          </th>
      </tr>
      </thead>
      `;
  }
};

// Function to generate list of tasks that are done
const generateListOfTasksDone = (tasksDoneArray = []) => {
  const tasksDoneContainer = document.querySelector('#done-tasks-container');
  deleteElementBySelector('#tasks-done');

  const table = document.createElement('table');
  table.setAttribute('id', 'tasks-done');
  tasksDoneContainer.appendChild(table);

  const renderTask = (task, index) => {
    return `
      <tr class="task-done" data-index="${index}">
        <td class="chkbx-cell-done">
          <img
             class="chkbx-img-checked"
             src="../images/checkbox-checked.svg"
             data-index="${index}">
        </td>
        <td>
          <textarea class="done-text-cell" rows="1" data-index="${index}"
          >${task.text}</textarea>
        </td>
      </tr>
    `;
  };

  const tasksDoneTable = document.querySelector('#tasks-done');
  tasksDoneTable.innerHTML = tasksDoneArray.map(renderTask).join('');
  autosize(tasksDoneTable.querySelectorAll('textarea'));
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
        `value="${task.deadline}"` : '';
    const p0Selected = task.priority === 'P0' ? 'selected' : '';
    const p1Selected = task.priority === 'P1' ? 'selected' : '';
    const p2Selected = task.priority === 'P2' ? 'selected' : '';

    return `
      <tr class="task" data-index="${index}">
        <td class="chkbx-cell">
          <img
            class="chkbx-img-unchecked"
            src="../images/checkbox-unchecked.svg"
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

/**
 * If no tasks created, then paint the empty state into on planner page.
 */
const createEmptyStatePlanner = () => {
  if (appData.tasks.length > 0) return;
  const tasksTable = document.querySelector('#tasks-table');
  if (!tasksTable) {
    addEmptyStateToPlanner();
    appData.saveSortBy(SortByValues.Priority);
  }
};

/**
 * If no tasks completed, then paint the empty state into on done page.
 */
const createEmptyStateDone = () => {
  if (appData.tasksDone.length > 0) return;
  const tasksDoneTable = document.querySelector('#tasks-done');
  if (!tasksDoneTable) addEmptyStateToDone();
};

// Function to add empty state paragraph to Done section
const addEmptyStateToDone = () => {
  const container = document.querySelector('#done-tasks-container');
  const div = document.createElement('div');
  div.setAttribute('id', 'empty-stage-done');
  div.setAttribute('class', 'empty-stage top-padding');
  container.appendChild(div);

  div.innerHTML =
      '<img class="checkbox" src="../images/checkbox_icon.svg">' +
      '<p class="empty-stage-text">' +
      'Tasks you get done<br>will appear here.</p>';
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
      '<img class="sun" src="../images/sun.svg">' +
      '<p class="empty-stage-text gray">' +
      'You have no tasks.<br>Add a task below.</p>';
};

const ifNoTasksAddEmptyStateToPlanner = () => {
  if (appData.tasks.length === 0) {
    deleteElementBySelector('#tasks-table');
    createEmptyStatePlanner();
    document.querySelector('#add-task').focus();
  }
};

const ifNoCompletedTasksAddEmptyStateToDone = () => {
  if (appData.tasksDone.length === 0) {
    deleteElementBySelector('#tasks-done');
    createEmptyStateDone();
    document.querySelector('#add-task').focus();
  }
};

/**
 * If item(s) in tasks, then generate table with the task(s).
 */
const initializePlannerUI = () => {
  if (appData.tasks.length === 0) return;
  generateTableWithHeader();
  generateListOfTasks(appData.tasks);
};

const initializeDoneUI = () => {
  if (appData.tasksDone.length === 0) return;
  generateListOfTasksDone(appData.tasksDone);
};

// Responsive design.

const handleWindowResize = () => {
  let resizeTaskId = null;

  /* https://css-tricks.com/the-trick-to-viewport-units-on-mobile/ */
  const setViewportHeight = ()=>{
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  const generateAppLayoutAfterResizingWindow = () => {
    if (resizeTaskId !== null) clearTimeout(resizeTaskId);

    resizeTaskId = setTimeout(() => {
      resizeTaskId = null;
      generatePageLayout();
    }, 10);
  };

  window.addEventListener('resize', () => {
    setViewportHeight();
    generateAppLayoutAfterResizingWindow();
  });

  setViewportHeight();
};

const showTasks = () => {
  console.log('showTasks eventListener is working');
  appData.showDonePanel = false;
  const doneContainer = document.querySelector('#done-container');
  doneContainer.style.display = 'none';
  const mainContent = document.querySelector('#main-content');
  mainContent.style.display = 'flex';
  mainContent.style.width = '100%';
  mainContent.style.minWidth = '320px';
};

const showDoneTasks = () => {
  appData.showDonePanel = true;
  // Hide the main content.
  const mainContent = document.querySelector('#main-content');
  mainContent.style.display = 'none';
  // Paint the done tasks UI.
  const doneContainer = document.querySelector('#done-container');
  doneContainer.style.display = 'flex';
  doneContainer.style.width = '100%';
  doneContainer.style.minWidth = '320px';
};

const generatePageLayout = () => {
  const mainContent = document.querySelector('#main-content');
  const doneContainer = document.querySelector('#done-container');

  if (window.matchMedia('(min-width: 801px)').matches) {
    mainContent.style.display = 'flex';
    mainContent.style.width = '870px';
    doneContainer.style.display = 'flex';
    doneContainer.style.width = '530px';
  }

  if (window.matchMedia('(max-width: 800px)').matches) {
    if (appData.showDonePanel) {
      showDoneTasks();
    } else {
      doneContainer.style.display = 'none';
      mainContent.style.display = 'flex';
    }
  }

  if (window.matchMedia('(min-width: 361px)').matches) {
    const tableHeader = document.querySelector('#tasks-table');
    if (!tableHeader) return;

    const priorityArrow =
        appData.sortBy === SortByValues.Priority ? 'visible' : 'hidden';
    const deadlineArrow =
        appData.sortBy === SortByValues.Deadline ? 'visible' : 'hidden';
    const prioritySelected =
        appData.sortBy === SortByValues.Priority ? 'selected' : '';
    const deadlineSelected =
        appData.sortBy === SortByValues.Deadline ? 'selected' : '';

    tableHeader.innerHTML = `
      <thead>
      <tr id="task-headings">
          <th></th>
          <th id="task" class="heading-cell">Task</th>
          <th id="priority" class="heading-cell">
            Priority<i class="material-icons arrow-down ${priorityArrow}"
              >keyboard_arrow_down</i>
          </th>
          <th id="deadline" class="heading-cell">
            Deadline<i class="material-icons arrow-down ${deadlineArrow}"
            >keyboard_arrow_down</i>
          </th>
          <th class="sorting-cell">
             <select id="sort-by">
                <option value="Priority" ${prioritySelected}>Priority</option>
                <option value="Deadline" ${deadlineSelected}>Deadline</option>
             </select>
          </th>
      </tr>
      </thead>
      `;
    generateListOfTasks(appData.tasks);
  }

  if (window.matchMedia('(max-width: 360px)').matches) {
    const dropdown = document.querySelector('#sort-by');
    const prioritySelected =
        appData.sortBy === SortByValues.Priority ? 'selected' : '';
    const deadlineSelected =
        appData.sortBy === SortByValues.Deadline ? 'selected' : '';
    dropdown.innerHTML = `
                <option value="Priority" ${prioritySelected}>Priority</option>
                <option value="Deadline" ${deadlineSelected}>Deadline</option>
             `;
  }
};


export {
  generateTableWithHeader,
  generateListOfTasksDone,
  generateListOfTasks,
  createEmptyStatePlanner,
  createEmptyStateDone,
  ifNoTasksAddEmptyStateToPlanner,
  ifNoCompletedTasksAddEmptyStateToDone,
  initializePlannerUI,
  initializeDoneUI,
  handleWindowResize,
  generatePageLayout,
  showDoneTasks,
  showTasks,
};
