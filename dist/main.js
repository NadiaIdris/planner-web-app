/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/autosize/src/autosize.js":
/*!***********************************************!*\
  !*** ./node_modules/autosize/src/autosize.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const map = (typeof Map === "function") ? new Map() : (function () {
	const keys = [];
	const values = [];

	return {
		has(key) {
			return keys.indexOf(key) > -1;
		},
		get(key) {
			return values[keys.indexOf(key)];
		},
		set(key, value) {
			if (keys.indexOf(key) === -1) {
				keys.push(key);
				values.push(value);
			}
		},
		delete(key) {
			const index = keys.indexOf(key);
			if (index > -1) {
				keys.splice(index, 1);
				values.splice(index, 1);
			}
		},
	}
})();

let createEvent = (name)=> new Event(name, {bubbles: true});
try {
	new Event('test');
} catch(e) {
	// IE does not support `new Event()`
	createEvent = (name)=> {
		const evt = document.createEvent('Event');
		evt.initEvent(name, true, false);
		return evt;
	};
}

function assign(ta) {
	if (!ta || !ta.nodeName || ta.nodeName !== 'TEXTAREA' || map.has(ta)) return;

	let heightOffset = null;
	let clientWidth = null;
	let cachedHeight = null;

	function init() {
		const style = window.getComputedStyle(ta, null);

		if (style.resize === 'vertical') {
			ta.style.resize = 'none';
		} else if (style.resize === 'both') {
			ta.style.resize = 'horizontal';
		}

		if (style.boxSizing === 'content-box') {
			heightOffset = -(parseFloat(style.paddingTop)+parseFloat(style.paddingBottom));
		} else {
			heightOffset = parseFloat(style.borderTopWidth)+parseFloat(style.borderBottomWidth);
		}
		// Fix when a textarea is not on document body and heightOffset is Not a Number
		if (isNaN(heightOffset)) {
			heightOffset = 0;
		}

		update();
	}

	function changeOverflow(value) {
		{
			// Chrome/Safari-specific fix:
			// When the textarea y-overflow is hidden, Chrome/Safari do not reflow the text to account for the space
			// made available by removing the scrollbar. The following forces the necessary text reflow.
			const width = ta.style.width;
			ta.style.width = '0px';
			// Force reflow:
			/* jshint ignore:start */
			ta.offsetWidth;
			/* jshint ignore:end */
			ta.style.width = width;
		}

		ta.style.overflowY = value;
	}

	function getParentOverflows(el) {
		const arr = [];

		while (el && el.parentNode && el.parentNode instanceof Element) {
			if (el.parentNode.scrollTop) {
				arr.push({
					node: el.parentNode,
					scrollTop: el.parentNode.scrollTop,
				})
			}
			el = el.parentNode;
		}

		return arr;
	}

	function resize() {
		if (ta.scrollHeight === 0) {
			// If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
			return;
		}

		const overflows = getParentOverflows(ta);
		const docTop = document.documentElement && document.documentElement.scrollTop; // Needed for Mobile IE (ticket #240)

		ta.style.height = '';
		ta.style.height = (ta.scrollHeight+heightOffset)+'px';

		// used to check if an update is actually necessary on window.resize
		clientWidth = ta.clientWidth;

		// prevents scroll-position jumping
		overflows.forEach(el => {
			el.node.scrollTop = el.scrollTop
		});

		if (docTop) {
			document.documentElement.scrollTop = docTop;
		}
	}

	function update() {
		resize();

		const styleHeight = Math.round(parseFloat(ta.style.height));
		const computed = window.getComputedStyle(ta, null);

		// Using offsetHeight as a replacement for computed.height in IE, because IE does not account use of border-box
		var actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(computed.height)) : ta.offsetHeight;

		// The actual height not matching the style height (set via the resize method) indicates that 
		// the max-height has been exceeded, in which case the overflow should be allowed.
		if (actualHeight < styleHeight) {
			if (computed.overflowY === 'hidden') {
				changeOverflow('scroll');
				resize();
				actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(window.getComputedStyle(ta, null).height)) : ta.offsetHeight;
			}
		} else {
			// Normally keep overflow set to hidden, to avoid flash of scrollbar as the textarea expands.
			if (computed.overflowY !== 'hidden') {
				changeOverflow('hidden');
				resize();
				actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(window.getComputedStyle(ta, null).height)) : ta.offsetHeight;
			}
		}

		if (cachedHeight !== actualHeight) {
			cachedHeight = actualHeight;
			const evt = createEvent('autosize:resized');
			try {
				ta.dispatchEvent(evt);
			} catch (err) {
				// Firefox will throw an error on dispatchEvent for a detached element
				// https://bugzilla.mozilla.org/show_bug.cgi?id=889376
			}
		}
	}

	const pageResize = () => {
		if (ta.clientWidth !== clientWidth) {
			update();
		}
	};

	const destroy = (style => {
		window.removeEventListener('resize', pageResize, false);
		ta.removeEventListener('input', update, false);
		ta.removeEventListener('keyup', update, false);
		ta.removeEventListener('autosize:destroy', destroy, false);
		ta.removeEventListener('autosize:update', update, false);

		Object.keys(style).forEach(key => {
			ta.style[key] = style[key];
		});

		map.delete(ta);
	}).bind(ta, {
		height: ta.style.height,
		resize: ta.style.resize,
		overflowY: ta.style.overflowY,
		overflowX: ta.style.overflowX,
		wordWrap: ta.style.wordWrap,
	});

	ta.addEventListener('autosize:destroy', destroy, false);

	// IE9 does not fire onpropertychange or oninput for deletions,
	// so binding to onkeyup to catch most of those events.
	// There is no way that I know of to detect something like 'cut' in IE9.
	if ('onpropertychange' in ta && 'oninput' in ta) {
		ta.addEventListener('keyup', update, false);
	}

	window.addEventListener('resize', pageResize, false);
	ta.addEventListener('input', update, false);
	ta.addEventListener('autosize:update', update, false);
	ta.style.overflowX = 'hidden';
	ta.style.wordWrap = 'break-word';

	map.set(ta, {
		destroy,
		update,
	});

	init();
}

