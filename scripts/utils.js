import { toggleTheme,
  toggleThemeImg,
  app,
  body,
  emptyList,
  taskName,
  tasksList,
  itemsNumber,
  allTasksButtons,
  activeTaskButtons,
  clearCompletedTaskButtons,
  completedTaskButtons,} from "./elements.js";

let isDarkTheme = false;
let taskCounter = parseInt(localStorage.getItem('taskCounter')) || 0;

export const toggleDarkMode = () => {
  isDarkTheme = !isDarkTheme;
  isDarkTheme ? darkTheme() : lightTheme();
  saveModeToLocalStorage(isDarkTheme);
}
toggleTheme.addEventListener('click', toggleDarkMode);
toggleTheme.addEventListener('keydown', toggleDarkMode);

export const darkTheme = () => {
  toggleThemeImg.src = './public/images/icon-sun.svg';
  app.style.backgroundImage = 'url("./public/images/bg-desktop-dark.jpg")';
  body.classList.add('dark__theme');
};

export const lightTheme = () => {
  toggleThemeImg.src = './public/images/icon-moon.svg';
  app.style.backgroundImage = 'url("./public/images/bg-desktop-light.jpg")';
  body.classList.remove('dark__theme');
};

export const addTask = (taskValue) => {
  taskCounter++;
  const taskId = `task-${taskCounter}`;
  const newTaskString = createTaskHTML(taskId, taskValue);
  taskName.value = "";
  tasksList.insertAdjacentHTML('beforeend', newTaskString);
  const taskItem = document.getElementById(taskId);
  attachTaskEvents(taskItem, taskId);
  saveTaskToLocalStorage(taskId, taskValue, false);
  localStorage.setItem('taskCounter', taskCounter.toString());
  setItemsNumber();
  checkEmptyList();
};

const createTaskHTML = (taskId, taskValue) => {
  return `<li class="task__item" id="${taskId}" draggable="true">
    <input type="checkbox"  id="toggletask-checkbox-${taskId}" class="toggle__task-checkbox" value="${taskId}">
    <label for="toggletask-checkbox-${taskId}" class="toggle__task-label"> 
    <img class ='toggle__task-img' src= './public/images/icon-check.svg'/></label>
    <p class="taskValue">${taskValue}</p>
    <img class='delete-icon' src='./public/images/icon-cross.svg' /> 
  </li>`
}
const attachTaskEvents = (taskItem, taskId) => {
  const finishedTaskButton = taskItem.querySelector('.toggle__task-checkbox');
  finishedTaskButton.addEventListener('click', () => {
    taskItem.classList.toggle('finished');
    setCompletedStyle(finishedTaskButton, taskItem);
    updateTaskInLocalStorage(taskId, taskItem.querySelector('.taskValue').textContent, taskItem.classList.contains('finished'));
    setItemsNumber();
  });
  const deleteIcon = taskItem.querySelector('.delete-icon');
  deleteIcon.addEventListener('click', () => {
    deleteTask(taskItem, taskId);
  });
};

const saveModeToLocalStorage = (isDarkTheme) => {
  localStorage.setItem("isDarkFlag", JSON.stringify(isDarkTheme));
};
const deleteTask = (taskItem, taskId) => {
  const isConfirmed = confirm('Are you sure you want to remove this task?');
  if (isConfirmed) {
    tasksList.removeChild(taskItem);
    removeTaskFromLocalStorage(taskId);
    taskCounter--;
    localStorage.setItem('taskCounter', taskCounter.toString());
    setItemsNumber();
    const remainingTasks = document.querySelectorAll('.task__item');
    remainingTasks.forEach((task, index) => {
      const oldTaskId = task.id;
      const newTaskId = `task-${index + 1}`;
      task.id = newTaskId;
      const taskData = JSON.parse(localStorage.getItem(oldTaskId));
      if (taskData) {
        localStorage.removeItem(oldTaskId);
        localStorage.setItem(newTaskId, JSON.stringify(taskData));
      }
    });
    checkEmptyList();
  }
};

const toggleActiveButton = (clickedButton) => {
  const activeButtons = document.querySelectorAll('.active-button');
  activeButtons.forEach(button => {
    button.classList.remove('active-button');
  });
  clickedButton.classList.add('active-button');
};

allTasksButtons.forEach(button => {
  button.addEventListener('click', () => {
    toggleActiveButton(button);
    button.classList.add('active-button');
    const allTasks = tasksList.querySelectorAll('.task__item');
    allTasks.forEach(taskItem => {
      taskItem.style.display = '';
    });
    checkEmptyList();
  });
});

activeTaskButtons.forEach(button => {
  button.addEventListener('click', () => {
    toggleActiveButton(button);
    button.classList.add('active-button');
    const allTasks = tasksList.querySelectorAll('.task__item');
    allTasks.forEach(taskItem => {
      if (taskItem.classList.contains('finished')) {
        taskItem.style.display = 'none';
      } else {
        taskItem.style.display = '';
      }
    });
    checkEmptyList();
  });
});


