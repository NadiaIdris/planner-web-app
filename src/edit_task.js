import {deleteElementBySelector} from './util';
import {
  generateListOfTasksDone,
  generateListOfTasks,
  createEmptyStatePlanner,
  ifNoTasksAddEmptyStateToPlanner,
} from './paint_ui';
import {appData} from './app_data';
import {
  sortTasksBy,
  highlightTask,
} from './index';

/**
 * Function to move task to done section once completed
 * @param {MouseEvent} event
 */
const markTaskDone = (event) => {
  const doneEmptyState = document.querySelector('#empty-stage-done');
  const element = event.target;
  const index = element.dataset.index;
  if (!element.matches(`img[data-index="${index}"]`)) return;

  // Remove empty state from done section if present
  if (doneEmptyState) deleteElementBySelector('#empty-stage-done');

  // Repaint the tasks done UI
  appData.markTaskDone(index);
  generateListOfTasksDone(appData.tasksDone);
  generateListOfTasks(appData.tasks);

  if (appData.tasks.length === 0) {
    deleteElementBySelector('#tasks-table');
    createEmptyStatePlanner();
  }
};

/**
 * Function records every key pressed inside task textarea and stores the value
 * inside of tasks array object's text key.
 * @param {MouseEvent} event
 */
const editTaskText = (event) => {
  const element = event.target;
  const text = element.value;
  const index = element.dataset.index;
  if (!element.matches('.text-cell')) return;

  appData.tasks[index].text = text;
  appData.save();
};

// Function
const keyboardShortcutToSaveTaskText = () => {
  // TODO implement this
};

/**
 * When the user changes the value of the priority drop down for a given
 * task this function is called.
 * @param {MouseEvent} event
 */
const changeTaskPriority = (event) => {
  const element = event.target;
  const index = element.dataset.index;
  if (!element.matches(`.priority[data-index="${index}"`)) return;
  appData.tasks[index].priority = element.value;

  let taskToRearrange;
  const deadlineArrowIcon = document.querySelector('#deadline i');
  const sortedByPriority = !deadlineArrowIcon.classList.contains('visible');

  const handleSortedByPriority = () => {
    const taskChanged = appData.tasks[index];
    const priorityOfTheTaskChanged = appData.tasks[index].priority;
    const firstTaskWithSamePriority = appData.tasks.find((task) =>
      task.priority === priorityOfTheTaskChanged &&
        task.id !== taskChanged.id);

    if (firstTaskWithSamePriority !== undefined) {
      taskToRearrange = appData.tasks.splice(index, 1);
      const indexOfDuplicate = appData.tasks.indexOf(firstTaskWithSamePriority);
      appData.tasks.splice(indexOfDuplicate, 0, taskToRearrange[0]);
      sortTasksBy('Priority');
      highlightTask(taskToRearrange[0]);
    } else {
      sortTasksBy('Priority');
      highlightTask(taskChanged);
    }
  };
  if (sortedByPriority) handleSortedByPriority();
};

const addDeadlineToTask = (event) => {
  const element = event.target;
  const index = element.dataset.index;
  if (!element.matches('.deadline-cell input[type="date"]')) return;
  appData.tasks[index].deadline = element.value;

  let taskToRearrange;
  const deadlineArrowIcon = document.querySelector('#deadline i');
  const sortedByDeadline = deadlineArrowIcon.classList.contains('visible');

  const handleSortedByDeadline = () => {
    const taskChanged = appData.tasks[index];
    const deadlineOfTheTaskChanged = appData.tasks[index].deadline;
    const firstTaskWithSameDeadline = appData.tasks.find((task) =>
      task.deadline === deadlineOfTheTaskChanged &&
        task.id !== taskChanged.id);

    if (firstTaskWithSameDeadline !== undefined) {
      taskToRearrange = appData.tasks.splice(index, 1);
      const indexOfDuplicate = appData.tasks.indexOf(firstTaskWithSameDeadline);
      appData.tasks.splice(indexOfDuplicate, 0, taskToRearrange[0]);
      sortTasksBy('Deadline');
      highlightTask(taskToRearrange[0]);
    } else {
      sortTasksBy('Deadline');
      highlightTask(taskChanged);
    }
  };

  if (sortedByDeadline) handleSortedByDeadline();
};

// Function to delete a task.
const deleteTask = (event) => {
  const element = event.target;
  const index = element.dataset.index;
  if (!element.matches('.icon-cell i.material-icons')) return;

  appData.tasks.splice(`${index}`, 1);
  appData.save();
  generateListOfTasks(appData.tasks);
  ifNoTasksAddEmptyStateToPlanner();
};

const deleteTaskIfTaskTextRemoved = (event) => {
  const element = event.target;
  const text = element.value;
  const index = element.dataset.index;
  if (!element.matches('.text-cell')) return;

  if (text.trim() === '') {
    appData.tasks.splice(index, 1);
    appData.save();
    generateListOfTasks(appData.tasks);
    ifNoTasksAddEmptyStateToPlanner();
  }
  document.querySelector('#add-task').focus();
};


export {
  markTaskDone,
  editTaskText,
  keyboardShortcutToSaveTaskText,
  changeTaskPriority,
  addDeadlineToTask,
  deleteTask,
  deleteTaskIfTaskTextRemoved,
};