function destroy(ta) {
	const methods = map.get(ta);
	if (methods) {
		methods.destroy();
	}
}

function update(ta) {
	const methods = map.get(ta);
	if (methods) {
		methods.update();
	}
}

let autosize = null;

// Do nothing in Node.js environment and IE8 (or lower)
if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
	autosize = el => el;
	autosize.destroy = el => el;
	autosize.update = el => el;
} else {
	autosize = (el, options) => {
		if (el) {
			Array.prototype.forEach.call(el.length ? el : [el], x => assign(x, options));
		}
		return el;
	};
	autosize.destroy = el => {
		if (el) {
			Array.prototype.forEach.call(el.length ? el : [el], destroy);
		}
		return el;
	};
	autosize.update = el => {
		if (el) {
			Array.prototype.forEach.call(el.length ? el : [el], update);
		}
		return el;
	};
}

/* harmony default export */ __webpack_exports__["default"] = (autosize);


/***/ }),

/***/ "./src/app_data.js":
/*!*************************!*\
  !*** ./src/app_data.js ***!
  \*************************/
/*! exports provided: appData, Task, SortByValues */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "appData", function() { return appData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Task", function() { return Task; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SortByValues", function() { return SortByValues; });
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./storage */ "./src/storage.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./src/util.js");



/**
 * Model for the application. It contains the source of truth for the following:
 * - tasks.
 * - tasksDone.
 * - sortBy.
 *
 * The model uses Storage to:
 * - Save its state to persistence when any of the data changes.
 * - It also attempts to load its state from persistence when it is constructed.
 */
class AppData {
  constructor() {
    /** @type{Array<Task>} */
    this.tasks = [];

    /** @type{string} */
    this.sortBy = SortByValues.Priority;

    /** @type{Array<Task>} */
    this.tasksDone = [];

    /**
     * @type {boolean}
     * @private
     */
    this._showDonePanel = false;

    _storage__WEBPACK_IMPORTED_MODULE_0__["Storage"].load(this);
  }

  get showDonePanel() {
    return this._showDonePanel;
  }

  set showDonePanel(value) {
    this._showDonePanel = value;
    _storage__WEBPACK_IMPORTED_MODULE_0__["Storage"].save(this);
  }

  /**
   * @param {string} value Expected to have a SortByValues.
   */
  saveSortBy(value) {
    this.sortBy = value;
    _storage__WEBPACK_IMPORTED_MODULE_0__["Storage"].save(this);
  }

  /**
   * @param {string} index Value of the data-index attribute.
   */
  markTaskDone(index) {
    this.tasks[index].done = !this.tasks[index].done;
    const checkedTask = this.tasks.splice(index, 1);
    this.tasksDone.push(checkedTask[0]);
    _storage__WEBPACK_IMPORTED_MODULE_0__["Storage"].save(this);
  }

  /**
   * @param {Task} task
   */
  addTask(task) {
    this.tasks.push(task);
    _storage__WEBPACK_IMPORTED_MODULE_0__["Storage"].save(this);
  }

