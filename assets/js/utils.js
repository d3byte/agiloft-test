const TaskEvent = function (sender) {
  this._sender = sender;
  this._listeners = [];
}

TaskEvent.prototype = {
  attach: function (listener) {
    this._listeners.push(listener);
  },

  notify: function (args) {
    for (let i = 0; i < this._listeners.length; i += 1) {
      this._listeners[i](this._sender, args);
    }
  }
}

const sanitizeHTML = function (str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

const getRandom = function (min, max) {
  return Math.random() * (max - min) + min;
}

const shuffleArray = function(array) {
  for(let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array;
}

const randomId = function(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
