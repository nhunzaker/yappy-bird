var Promise = require('es6-promise').Promise;

var Dispatcher = function() {
  this._callbacks = [];
};

Dispatcher.prototype = {

  register: function (actionType, callback) {
    var dispatcher = this;

    if (typeof actionType === 'object') {
      return Object.keys(actionType).map(function(type) {
        dispatcher.register(type, actionType[type]);
      });
    }

    this._callbacks.push({
      actionType : actionType,
      behavior   : callback
    });

    return this._callbacks.length - 1;
  },

  dispatch: function(actionType, payload) {
    var _promises = [];

    this._callbacks.forEach(function(callback) {
      if (callback.actionType === actionType) {
        _promises.push(callback.behavior(payload));
      }
    });

    return Promise.all(_promises).catch(function(error) {
      console.error(error);
    });
  }
};

module.exports = Dispatcher;