  /**
   * @param {Task} task
   * @return {number} Index of task in tasks array.
   */
  getTaskIndex(task) {
    return appData.tasks.findIndex((element) => element.id === task.id);
  }

  save() {
    _storage__WEBPACK_IMPORTED_MODULE_0__["Storage"].save(this);
  }

  // TODO add editTask (make sure to save)
  // TODO add removeTask (make sure to save)
}

/** Enumeration of valid values for sortBy. */
const SortByValues = {
  Priority: 'Priority',
  Deadline: 'Deadline',
};

class Task {
  /**
   * @param {string} text
   * @param {boolean} done
   * @param {string} priority
   */
  constructor(text, done, priority) {
    /** @type{string} */
    this.text = text;
    /** @type{boolean} */
    this.done = done;
    /** @type{string} */
    this.priority = priority;
    /** @type{string} */
    this.deadline = undefined;
    /** @type{string} */
    this.id = Object(_util__WEBPACK_IMPORTED_MODULE_1__["generateId"])();
  }
}

const appData = new AppData();




/***/ }),

/***/ "./src/edit_task.js":
/*!**************************!*\
  !*** ./src/edit_task.js ***!
  \**************************/
/*! exports provided: markTaskDone, editTaskText, keyboardShortcutToSaveTaskText, changeTaskPriority, addDeadlineToTask, deleteTask, deleteTaskIfTaskTextRemoved */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "markTaskDone", function() { return markTaskDone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "editTaskText", function() { return editTaskText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "keyboardShortcutToSaveTaskText", function() { return keyboardShortcutToSaveTaskText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "changeTaskPriority", function() { return changeTaskPriority; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addDeadlineToTask", function() { return addDeadlineToTask; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteTask", function() { return deleteTask; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteTaskIfTaskTextRemoved", function() { return deleteTaskIfTaskTextRemoved; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/util.js");
/* harmony import */ var _paint_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./paint_ui */ "./src/paint_ui.js");
/* harmony import */ var _app_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app_data */ "./src/app_data.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./index */ "./src/index.js");





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
  if (doneEmptyState) Object(_util__WEBPACK_IMPORTED_MODULE_0__["deleteElementBySelector"])('#empty-stage-done');

  // Repaint the tasks done UI
  _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].markTaskDone(index);
  Object(_paint_ui__WEBPACK_IMPORTED_MODULE_1__["generateListOfTasksDone"])(_app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasksDone);
  Object(_index__WEBPACK_IMPORTED_MODULE_3__["highlightTaskDone"])();
  Object(_paint_ui__WEBPACK_IMPORTED_MODULE_1__["generateListOfTasks"])(_app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks);

  if (_app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks.length === 0) {
    Object(_util__WEBPACK_IMPORTED_MODULE_0__["deleteElementBySelector"])('#tasks-table');
    Object(_paint_ui__WEBPACK_IMPORTED_MODULE_1__["createEmptyStatePlanner"])();
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

  _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks[index].text = text;
  _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].save();
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
  _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks[index].priority = element.value;

  let taskToRearrange;
  const deadlineArrowIcon = document.querySelector('#deadline i');
  const sortedByPriority = !deadlineArrowIcon.classList.contains('visible');
  const sortedByDeadline = deadlineArrowIcon.classList.contains('visible');

  const handleSortedByPriority = () => {
    const taskChanged = _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks[index];
    const priorityOfTheTaskChanged = _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks[index].priority;
    const firstTaskWithSamePriority = _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks.find((task) =>
      task.priority === priorityOfTheTaskChanged &&
        task.id !== taskChanged.id);

    if (firstTaskWithSamePriority !== undefined) {
      taskToRearrange = _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks.splice(index, 1);
      const indexOfDuplicate = _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks.indexOf(firstTaskWithSamePriority);
      _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks.splice(indexOfDuplicate, 0, taskToRearrange[0]);
      Object(_index__WEBPACK_IMPORTED_MODULE_3__["sortTasksBy"])('Priority');
      Object(_index__WEBPACK_IMPORTED_MODULE_3__["highlightTask"])(taskToRearrange[0]);
    } else {
      Object(_index__WEBPACK_IMPORTED_MODULE_3__["sortTasksBy"])('Priority');
      Object(_index__WEBPACK_IMPORTED_MODULE_3__["highlightTask"])(taskChanged);
    }
  };
  if (sortedByPriority) handleSortedByPriority();
  if (sortedByDeadline) _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].save();
};