completedTaskButtons.forEach(button => {
  button.addEventListener('click', () => {
    toggleActiveButton(button);
    button.classList.add('active-button');
    const allTasks = tasksList.querySelectorAll('.task__item');
    allTasks.forEach(taskItem => {
      taskItem.style.display = !taskItem.classList.contains('finished') ? 'none' : '';
    });
    checkEmptyList();
  });
});

clearCompletedTaskButtons.forEach(button => {
  button.addEventListener('click', () => {
    toggleActiveButton(button);
    const clearCompletedTasks = tasksList.querySelectorAll('.finished');
    clearCompletedTasks.forEach(taskItem => {
      const taskId = taskItem.id;
      tasksList.removeChild(taskItem);
      removeTaskFromLocalStorage(taskId);
      taskCounter--;
      localStorage.setItem('taskCounter', taskCounter.toString());

      const remainingTasks = document.querySelectorAll('.task__item');
      remainingTasks.forEach((task, index) => {
        const oldTaskId = task.id;
        const newTaskId = `task-${index + 1}`;
        task.id = newTaskId;
        const taskData = JSON.parse(localStorage.getItem(oldTaskId));
        if (taskData) {
          localStorage.removeItem(oldTaskId);
          localStorage.setItem(newTaskId, JSON.stringify(taskData));
        }
      });
    });
    setItemsNumber();
    checkEmptyList();
  });
});
export const loadDataFromLocalStorage = () => {
  const theme = JSON.parse(localStorage.getItem("isDarkFlag"));
  theme ? darkTheme() : lightTheme();
  for (let i = 1; i <= taskCounter; i++) {
    const taskId = `task-${i}`;
    const taskData = JSON.parse(localStorage.getItem(taskId));
    if (taskData) {
      const newTaskString = createTaskHTML(taskId, taskData.value);
      tasksList.insertAdjacentHTML('beforeend', newTaskString);
      const taskItem = document.getElementById(taskId);
      if (taskData.finished) {
        taskItem.classList.add('finished');
      }
      attachTaskEvents(taskItem, taskId);
    }
  }
  checkEmptyList();
};

const checkEmptyList = () => {
  const taskItems = document.querySelectorAll('.task__item');
  emptyList.style.display = taskItems.length > 0 ? 'none' : 'block';
};

const saveTaskToLocalStorage = (taskId, taskValue, isFinished) => {
  localStorage.setItem(taskId, JSON.stringify({ value: taskValue, finished: isFinished }));
};


const removeTaskFromLocalStorage = (taskId) => {
  localStorage.removeItem(taskId);
};

export const setItemsNumber = () => {
  const unfinishedTasks = document.querySelectorAll('.task__item:not(.finished)');
  itemsNumber.innerText = unfinishedTasks.length;
};

const setCompletedStyle = (finishedTaskButton, taskItem) => {
  const toggleImg = taskItem.querySelector('.toggle__task-img');
  finishedTaskButton.checked = taskItem.classList.contains('finished');
  toggleImg.style.display = finishedTaskButton.checked ? 'block' : 'none';
};



const updateTaskInLocalStorage = (taskId, taskValue, isFinished) => {
  localStorage.setItem(taskId, JSON.stringify({ value: taskValue, finished: isFinished }));
};

const dragStart = (e) => {
  e.dataTransfer.setData('text/plain', e.target.id);
};

const dragOver = (e) => {
  e.preventDefault();
};

const drop = (e) => {
  e.preventDefault();
  const taskId = e.dataTransfer.getData('text/plain');
  const taskItem = document.getElementById(taskId);
  const tasks = document.querySelectorAll('.task__item');
  const targetIndex = Array.from(tasks).indexOf(e.target.closest('.task__item'));
  const currentIndex = Array.from(tasks).indexOf(taskItem);

  if (currentIndex < targetIndex) {
    e.target.closest('.task__item').after(taskItem);
  } else {
    e.target.closest('.task__item').before(taskItem);
  }
  console.log({currentIndex});
  console.log({targetIndex});
  reorderTasks(currentIndex, targetIndex);
};


const reorderTasks = (currentIndex, targetIndex) => {
const originalKey = `task-${currentIndex + 1}`;
const secondKey = `task-${targetIndex + 1}`;

const originalKeyValue = JSON.parse(localStorage.getItem(originalKey));
const secondKeyValue = JSON.parse(localStorage.getItem(secondKey));
const tempValue = originalKeyValue;

 localStorage.setItem(originalKey, JSON.stringify(secondKeyValue));
 localStorage.setItem(secondKey,  JSON.stringify(tempValue));
}


export const enableDragAndDrop = () => {
  const tasks = document.querySelectorAll('.task__item');
  tasks.forEach(task => {
    task.addEventListener('dragstart', dragStart);
    task.addEventListener('dragover', dragOver);
    task.addEventListener('drop', drop);
  });
};
