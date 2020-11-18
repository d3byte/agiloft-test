1. Installation

Unpack the attached archive
Deploy the folder on any web server and open http(s)://<host>/bugfix-frontend/ in Firefox/Chrome/Edge/Safari.

This is a one page client side app that allows to create, request, manage (complete/delete actions),
and stores tasks (using the browser's localStorage).

2. Task goals

The main task is to extend the application by adding:
 a) Priority attribute (Low, Medium, High) for each new task and be able to sort and filter the list by priority.
    You may add 'taskPriority=["low","medium","high"]' parameter in the request to filltext.com for new tasks
 b) fallback to TasksController.requestTasks method, so new requested tasks are taken from 'assets/data/tasks.json',
    if filltext.com service is down (done)

Any UI/UX improvements are welcomed too, although not required.

The new code should also be implemented within MVC paradigm.
You may use ES2015, as well as jQuery, Lodash/Underscore if needed. Using other frameworks/libraries is possible,
but you have to explain their use.

The secondary task is to test the application/review sources to find any obvious bugs.

The bugs must be reported for the following categories:

Functional bugs
Security bugs
Code design bugs
Scalability/performance bugs
Code style issues

This task is supposed to take less than one working day (8 hours)
Please document how long each stage took (development/testing/review)