const addDeadlineToTask = (event) => {
  const element = event.target;
  const index = element.dataset.index;
  if (!element.matches('.deadline-cell input[type="date"]')) return;
  _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks[index].deadline = element.value;

  let taskToRearrange;
  const deadlineArrowIcon = document.querySelector('#deadline i');
  const sortedByDeadline = deadlineArrowIcon.classList.contains('visible');
  const sortedByPriority = !deadlineArrowIcon.classList.contains('visible');

  const handleSortedByDeadline = () => {
    const taskChanged = _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks[index];
    const deadlineOfTheTaskChanged = _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks[index].deadline;
    const firstTaskWithSameDeadline = _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks.find((task) =>
      task.deadline === deadlineOfTheTaskChanged &&
        task.id !== taskChanged.id);

    if (firstTaskWithSameDeadline !== undefined) {
      taskToRearrange = _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks.splice(index, 1);
      const indexOfDuplicate = _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks.indexOf(firstTaskWithSameDeadline);
      _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks.splice(indexOfDuplicate, 0, taskToRearrange[0]);
      Object(_index__WEBPACK_IMPORTED_MODULE_3__["sortTasksBy"])('Deadline');
      Object(_index__WEBPACK_IMPORTED_MODULE_3__["highlightTask"])(taskToRearrange[0]);
    } else {
      Object(_index__WEBPACK_IMPORTED_MODULE_3__["sortTasksBy"])('Deadline');
      Object(_index__WEBPACK_IMPORTED_MODULE_3__["highlightTask"])(taskChanged);
    }
  };

  if (sortedByDeadline) handleSortedByDeadline();
  if (sortedByPriority) _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].save();
};

// Function to delete a task.
const deleteTask = (event) => {
  const element = event.target;
  const index = element.dataset.index;
  if (!element.matches('.icon-cell i.material-icons')) return;

  _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks.splice(`${index}`, 1);
  _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].save();
  Object(_paint_ui__WEBPACK_IMPORTED_MODULE_1__["generateListOfTasks"])(_app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks);
  Object(_paint_ui__WEBPACK_IMPORTED_MODULE_1__["ifNoTasksAddEmptyStateToPlanner"])();
};

const deleteTaskIfTaskTextRemoved = (event) => {
  const element = event.target;
  const text = element.value;
  const index = element.dataset.index;
  if (!element.matches('.text-cell')) return;

  if (text.trim() === '') {
    _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks.splice(index, 1);
    _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].save();
    Object(_paint_ui__WEBPACK_IMPORTED_MODULE_1__["generateListOfTasks"])(_app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks);
    Object(_paint_ui__WEBPACK_IMPORTED_MODULE_1__["ifNoTasksAddEmptyStateToPlanner"])();
  }
  document.querySelector('#add-task').focus();
};





/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: tasksContainer, sortTasksBy, highlightTask, highlightTaskDone, sortTasksOnChange */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tasksContainer", function() { return tasksContainer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sortTasksBy", function() { return sortTasksBy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "highlightTask", function() { return highlightTask; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "highlightTaskDone", function() { return highlightTaskDone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sortTasksOnChange", function() { return sortTasksOnChange; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/util.js");
/* harmony import */ var _app_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app_data */ "./src/app_data.js");
/* harmony import */ var _edit_task__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit_task */ "./src/edit_task.js");
/* harmony import */ var _paint_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./paint_ui */ "./src/paint_ui.js");
// import autosize from 'autosize';

// import autosize from 'autosize/src/autosize';




// Globals.

const formElement = document.querySelector('#form');
const tasksContainer = document.querySelector('#tasks-container');
const doneTasksContainer = document.querySelector('#done-tasks-container');
const checkboxButton = document.querySelector('#checkbox-button');
const backToPlannerButton = document.querySelector('#back-to-planner');

