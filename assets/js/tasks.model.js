const TaskModel = function (items) {
  this.untouchedTasks = items.slice(0);
  this.tasks = items.slice(0);
  this.selectedTasks = [];
  this.activeFilter = '';
  this.activeSort = '';

  this.addTaskEvent = new TaskEvent(this);
  this.setTasksAsCompletedEvent = new TaskEvent(this);
  this.deleteTasksEvent = new TaskEvent(this);
  this.saveTasksEvent = new TaskEvent(this);
  this.loadTasksEvent = new TaskEvent(this);
  this.addNewTasksEvent = new TaskEvent(this);
  this.sortTasksEvent = new TaskEvent(this);
  this.filterTasksEvent = new TaskEvent(this);
};

TaskModel.prototype = {
  getTasks: function () {
    return this.tasks;
  },

  getTaskIndex: function(taskId) {
    let taskIndex;

    for (let i = 0; i < this.untouchedTasks.length; i++) {
      if (this.untouchedTasks[i].taskId === taskId) {
        taskIndex = i;
      }
    }

    return taskIndex;
  },

  addTask: function (task) {
    this.untouchedTasks.unshift({
      taskId: randomId(25),
      taskDesc: task.description,
      taskAuthor: task.author,
      taskPriority: task.priority,
      taskStatus: 'uncompleted'
    });

    this.tasks = this.untouchedTasks.slice(0);

    this.handleActiveFiltersAndSorts();

    this.selectedTasks = [];
    this.addTaskEvent.notify();
  },

  setSelectedTask: function (taskId) {
    this.selectedTasks.push(taskId);
  },

  unselectTask: function (taskId) {
    this.selectedTasks = this.selectedTasks.filter(function (id) { return id != taskId });
  },

  setTasksAsCompleted: function () {
    const selectedTasks = this.selectedTasks.slice(0);

    for (let index in selectedTasks) {
      this.untouchedTasks[this.getTaskIndex(selectedTasks[index])].taskStatus = 'completed';
    }

    this.tasks = this.untouchedTasks.slice(0);

    this.handleActiveFiltersAndSorts();

    this.selectedTasks = [];
    this.setTasksAsCompletedEvent.notify();
  },

  deleteTasks: function () {
    const selectedTasks = this.selectedTasks.slice(0);

    for (let i in selectedTasks) {
      this.untouchedTasks.splice(this.getTaskIndex(selectedTasks[i]), 1);
    }

    this.tasks = this.untouchedTasks.slice(0);

    this.handleActiveFiltersAndSorts();

    this.selectedTasks = [];
    this.deleteTasksEvent.notify();
  },

  sortTasks: function (priority) {
    this.activeSort = priority;

    if (!priority) {
      this.tasks = this.untouchedTasks.slice(0);
    } else {
      this.tasks = this.untouchedTasks
          .slice(0)
          .sort(function (a) {
            if (priority == a.taskPriority) {
              return -1;
            }
            return 0;
          });
    }

    this.sortTasksEvent.notify();
  },

  filterTasks: function (priority) {
    this.activeFilter = priority;

    if (!priority) {
      this.tasks = this.untouchedTasks.slice(0);
    } else {
      this.tasks = this.untouchedTasks.filter(function (task) { return task.taskPriority == priority });
    }

    this.filterTasksEvent.notify();
  },

  saveTasks: function () {
    localStorage.setItem('$tasks', JSON.stringify(this.untouchedTasks));
    this.selectedTasks = [];
    this.saveTasksEvent.notify();
  },

  loadTasks: function () {
    const dataStr = localStorage.getItem("$tasks");
    try {
      this.untouchedTasks = dataStr ? JSON.parse(dataStr) : [];
      this.tasks = this.untouchedTasks.slice(0);
    } catch (error) {
      localStorage.removeItem('$tasks');
      this.tasks = [];
      this.untouchedTasks = [];
    }
  },

  handleActiveFiltersAndSorts: function () {
    if (this.activeFilter) {
      this.filterTasks(this.activeFilter);
    }

    if (this.activeSort) {
      this.sortTasks(this.activeSort);
    }
  },

  addNewTasks: function(newTasks) {
    const presentTasksIds = this.getTasks().map(function(task) { return task.taskId });
    const handledTasks = newTasks.filter(function(task) { return !presentTasksIds.includes(task.taskId); });

    this.untouchedTasks.unshift.apply(this.untouchedTasks, handledTasks);
    this.tasks = this.untouchedTasks.slice(0);

    this.handleActiveFiltersAndSorts();

    this.addNewTasksEvent.notify();
  }
};
