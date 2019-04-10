// Empty states design with JS
// ___________________________

// Function to add empty state paragraph to Planner section
const addEmptyStateToPlanner = () => {
    const container = document.querySelector('#tasks-container');
    const div = document.createElement('div');
    container.appendChild(div);
    div.setAttribute('id', 'empty-stage-planner');
    div.setAttribute('class', 'empty-stage');

    div.innerHTML = '<img class="sun" src="images/sun.svg"><p' +
        ' class="empty-stage-text gray">You' +
        ' have' +
        ' no tasks.' +
        ' <br>Add a task below.</p>';
};

// If no tasks created, run addEmptyStateToPlanner() function
const tasksTable = document.querySelector('#tasks-table');
if(!tasksTable) {
    addEmptyStateToPlanner();
}



// Function to add empty state paragraph to Done section
const addEmptyStateToDone = () => {
    const container = document.querySelector('#done-container');
    const div = document.createElement('div');
    container.appendChild(div);
    div.setAttribute('id', 'empty-stage-done');
    div.setAttribute('class', 'empty-stage top-padding');

    div.innerHTML = '<img class="checkbox" src="images/checkbox_icon.svg"><p' +
        ' class="empty-stage-text">Tasks you get done<br>will appear' +
        ' here.</p>';
};

// If no tasks completed, run addEmptyStateToDone() function
const tasksDone = document.querySelector('#tasks-done');
if(!tasksDone) {
    addEmptyStateToDone();
}


// Function to remove empty state content
const removeEmptyState = (elementId) => {
    const divToRemove = document.getElementById(elementId);
    divToRemove.parentNode.removeChild(divToRemove);
};


// removeEmptyState('empty-stage-done');
// removeEmptyState('empty-stage-planner');






// Responsive design JS
// ____________________

const delay = 100;  // Your delay here

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

    if (window.matchMedia( "(min-width: 720px)" ).matches) {
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

    if(window.matchMedia( "(max-width: 719px)" ).matches) {
        addButton.style.display = 'none';
        checkboxButton.style.display = 'flex';
        addButtonSmall.style.display = 'flex';
        addTasks.style.padding = '0 15px';
        toPlannerButton.style.display = 'flex';
        doneContainer.style.display = 'none';
        mainContent.style.display = 'flex';

    }

    if(window.matchMedia( "(max-width: 719px)" ).matches && checkboxClicked === true) {
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