const main = () => {
  generateTodaysDateAndTime();
  Object(_paint_ui__WEBPACK_IMPORTED_MODULE_3__["createEmptyStatePlanner"])();
  Object(_paint_ui__WEBPACK_IMPORTED_MODULE_3__["createEmptyStateDone"])();
  Object(_paint_ui__WEBPACK_IMPORTED_MODULE_3__["initializePlannerUI"])();
  Object(_paint_ui__WEBPACK_IMPORTED_MODULE_3__["initializeDoneUI"])();
  Object(_paint_ui__WEBPACK_IMPORTED_MODULE_3__["handleWindowResize"])();

  window.addEventListener('load', _paint_ui__WEBPACK_IMPORTED_MODULE_3__["generatePageLayout"]);
  formElement.addEventListener('submit', addTask);
  checkboxButton.addEventListener('click', _paint_ui__WEBPACK_IMPORTED_MODULE_3__["showDoneTasks"]);
  backToPlannerButton.addEventListener('click', _paint_ui__WEBPACK_IMPORTED_MODULE_3__["showTasks"]);

  tasksContainer.addEventListener('click', _edit_task__WEBPACK_IMPORTED_MODULE_2__["markTaskDone"]);
  tasksContainer.addEventListener('keyup', _edit_task__WEBPACK_IMPORTED_MODULE_2__["editTaskText"]);
  tasksContainer.addEventListener('keydown', _edit_task__WEBPACK_IMPORTED_MODULE_2__["keyboardShortcutToSaveTaskText"]);
  tasksContainer.addEventListener('change', _edit_task__WEBPACK_IMPORTED_MODULE_2__["changeTaskPriority"]);
  tasksContainer.addEventListener('change', _edit_task__WEBPACK_IMPORTED_MODULE_2__["addDeadlineToTask"]);
  tasksContainer.addEventListener('click', _edit_task__WEBPACK_IMPORTED_MODULE_2__["deleteTask"]);
  tasksContainer.addEventListener('focusout', _edit_task__WEBPACK_IMPORTED_MODULE_2__["deleteTaskIfTaskTextRemoved"]);

  doneTasksContainer.addEventListener('click', markTaskUndone);
  doneTasksContainer.addEventListener('keyup', editTextInDoneTask);
  doneTasksContainer.addEventListener('focusout',
      deleteDoneTaskIfTaskTextRemoved
  );

  window.addEventListener('load', sortTasksOnPageLoad);
  tasksContainer.addEventListener('click', sortTasksOnClick);
  tasksContainer.addEventListener('change', sortTasksOnChange);
};

// Sorting tasks.

const sortTasksOnChange = (event) => {
  const element = event.target;
  if (!element.matches('#sort-by')) return;
  const selected = document.querySelector('#sort-by').value;

  selected === 'Priority' ?
      sortTasksBy(_app_data__WEBPACK_IMPORTED_MODULE_1__["SortByValues"].Priority) : sortTasksBy(_app_data__WEBPACK_IMPORTED_MODULE_1__["SortByValues"].Deadline);
};

/**
 * Function to sort the tasks by priority or deadline.
 */
const sortTasks = () => {
  const deadlineArrowIcon = document.querySelector('#deadline i');
  const sortedByDeadline = deadlineArrowIcon.classList.contains('visible');
  sortedByDeadline ?
      sortTasksBy(_app_data__WEBPACK_IMPORTED_MODULE_1__["SortByValues"].Deadline) : sortTasksBy(_app_data__WEBPACK_IMPORTED_MODULE_1__["SortByValues"].Priority);
};

/**
 * @param {string} value Can be Deadline or Priority.
 */
const sortTasksBy = (value) => {
  const sortByDeadline = () => {
    // Separating tasks without deadline
    const noDeadlineTasks = [];
    const deadlineTasks = [];
    _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasks.forEach((task) => {
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

    _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasks = [...deadlineTasks, ...noDeadlineTasks];

    _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].saveSortBy(value);
    Object(_paint_ui__WEBPACK_IMPORTED_MODULE_3__["generateTableWithHeader"])();
    Object(_paint_ui__WEBPACK_IMPORTED_MODULE_3__["generateListOfTasks"])(_app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasks);
  };

  const sortByPriority = () => {
    // Sort the array by priority.
    _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasks.sort((a, b) => {
      if (a.priority < b.priority) return -1;
      if (a.priority > b.priority) return 1;
      return 0;
    });

    _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].saveSortBy(value);
    Object(_paint_ui__WEBPACK_IMPORTED_MODULE_3__["generateTableWithHeader"])();
    Object(_paint_ui__WEBPACK_IMPORTED_MODULE_3__["generateListOfTasks"])(_app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasks);
  };

  value === _app_data__WEBPACK_IMPORTED_MODULE_1__["SortByValues"].Deadline ? sortByDeadline() : sortByPriority();
};

const sortTasksOnPageLoad = () => {
  if (_app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasks.length === 0) return;
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
    _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].saveSortBy(_app_data__WEBPACK_IMPORTED_MODULE_1__["SortByValues"].Priority);
    Object(_paint_ui__WEBPACK_IMPORTED_MODULE_3__["generateTableWithHeader"])();
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

  const task = new _app_data__WEBPACK_IMPORTED_MODULE_1__["Task"](text, false, 'P2');
  _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].addTask(task);
  formElement.reset();
  Object(_paint_ui__WEBPACK_IMPORTED_MODULE_3__["generateListOfTasks"])(_app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasks);
  highlightTask(task);
};

