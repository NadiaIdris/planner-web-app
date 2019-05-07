// Globals.

const formElement = document.querySelector('#form');

const onDomLoad = () => {
  formElement.addEventListener('submit', addTask);
  createEmptyState();
};

// Tasks.

const tasks = [];

/**
 * Create a task table given an event. The event is generated on form submit.
 * @param {Event} event
 */
const addTask = (event) => {
  event.preventDefault();
  // Store the value in an object inside an array in local storage.
  const text = document.querySelector('#add-task').value;
  const task = {
    text,
    done: false,
    deadline: undefined,
  };
  tasks.push(task);
  formElement.reset();
  generateTableWithHeader();
  generateListOfTasks(tasks);
};

// Tasks container.

const tasksContainer = document.querySelector('#tasks-container');

/**
 * If some tasks present, return and add a task to the existing table with
 * the next function.
 */
const generateTableWithHeader = () => {
  const tasksTable = document.querySelector('#tasks-table');
  if (!tasksTable) {
    // clear the empty state
    deleteElementById('empty-stage-planner');

    const table = document.createElement('table');
    table.setAttribute('id', 'tasks-table');
    tasksContainer.appendChild(table);
    table.innerHTML = `
                <thead>
                <tr id="task-headings">
                    <th></th>
                    <th class="heading-cell">Tasks</th>
                    <th class="heading-cell">Deadlines</th>
                    <th></th>
                    <th></th>
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
    return `
       <tr class="task">
          <td class=""chkbx-cell><input type="checkbox"></td>
           <td><input type="text" class="task-cell" value="${task.text}"></td>
           <td><div class="deadline">${task.deadline}</div></td>
           <td class="icon-cell"><i class="material-icons">delete</i></td>
           <td class="img-cell"><img src="images/move-icon.svg" alt="move tasks icon"></td>
       </tr>
       `;
  }).join('');
};

// Empty state.

/**
 * If no tasks created, run addEmptyStateToPlanner() function.
 */
const createEmptyState = () => {
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

  div.innerHTML = `<img class="sun" src="images/sun.svg"><p class="empty-stage-text gray">You have no tasks.<br>Add a task below.</p>`;
};




// TODO Clean up code below.


// Function to add empty state paragraph to Done section
const addEmptyStateToDone = () => {
  const container = document.querySelector('#done-tasks-container');
  const div = document.createElement('div');
  div.setAttribute('id', 'empty-stage-done');
  div.setAttribute('class', 'empty-stage top-padding');
  container.appendChild(div);

  div.innerHTML = `<img class="checkbox" src="images/checkbox_icon.svg"><p class="empty-stage-text">Tasks you get done<br>will appear here.</p>`;
};

// If no tasks completed, run addEmptyStateToDone() function
const tasksDone = document.querySelector('#tasks-done');
if (!tasksDone) {
  addEmptyStateToDone();
}






// Responsive design JS


const delay = 1;

const originalResize = () => {
  paintScreen();
};


(() => {
  let resizeTaskId = null;

  window.addEventListener('resize', evt => {
    if (resizeTaskId !== null) {
      clearTimeout(resizeTaskId);
    }

    resizeTaskId = setTimeout(() => {
      resizeTaskId = null;
      originalResize(evt);
    }, delay);
  });
})();


const paintScreen = () => {
  const checkboxButton = document.querySelector('#checkbox-button');
  const addButtonSmall = document.querySelector('#add-button-small');
  const addButton = document.querySelector('#add-button');
  const addTasks = document.querySelector('#add-tasks');
  const toPlannerButton = document.querySelector('#back-to-planner');
  const doneContainer = document.querySelector('#done-container');
  const mainContent = document.querySelector('#main-content');

  if (window.matchMedia("(min-width: 720px)").matches) {
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

  if (window.matchMedia("(max-width: 719px)").matches) {
    addButton.style.display = 'none';
    checkboxButton.style.display = 'flex';
    addButtonSmall.style.display = 'flex';
    addTasks.style.padding = '0 15px';
    toPlannerButton.style.display = 'flex';
    doneContainer.style.display = 'none';
    mainContent.style.display = 'flex';

  }

  if (window.matchMedia("(max-width: 719px)").matches && checkboxClicked === true) {
    doneContainer.style.display = 'flex';
    mainContent.style.display = 'none';
    console.log("screen width < 719 && checkboxClicked === true")
  }
};

window.addEventListener('load', paintScreen);


// Function to view done tasks if screen is smaller then 720px;

// Add event listener to the checkbox button
const checkboxButton = document.querySelector('#checkbox-button');
let checkboxClicked = false;

const viewDoneTasks = () => {
  console.log("Checkbox button is working");

  checkboxClicked = true;
  const doneContainer = document.querySelector('#done-container');
  doneContainer.style.display = 'flex';
  doneContainer.style.height = '100vh';
  doneContainer.style.width = '100%';
  doneContainer.style.minWidth = '320px';

  const mainContent = document.querySelector('#main-content');
  mainContent.style.display = 'none';
};

checkboxButton.addEventListener('click', viewDoneTasks);


// Run on document loaded.
document.addEventListener("DOMContentLoaded", onDomLoad);
