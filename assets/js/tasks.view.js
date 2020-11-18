const TaskView = function (model) {
  this.model = model;
  this.addTaskEvent = new TaskEvent(this);
  this.selectTaskEvent = new TaskEvent(this);
  this.unselectTaskEvent = new TaskEvent(this);
  this.completeTaskEvent = new TaskEvent(this);
  this.deleteTaskEvent = new TaskEvent(this);
  this.saveTasksEvent = new TaskEvent(this);
  this.loadTasksEvent = new TaskEvent(this);
  this.requestTasksEvent = new TaskEvent(this);
  this.sortTasksEvent = new TaskEvent(this);
  this.filterTasksEvent = new TaskEvent(this);
  this.curView = null;

  this.init();
};

TaskView.prototype = {
  init: function () {
    this.createChildren()
        .updateView()
        .setupHandlers()
        .enable();
  },

  createChildren: function () {
    this.wrapper = document.getElementById('wrapper');
    this.addTaskButtonElem = this.wrapper.querySelector('.app-add-task-button');
    this.taskTextBox = this.wrapper.querySelector('.app-task-textbox');
    this.addTaskPriority = this.wrapper.querySelector('.add-task-priority');
    this.sortTasksSelect = this.wrapper.querySelector('.sort-by-priority');
    this.filterTasksSelect = this.wrapper.querySelector('.filter-by-priority');
    this.tasksWrapper = this.wrapper.querySelector('.app-tasks-wrapper');

    return this;
  },

  updateView: function () {
    const curTasks = this.model.getTasks();
    this.curView = this.setCurView(this);

    return this;
  },

  setupHandlers: function () {
    this.addTaskButtonHandler = this.addTaskButton.bind(this);
    this.selectOrUnselectTaskHandler = this.selectOrUnselectTask.bind(this);
    this.completeTaskButtonHandler = this.completeTaskButton.bind(this);
    this.deleteTaskButtonHandler = this.deleteTaskButton.bind(this);
    this.saveTasksButtonHandler = this.saveTasksButton.bind(this);
    this.requestTasksButtonHandler = this.requestTasksButton.bind(this);
    this.sortTasksHandler = this.handleSortTaskSelect.bind(this);
    this.filterTasksHandler = this.handleFilterTaskSelect.bind(this);

    this.addTaskHandler = this.addTask.bind(this);
    this.clearTaskTextBoxHandler = this.clearTaskTextBox.bind(this);
    this.setTasksAsCompletedHandler = this.setTasksAsCompleted.bind(this);
    this.deleteTasksHandler = this.deleteTasks.bind(this);
    this.saveTasksHandler = this.saveTasks.bind(this);
    this.loadTasksHandler = this.loadTasks.bind(this);
    this.addNewTasksHandler = this.addNewTasks.bind(this);

    return this;
  },

  enable: function () {
    this.addTaskButtonElem.addEventListener('click', this.addTaskButtonHandler);
    this.tasksWrapper.addEventListener('click', this.selectOrUnselectTaskHandler);
    this.wrapper.querySelector('.app-complete-task-button').addEventListener('click', this.completeTaskButtonHandler);
    this.wrapper.querySelector('.app-delete-task-button').addEventListener('click', this.deleteTaskButtonHandler);
    this.wrapper.querySelector('.app-save-tasks-button').addEventListener('click', this.saveTasksButtonHandler);
    this.wrapper.querySelector('.app-request-tasks-button').addEventListener('click', this.requestTasksButtonHandler);
    this.sortTasksSelect.addEventListener('change', this.sortTasksHandler);
    this.filterTasksSelect.addEventListener('change', this.filterTasksHandler);

    this.model.addTaskEvent.attach(this.addTaskHandler);
    this.model.addTaskEvent.attach(this.clearTaskTextBoxHandler);
    this.model.setTasksAsCompletedEvent.attach(this.setTasksAsCompletedHandler);
    this.model.deleteTasksEvent.attach(this.deleteTasksHandler);
    this.model.saveTasksEvent.attach(this.saveTasksHandler);
    this.model.loadTasksEvent.attach(this.loadTasksHandler);
    this.model.addNewTasksEvent.attach(this.addNewTasksHandler);
    this.model.sortTasksEvent.attach(this.addNewTasksHandler);
    this.model.filterTasksEvent.attach(this.addNewTasksHandler);

    return this;
  },

  getLabelElement: function (task) {
    const labelElement = document.createElement('label');
    labelElement.classList.add('app-label-task');

    if (task.taskStatus === 'completed') {
      labelElement.classList.add('completed');
    }

    return labelElement;
  },

  getAuthorElement: function (task) {
    const authorElement = document.createElement('i');

    authorElement.classList.add('gray');
    authorElement.textContent = ' (' + task.taskAuthor + ')';

    return authorElement;
  },

  getInputElement: function (task) {
    const inputElement = document.createElement('input');

    inputElement.type = 'checkbox';
    inputElement.classList.add('app-task');
    inputElement.classList.add('mr-3');
    inputElement.setAttribute('data-task-id', task.taskId);
    inputElement.setAttribute('data-task-selected', 'false');

    return inputElement;
  },

  getPriorityElement: function (task) {
    const priorityElement = document.createElement('span');
    priorityElement.textContent = task.taskPriority
    priorityElement.classList.add('ml-3');

    switch (task.taskPriority) {
      case 'low':
        priorityElement.classList.add('text-success');
        break;
      case 'medium':
        priorityElement.classList.add('text-warning');
        break;
      case 'high':
        priorityElement.classList.add('text-danger');
        break;
    }

    return priorityElement;
  },

  render: function () {
    const tasks = this.model.getTasks();

    const tasksWrapper = this.tasksWrapper;
    tasksWrapper.innerHTML = '';

    for (let task in tasks) {
      const taskElement = document.createElement('div');
      const labelElement = this.getLabelElement(tasks[task]);
      const inputElement = this.getInputElement(tasks[task]);

      if (task != tasks.length - 1) {
        labelElement.classList.add('mb-3');
      } else {
        labelElement.classList.add('mb-4');
      }

      labelElement.textContent = sanitizeHTML(tasks[task].taskDesc);

      labelElement.prepend(inputElement);

      if (tasks[task].taskAuthor) {
        labelElement.appendChild(this.getAuthorElement(tasks[task]));
      }

      labelElement.appendChild(this.getPriorityElement(tasks[task]));

      taskElement.appendChild(labelElement);

      tasksWrapper.innerHTML += taskElement.innerHTML;
    }
  },

  setCurView: function () {
    this.curView = this;
  },

  handleSortTaskSelect: function () {
    this.sortTasksEvent.notify({
      priority: this.sortTasksSelect.value,
    });
  },

  handleFilterTaskSelect: function () {
    this.filterTasksEvent.notify({
      priority: this.filterTasksSelect.value,
    });
  },

  addTaskButton: function () {
    this.addTaskEvent.notify({
      priority: this.addTaskPriority.value,
      description: this.taskTextBox.value,
      author: ''
    });
  },

  completeTaskButton: function () {
    this.completeTaskEvent.notify();
  },

  deleteTaskButton: function () {
    this.deleteTaskEvent.notify();
  },

  saveTasksButton: function () {
    this.saveTasksEvent.notify();
  },

  requestTasksButton: function () {
    this.requestTasksEvent.notify();
  },

  selectOrUnselectTask: function (event) {
    if (event.target.classList.contains('app-task')) {
      const targetElem = event.target;
      const taskId = targetElem.getAttribute("data-task-id");

      if (targetElem.getAttribute('data-task-selected') === 'false') {
        targetElem.setAttribute('data-task-selected', true);
        this.selectTaskEvent.notify({
            taskId: taskId
        });
      } else {
        targetElem.setAttribute('data-task-selected', false);
        this.unselectTaskEvent.notify({
            taskId: taskId
        });
      }
    }
  },

  clearTaskTextBox: function () {
    this.taskTextBox.value = '';
  },

  addTask: function () {
    this.render();
  },

  setTasksAsCompleted: function () {
    this.render();
  },

  deleteTasks: function () {
    this.render();
  },

  loadTasks: function () {
    this.model.loadTasks();
    this.render();
  },

  saveTasks: function () {
    const notifyElem = this.wrapper.querySelector('.app-save-notify');
    notifyElem.style.display='block';
    setTimeout(function() {
      notifyElem.style.display='none';
    }, 2000);
  },

  addNewTasks: function () {
    this.render();
  }
};
