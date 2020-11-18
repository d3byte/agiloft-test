# Sergey Savtyra`s coding test

I saved the compatibility with Internet Explorer and other legacy browser and did not
use any extra frameworks and libraries for solving the test.

## Time taken

* Development – 1.5h
* Testing – 2h
* Review – 0.5h

## Bugs

### Functional bugs

* When getting tasks, they are randomly sliced from 0 to 3, which has
a chance not to draw any received task. I fixed it by making it
getRandom(1, 5).
* Currently, new added tasks have no priority, so I added priority 
selection for the task creation.
* In addTask method of Tasks Model, new task is pushed to the end of
tasks array. It is potentially bad UX for the user, as in case he has
hundreds of tasks, it`ll be hard to find the new one. I fixed it
by using "unshift" instead of "push"
* In deleteTask method of Tasks Controller, there was a comparison of
selected tasks length with 1. It is a bug, because in such case user is
unable to delete only one task. 

### Security bugs

* Saving tasks in localstorage – they can be modified anytime without accessing
UI, so it may lead to application break, so I added a try/catch construction
to clear $tasks item of localStorage to prevent app breaking.

### Code design bugs
* In method addNewTasks of Tasks Model, I changed usages of global var
`model` to `this.` syntax to avoid referencing a global var. 
* Some variables are declared without using any declaration word 
(var, let, const). I fixed it.
* In render method of Tasks View, I changed hard to read infinite
`innerHTML`s to appendChild and made several functions for creating
elements of task and kept only one innerHTML to keep the performance. 
* In index.html, view was directly called, but it has to be done via controller.

### Scalability/performance bugs

* By default, tasks did not have any ID, which can lead to potential 
bugs as using index for identifying tasks is not robust. I added a 
new property "id" to tasks that is a randomly generated string of 
25 symbols.
* getData function of Tasks Controller does not return anything, so
I decided to return the entity of XMLHttpRequest, so we`ll be able
to handle different events of the request. For example, abort it.

### Code style issues

* In task controller, getData method is based locally for requestTasks
function, which makes no sense. I moved it to a separate function, so
in case we need to make other requests, we already have a function for
creating these. 
* Changed all vars to const and let to make it more clear for developers
what can be re-assigned and what can`t.
* In tasks view, in render method, there is an unnecessary usage if 
variable i; 
