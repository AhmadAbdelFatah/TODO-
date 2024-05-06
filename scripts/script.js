import {taskName, addTaskButton,
} from './elements.js';

import {addTask, loadDataFromLocalStorage, setItemsNumber, enableDragAndDrop} from './utils.js'


taskName.focus();
addTaskButton.addEventListener('click', (e) => {
  e.preventDefault();
  const taskValue = taskName.value.trim();
  if (taskValue === "") {
    alert('Please enter a task before adding it.');
    return;
  }
  addTask(taskValue);
});


window.addEventListener('load', () => {
  loadDataFromLocalStorage();
  setItemsNumber();
  enableDragAndDrop();
});