const highlightTask = (task) => {
  const index = _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].getTaskIndex(task);

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
  const index = _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"]
      .tasksDone.indexOf(_app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasksDone[_app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasksDone.length - 1]);

  // Highlight the task done.
  const gray = 'RGB(151, 191, 56)';
  const white = 'RGB(185, 216, 112)';
  const timeItTakesToAddHighlight = '.3s';
  const timeItTakesToRemoveHighlight = '1.5s';

  const textBox =
      document.querySelector(`.done-text-cell[data-index="${index}"]`);
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
    _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].saveSortBy(_app_data__WEBPACK_IMPORTED_MODULE_1__["SortByValues"].Priority);
    Object(_paint_ui__WEBPACK_IMPORTED_MODULE_3__["generateTableWithHeader"])();
    deadlineArrowIcon = document.querySelector('#deadline i');
  }
  return deadlineArrowIcon;
};

const markTaskUndone = (event) => {
  const element = event.target;
  const index = element.dataset.index;
  if (!element.matches(`img[data-index="${index}"]`)) return;
  _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasksDone[index].done = !_app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasksDone[index].done;

  const deadlineArrowIcon = generateTasksHeader();
  let undoneTask;
  const sortedByDeadline = deadlineArrowIcon.classList.contains('visible');

  const handleSortedByDeadline = () => {
    const deadline = _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasksDone[index].deadline;
    const firstTaskWithSameDeadline =
        _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasks.find((task) => task.deadline === deadline);
    if (firstTaskWithSameDeadline === undefined) {
      undoneTask = _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasksDone.splice(index, 1);
      _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasks.push(undoneTask[0]);
    } else {
      const indexOfDuplicate =
          _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasks.indexOf(firstTaskWithSameDeadline);
      undoneTask = _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasksDone.splice(index, 1);
      _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasks.splice(indexOfDuplicate, 0, undoneTask[0]);
    }
  };

  const handleSortedByPriority = () => {
    const priority = _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasksDone[index].priority;
    const firstTaskWithSamePriority =
        _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasks.find((task) => task.priority === priority);
    if (firstTaskWithSamePriority === undefined) {
      undoneTask = _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasksDone.splice(index, 1);
      _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasks.push(undoneTask[0]);
    } else {
      const indexOfDuplicate = _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasks.indexOf(firstTaskWithSamePriority);
      undoneTask = _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasksDone.splice(index, 1);
      _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasks.splice(indexOfDuplicate, 0, undoneTask[0]);
    }
  };

  sortedByDeadline ? handleSortedByDeadline() : handleSortedByPriority();
  Object(_paint_ui__WEBPACK_IMPORTED_MODULE_3__["generateListOfTasksDone"])(_app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasksDone);
  sortTasks();
  highlightTask(undoneTask[0]);

  if (_app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasksDone.length === 0) {
    Object(_util__WEBPACK_IMPORTED_MODULE_0__["deleteElementBySelector"])('#tasks-done');
    Object(_paint_ui__WEBPACK_IMPORTED_MODULE_3__["createEmptyStateDone"])();
  }
  _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].save();
};

const editTextInDoneTask = (event) => {
  const element = event.target;
  const text = element.value;
  const index = element.dataset.index;
  if (!element.matches('.done-text-cell')) return;

  _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasksDone[index].text = text;
  _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].save();
};

const deleteDoneTaskIfTaskTextRemoved = (event) => {
  const element = event.target;
  const text = element.value;
  const index = element.dataset.index;
  if (!element.matches('.done-text-cell')) return;

  if (text.trim() === '') {
    _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasksDone.splice(index, 1);
    _app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].save();
    Object(_paint_ui__WEBPACK_IMPORTED_MODULE_3__["generateListOfTasksDone"])(_app_data__WEBPACK_IMPORTED_MODULE_1__["appData"].tasksDone);
    Object(_paint_ui__WEBPACK_IMPORTED_MODULE_3__["ifNoCompletedTasksAddEmptyStateToDone"])();
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




/***/ }),

/***/ "./src/paint_ui.js":
/*!*************************!*\
  !*** ./src/paint_ui.js ***!
  \*************************/
