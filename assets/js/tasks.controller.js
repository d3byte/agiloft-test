const TaskController = function (model, view) {
  this.model = model;
  this.view = view;

  this.init();
};

TaskController.prototype = {

  init: function () {
    this.createChildren()
        .setupHandlers()
        .enable();
  },

  createChildren: function () {
    this.view.loadTasks();
    this.view.render();
    return this;
  },

  setupHandlers: function () {
    this.addTaskHandler = this.addTask.bind(this);
    this.selectTaskHandler = this.selectTask.bind(this);
    this.unselectTaskHandler = this.unselectTask.bind(this);
    this.completeTaskHandler = this.completeTask.bind(this);
    this.deleteTaskHandler = this.deleteTask.bind(this);
    this.saveTasksHandler = this.saveTasks.bind(this);
    this.requestTasksHandler = this.requestTasks.bind(this);
    this.sortTasksHandler = this.sortTasks.bind(this);
    this.filterTasksHandler = this.filterTasks.bind(this);

    return this;
  },

  enable: function () {
    this.view.addTaskEvent.attach(this.addTaskHandler);
    this.view.completeTaskEvent.attach(this.completeTaskHandler);
    this.view.deleteTaskEvent.attach(this.deleteTaskHandler);
    this.view.selectTaskEvent.attach(this.selectTaskHandler);
    this.view.unselectTaskEvent.attach(this.unselectTaskHandler);
    this.view.saveTasksEvent.attach(this.saveTasksHandler);
    this.view.requestTasksEvent.attach(this.requestTasksHandler);
    this.view.sortTasksEvent.attach(this.sortTasksHandler);
    this.view.filterTasksEvent.attach(this.filterTasksHandler);

    return this;
  },

  addTask: function (sender, args) {
    if (!args.description.trim().length)
    alert('Please add some description text');
    else this.model.addTask.bind(this.model)(args);
  },

  selectTask: function (sender, args) {
    this.model.setSelectedTask.bind(this.model)(args.taskId);
  },

  unselectTask: function (sender, args) {
    this.model.unselectTask.bind(this.model)(args.taskId);
  },

  completeTask: function () {
    if (this.model.selectedTasks.length)
      this.model.setTasksAsCompleted.bind(this.model)();
  },

  deleteTask: function () {
    if (this.model.selectedTasks.length > 0 && confirm("Are you sure you want to delete this item(s)?"))
      this.model.deleteTasks.bind(this.model)();
  },

  sortTasks: function (sender, args) {
    this.model.sortTasks(args.priority);
  },

  filterTasks: function (sender, args) {
    this.model.filterTasks(args.priority);
  },

  saveTasks: function () {
    this.model.saveTasks.bind(this.model)();
  },

  requestTasks: function () {
    const request = this.getData(
        'http://www.filltext.com?rows=' + getRandom(1, 5)
        + '&taskId={string|' + 25
        + '}&taskDesc={lorem|' + getRandom(1, 6)
        + '}&taskAuthor={username}&taskStatus=uncompleted'
        + '&taskPriority=["low","medium","high"]',
        this.model.addNewTasks,
        this.model,
    );

    const handleErrorOrTimeout = function () {
      this.getData(
          '/assets/data/tasks.json',
          function (response) {
            const tasksToAdd = shuffleArray(response).slice(0, getRandom(1, 5));
            this.model.addNewTasks.bind(this.model)(tasksToAdd);
          },
          this
      );
    };

    request.ontimeout = handleErrorOrTimeout.bind(this);
    request.onerror = handleErrorOrTimeout.bind(this);
  },

  getData: function(url, callback, context = this) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState != 4 || request.status != 200) return;
      callback.bind(context)(JSON.parse(request.responseText));
    };
    request.open("GET", url, true);
    request.send();
    return request;
  }
};