/*! exports provided: generateTableWithHeader, generateListOfTasksDone, generateListOfTasks, createEmptyStatePlanner, createEmptyStateDone, ifNoTasksAddEmptyStateToPlanner, ifNoCompletedTasksAddEmptyStateToDone, initializePlannerUI, initializeDoneUI, handleWindowResize, generatePageLayout, showDoneTasks, showTasks */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateTableWithHeader", function() { return generateTableWithHeader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateListOfTasksDone", function() { return generateListOfTasksDone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateListOfTasks", function() { return generateListOfTasks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createEmptyStatePlanner", function() { return createEmptyStatePlanner; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createEmptyStateDone", function() { return createEmptyStateDone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ifNoTasksAddEmptyStateToPlanner", function() { return ifNoTasksAddEmptyStateToPlanner; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ifNoCompletedTasksAddEmptyStateToDone", function() { return ifNoCompletedTasksAddEmptyStateToDone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initializePlannerUI", function() { return initializePlannerUI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initializeDoneUI", function() { return initializeDoneUI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleWindowResize", function() { return handleWindowResize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generatePageLayout", function() { return generatePageLayout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "showDoneTasks", function() { return showDoneTasks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "showTasks", function() { return showTasks; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/util.js");
/* harmony import */ var autosize_src_autosize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! autosize/src/autosize */ "./node_modules/autosize/src/autosize.js");
/* harmony import */ var _app_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app_data */ "./src/app_data.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./index */ "./src/index.js");





/**
 * If some tasks present, return and add a task to the existing table with
 * the next function.
 */
const generateTableWithHeader = () => {
  let tasksTable = document.querySelector('#tasks-table');
  if (!tasksTable) {
    // clear the empty state
    Object(_util__WEBPACK_IMPORTED_MODULE_0__["deleteElementBySelector"])('#empty-stage-planner');

    tasksTable = document.createElement('table');
    tasksTable.setAttribute('id', 'tasks-table');
    _index__WEBPACK_IMPORTED_MODULE_3__["tasksContainer"].appendChild(tasksTable);

    const priorityArrow =
        _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].sortBy === _app_data__WEBPACK_IMPORTED_MODULE_2__["SortByValues"].Priority ? 'visible' : 'hidden';
    const deadlineArrow =
        _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].sortBy === _app_data__WEBPACK_IMPORTED_MODULE_2__["SortByValues"].Deadline ? 'visible' : 'hidden';
    const prioritySelected =
        _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].sortBy === _app_data__WEBPACK_IMPORTED_MODULE_2__["SortByValues"].Priority ? 'selected' : '';
    const deadlineSelected =
        _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].sortBy === _app_data__WEBPACK_IMPORTED_MODULE_2__["SortByValues"].Deadline ? 'selected' : '';
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
  Object(_util__WEBPACK_IMPORTED_MODULE_0__["deleteElementBySelector"])('#tasks-done');

  const table = document.createElement('table');
  table.setAttribute('id', 'tasks-done');
  tasksDoneContainer.appendChild(table);

  const renderTask = (task, index) => {
    return `
      <tr class="task-done" data-index="${index}">
        <td class="chkbx-cell">
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
  Object(autosize_src_autosize__WEBPACK_IMPORTED_MODULE_1__["default"])(tasksDoneTable.querySelectorAll('textarea'));
};

/**
 * @param {Array<Object>} tasksArray this is painted to the screen.
 */
const generateListOfTasks = (tasksArray = []) => {
  const tasksTable = document.querySelector('#tasks-table');

  Object(_util__WEBPACK_IMPORTED_MODULE_0__["deleteElementBySelector"])('#tasks-table > tbody');

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
  Object(autosize_src_autosize__WEBPACK_IMPORTED_MODULE_1__["default"])(tableBody.querySelectorAll('textarea'));
};

/**
 * If no tasks created, then paint the empty state into on planner page.
 */
const createEmptyStatePlanner = () => {
  if (_app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks.length > 0) return;
  const tasksTable = document.querySelector('#tasks-table');
  if (!tasksTable) {
    addEmptyStateToPlanner();
    _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].saveSortBy(_app_data__WEBPACK_IMPORTED_MODULE_2__["SortByValues"].Priority);
  }
};

/**
 * If no tasks completed, then paint the empty state into on done page.
 */
const createEmptyStateDone = () => {
  if (_app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasksDone.length > 0) return;
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
  if (_app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks.length === 0) {
    Object(_util__WEBPACK_IMPORTED_MODULE_0__["deleteElementBySelector"])('#tasks-table');
    createEmptyStatePlanner();
    document.querySelector('#add-task').focus();
  }
};

const ifNoCompletedTasksAddEmptyStateToDone = () => {
  if (_app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasksDone.length === 0) {
    Object(_util__WEBPACK_IMPORTED_MODULE_0__["deleteElementBySelector"])('#tasks-done');
    createEmptyStateDone();
    document.querySelector('#add-task').focus();
  }
};

/**
 * If item(s) in tasks, then generate table with the task(s).
 */
const initializePlannerUI = () => {
  if (_app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks.length === 0) return;
  generateTableWithHeader();
  generateListOfTasks(_app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks);
};

const initializeDoneUI = () => {
  if (_app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasksDone.length === 0) return;
  generateListOfTasksDone(_app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasksDone);
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
};

const showTasks = () => {
  console.log('showTasks eventListener is working');
  _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].showDonePanel = false;
  const doneContainer = document.querySelector('#done-container');
  doneContainer.style.display = 'none';
  const mainContent = document.querySelector('#main-content');
  mainContent.style.display = 'flex';
  mainContent.style.height = '100vh';
  mainContent.style.width = '100%';
  mainContent.style.minWidth = '320px';
};

const showDoneTasks = () => {
  _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].showDonePanel = true;
  // Hide the main content.
  const mainContent = document.querySelector('#main-content');
  mainContent.style.display = 'none';
  // Paint the done tasks UI.
  const doneContainer = document.querySelector('#done-container');
  doneContainer.style.display = 'flex';
  doneContainer.style.height = '100vh';
  doneContainer.style.width = '100%';
  doneContainer.style.minWidth = '320px';
};

const generatePageLayout = () => {
  const mainContent = document.querySelector('#main-content');
  const doneContainer = document.querySelector('#done-container');
  // const checkboxButton = document.querySelector('#checkbox-button');
  // checkboxButton.addEventListener('click', showDoneTasks);

  if (window.matchMedia('(min-width: 801px)').matches) {
    mainContent.style.display = 'flex';
    doneContainer.style.display = 'flex';
  }

  if (window.matchMedia('(max-width: 800px)').matches) {
    if (_app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].showDonePanel) {
      showDoneTasks();
    } else {
      doneContainer.style.display = 'none';
      mainContent.style.display = 'flex';
    }
  }

  if (window.matchMedia('(min-width: 361px)').matches) {
    const tableHeader = document.querySelector('#tasks-table');

    const priorityArrow =
        _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].sortBy === _app_data__WEBPACK_IMPORTED_MODULE_2__["SortByValues"].Priority ? 'visible' : 'hidden';
    const deadlineArrow =
        _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].sortBy === _app_data__WEBPACK_IMPORTED_MODULE_2__["SortByValues"].Deadline ? 'visible' : 'hidden';
    const prioritySelected =
        _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].sortBy === _app_data__WEBPACK_IMPORTED_MODULE_2__["SortByValues"].Priority ? 'selected' : '';
    const deadlineSelected =
        _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].sortBy === _app_data__WEBPACK_IMPORTED_MODULE_2__["SortByValues"].Deadline ? 'selected' : '';

    tableHeader.innerHTML = `
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
    generateListOfTasks(_app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].tasks);
  }

  if (window.matchMedia('(max-width: 360px)').matches) {
    const dropdown = document.querySelector('#sort-by');
    const prioritySelected =
        _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].sortBy === _app_data__WEBPACK_IMPORTED_MODULE_2__["SortByValues"].Priority ? 'selected' : '';
    const deadlineSelected =
        _app_data__WEBPACK_IMPORTED_MODULE_2__["appData"].sortBy === _app_data__WEBPACK_IMPORTED_MODULE_2__["SortByValues"].Deadline ? 'selected' : '';
    dropdown.innerHTML = `
                <option value="Priority" ${prioritySelected}>Priority</option>
                <option value="Deadline" ${deadlineSelected}>Deadline</option>
             `;
  }
};





/***/ }),

/***/ "./src/storage.js":
/*!************************!*\
  !*** ./src/storage.js ***!
  \************************/
/*! exports provided: Storage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Storage", function() { return Storage; });
// import {appData} from './app_data';

const Key = 'appData';

class Storage {
  /**
   * If data is available in local storage, then copy it into appData.
   * @param {AppData} appData
   */
  static load(appData) {
    const dataFromStorage = JSON.parse(localStorage.getItem(Key));
    if (!dataFromStorage) return;
    Object.assign(appData, dataFromStorage);
  }

  /**
   * @param {AppData} appData
   */
  static save(appData) {
    localStorage.setItem(Key, JSON.stringify(appData));
  }
}




/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/*! exports provided: deleteElementBySelector, generateId */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteElementBySelector", function() { return deleteElementBySelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateId", function() { return generateId; });
const deleteElementBySelector = (selector) => {
  if (!selector) return;
  const divToRemove = document.querySelector(selector);
  if (!divToRemove) return;
  divToRemove.parentNode.removeChild(divToRemove);
};

const generateId = () =>{
  const date = new Date().getTime().toString();
  const randomNumber = (Math.random() * 1000).toString();
  return date + randomNumber;
};




/***/ })

/******/ });
//# sourceMappingURL=main.js.map