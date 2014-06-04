(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @jsx React.DOM */var Promise = require('es6-promise').Promise;

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

},{"es6-promise":8}],2:[function(require,module,exports){
/** @jsx React.DOM */var Promise = require('es6-promise').Promise;

module.exports = function preload (src) {
	if (Array.isArray(src)) {
		return Promise.all(src.map(preload));
	}

	return new Promise(function(resolve, reject) {
		var img = new Image();

		img.onload = function() {
			resolve(img);
		};

		img.onerror = function() {
			reject(new Error("Image " + src + " failed to load."))
		}

		img.src = src;
	});
};

},{"es6-promise":8}],3:[function(require,module,exports){
/** @jsx React.DOM */module.exports = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

},{}],4:[function(require,module,exports){
/** @jsx React.DOM */var Emitter = require("events").EventEmitter;
var merge   = require('react/lib/merge');
var CHANGE  = 'change';

var Store = merge(Emitter.prototype, {
	CHANGE: CHANGE,

	get:function(key) {
		return key? this._data[key] : this._data;
	},

	set:function(key, value) {
		this._data[key] = value;
		this.emitChange();
	},

	clone:function(props) {
		return merge(props, this);
	},

	emitChange:function(type, payload) {
		this.emit(CHANGE, type, payload);
	},

	onChange:function(callback) {
		this.on(CHANGE, callback);
	},

	offChange:function(callback) {
		this.removeListener(CHANGE, callback);
	}
});

module.exports = Store;

},{"events":6,"react/lib/merge":20}],5:[function(require,module,exports){
/** @jsx React.DOM */
	function Vector(x, y) {"use strict";
		this.x = x;
		this.y = y;
	}

	Vector.prototype.add=function(vector) {"use strict";
		this.x += vector.x;
		this.y += vector.y;

		return this;
	};

	Vector.prototype.sub=function(vector) {"use strict";
		this.x -= vector.x;
		this.y -= vector.y;

		return this;
	};

	Vector.prototype.mult=function(n) {"use strict";
		this.x *= n;
		this.y *= n;

		return this;
	};

	Vector.prototype.div=function(n) {"use strict";
		this.x = this.x / n;
		this.y = this.y / n;

		return this;
	};

	Vector.prototype.mag=function() {"use strict";
		var var$1 = this, x = var$1.x, y = var$1.y;
		return Math.sqrt(x * x + y * y);
	};

	Vector.prototype.limit=function(high) {"use strict";
		if (this.mag() > high) {
			this.normalize();
			this.mult(high);
		}

		return this;
	};

	Vector.prototype.normalize=function() {"use strict";
		var m = this.mag();
		if (m > 0) {
			this.div(m);
		}
		return this;
	};

	Vector.sub=function (v1, v2) {"use strict";
		return new Vector(v1.x - v2.x, v1.y - v2.y);
	};


module.exports = Vector;

},{}],6:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        throw TypeError('Uncaught, unspecified "error" event.');
      }
      return false;
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],7:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],8:[function(require,module,exports){
"use strict";
var Promise = require("./promise/promise").Promise;
var polyfill = require("./promise/polyfill").polyfill;
exports.Promise = Promise;
exports.polyfill = polyfill;
},{"./promise/polyfill":12,"./promise/promise":13}],9:[function(require,module,exports){
"use strict";
/* global toString */

var isArray = require("./utils").isArray;
var isFunction = require("./utils").isFunction;

/**
  Returns a promise that is fulfilled when all the given promises have been
  fulfilled, or rejected if any of them become rejected. The return promise
  is fulfilled with an array that gives all the values in the order they were
  passed in the `promises` array argument.

  Example:

  ```javascript
  var promise1 = RSVP.resolve(1);
  var promise2 = RSVP.resolve(2);
  var promise3 = RSVP.resolve(3);
  var promises = [ promise1, promise2, promise3 ];

  RSVP.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `RSVP.all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  var promise1 = RSVP.resolve(1);
  var promise2 = RSVP.reject(new Error("2"));
  var promise3 = RSVP.reject(new Error("3"));
  var promises = [ promise1, promise2, promise3 ];

  RSVP.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @for RSVP
  @param {Array} promises
  @param {String} label
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
*/
function all(promises) {
  /*jshint validthis:true */
  var Promise = this;

  if (!isArray(promises)) {
    throw new TypeError('You must pass an array to all.');
  }

  return new Promise(function(resolve, reject) {
    var results = [], remaining = promises.length,
    promise;

    if (remaining === 0) {
      resolve([]);
    }

    function resolver(index) {
      return function(value) {
        resolveAll(index, value);
      };
    }

    function resolveAll(index, value) {
      results[index] = value;
      if (--remaining === 0) {
        resolve(results);
      }
    }

    for (var i = 0; i < promises.length; i++) {
      promise = promises[i];

      if (promise && isFunction(promise.then)) {
        promise.then(resolver(i), reject);
      } else {
        resolveAll(i, promise);
      }
    }
  });
}

exports.all = all;
},{"./utils":17}],10:[function(require,module,exports){
(function (process,global){
"use strict";
var browserGlobal = (typeof window !== 'undefined') ? window : {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var local = (typeof global !== 'undefined') ? global : (this === undefined? window:this);

// node
function useNextTick() {
  return function() {
    process.nextTick(flush);
  };
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function() {
    node.data = (iterations = ++iterations % 2);
  };
}

function useSetTimeout() {
  return function() {
    local.setTimeout(flush, 1);
  };
}

var queue = [];
function flush() {
  for (var i = 0; i < queue.length; i++) {
    var tuple = queue[i];
    var callback = tuple[0], arg = tuple[1];
    callback(arg);
  }
  queue = [];
}

var scheduleFlush;

// Decide what async method to use to triggering processing of queued callbacks:
if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else {
  scheduleFlush = useSetTimeout();
}

function asap(callback, arg) {
  var length = queue.push([callback, arg]);
  if (length === 1) {
    // If length is 1, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    scheduleFlush();
  }
}

exports.asap = asap;
}).call(this,require("FWaASH"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"FWaASH":7}],11:[function(require,module,exports){
"use strict";
var config = {
  instrument: false
};

function configure(name, value) {
  if (arguments.length === 2) {
    config[name] = value;
  } else {
    return config[name];
  }
}

exports.config = config;
exports.configure = configure;
},{}],12:[function(require,module,exports){
(function (global){
"use strict";
/*global self*/
var RSVPPromise = require("./promise").Promise;
var isFunction = require("./utils").isFunction;

function polyfill() {
  var local;

  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof window !== 'undefined' && window.document) {
    local = window;
  } else {
    local = self;
  }

  var es6PromiseSupport = 
    "Promise" in local &&
    // Some of these methods are missing from
    // Firefox/Chrome experimental implementations
    "resolve" in local.Promise &&
    "reject" in local.Promise &&
    "all" in local.Promise &&
    "race" in local.Promise &&
    // Older version of the spec had a resolver object
    // as the arg rather than a function
    (function() {
      var resolve;
      new local.Promise(function(r) { resolve = r; });
      return isFunction(resolve);
    }());

  if (!es6PromiseSupport) {
    local.Promise = RSVPPromise;
  }
}

exports.polyfill = polyfill;
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./promise":13,"./utils":17}],13:[function(require,module,exports){
"use strict";
var config = require("./config").config;
var configure = require("./config").configure;
var objectOrFunction = require("./utils").objectOrFunction;
var isFunction = require("./utils").isFunction;
var now = require("./utils").now;
var all = require("./all").all;
var race = require("./race").race;
var staticResolve = require("./resolve").resolve;
var staticReject = require("./reject").reject;
var asap = require("./asap").asap;

var counter = 0;

config.async = asap; // default async is asap;

function Promise(resolver) {
  if (!isFunction(resolver)) {
    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
  }

  if (!(this instanceof Promise)) {
    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
  }

  this._subscribers = [];

  invokeResolver(resolver, this);
}

function invokeResolver(resolver, promise) {
  function resolvePromise(value) {
    resolve(promise, value);
  }

  function rejectPromise(reason) {
    reject(promise, reason);
  }

  try {
    resolver(resolvePromise, rejectPromise);
  } catch(e) {
    rejectPromise(e);
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value, error, succeeded, failed;

  if (hasCallback) {
    try {
      value = callback(detail);
      succeeded = true;
    } catch(e) {
      failed = true;
      error = e;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (handleThenable(promise, value)) {
    return;
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (failed) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    resolve(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

var PENDING   = void 0;
var SEALED    = 0;
var FULFILLED = 1;
var REJECTED  = 2;

function subscribe(parent, child, onFulfillment, onRejection) {
  var subscribers = parent._subscribers;
  var length = subscribers.length;

  subscribers[length] = child;
  subscribers[length + FULFILLED] = onFulfillment;
  subscribers[length + REJECTED]  = onRejection;
}

function publish(promise, settled) {
  var child, callback, subscribers = promise._subscribers, detail = promise._detail;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    invokeCallback(settled, child, callback, detail);
  }

  promise._subscribers = null;
}

Promise.prototype = {
  constructor: Promise,

  _state: undefined,
  _detail: undefined,
  _subscribers: undefined,

  then: function(onFulfillment, onRejection) {
    var promise = this;

    var thenPromise = new this.constructor(function() {});

    if (this._state) {
      var callbacks = arguments;
      config.async(function invokePromiseCallback() {
        invokeCallback(promise._state, thenPromise, callbacks[promise._state - 1], promise._detail);
      });
    } else {
      subscribe(this, thenPromise, onFulfillment, onRejection);
    }

    return thenPromise;
  },

  'catch': function(onRejection) {
    return this.then(null, onRejection);
  }
};

Promise.all = all;
Promise.race = race;
Promise.resolve = staticResolve;
Promise.reject = staticReject;

function handleThenable(promise, value) {
  var then = null,
  resolved;

  try {
    if (promise === value) {
      throw new TypeError("A promises callback cannot return that same promise.");
    }

    if (objectOrFunction(value)) {
      then = value.then;

      if (isFunction(then)) {
        then.call(value, function(val) {
          if (resolved) { return true; }
          resolved = true;

          if (value !== val) {
            resolve(promise, val);
          } else {
            fulfill(promise, val);
          }
        }, function(val) {
          if (resolved) { return true; }
          resolved = true;

          reject(promise, val);
        });

        return true;
      }
    }
  } catch (error) {
    if (resolved) { return true; }
    reject(promise, error);
    return true;
  }

  return false;
}

function resolve(promise, value) {
  if (promise === value) {
    fulfill(promise, value);
  } else if (!handleThenable(promise, value)) {
    fulfill(promise, value);
  }
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) { return; }
  promise._state = SEALED;
  promise._detail = value;

  config.async(publishFulfillment, promise);
}

function reject(promise, reason) {
  if (promise._state !== PENDING) { return; }
  promise._state = SEALED;
  promise._detail = reason;

  config.async(publishRejection, promise);
}

function publishFulfillment(promise) {
  publish(promise, promise._state = FULFILLED);
}

function publishRejection(promise) {
  publish(promise, promise._state = REJECTED);
}

exports.Promise = Promise;
},{"./all":9,"./asap":10,"./config":11,"./race":14,"./reject":15,"./resolve":16,"./utils":17}],14:[function(require,module,exports){
"use strict";
/* global toString */
var isArray = require("./utils").isArray;

/**
  `RSVP.race` allows you to watch a series of promises and act as soon as the
  first promise given to the `promises` argument fulfills or rejects.

  Example:

  ```javascript
  var promise1 = new RSVP.Promise(function(resolve, reject){
    setTimeout(function(){
      resolve("promise 1");
    }, 200);
  });

  var promise2 = new RSVP.Promise(function(resolve, reject){
    setTimeout(function(){
      resolve("promise 2");
    }, 100);
  });

  RSVP.race([promise1, promise2]).then(function(result){
    // result === "promise 2" because it was resolved before promise1
    // was resolved.
  });
  ```

  `RSVP.race` is deterministic in that only the state of the first completed
  promise matters. For example, even if other promises given to the `promises`
  array argument are resolved, but the first completed promise has become
  rejected before the other promises became fulfilled, the returned promise
  will become rejected:

  ```javascript
  var promise1 = new RSVP.Promise(function(resolve, reject){
    setTimeout(function(){
      resolve("promise 1");
    }, 200);
  });

  var promise2 = new RSVP.Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error("promise 2"));
    }, 100);
  });

  RSVP.race([promise1, promise2]).then(function(result){
    // Code here never runs because there are rejected promises!
  }, function(reason){
    // reason.message === "promise2" because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  @method race
  @for RSVP
  @param {Array} promises array of promises to observe
  @param {String} label optional string for describing the promise returned.
  Useful for tooling.
  @return {Promise} a promise that becomes fulfilled with the value the first
  completed promises is resolved with if the first completed promise was
  fulfilled, or rejected with the reason that the first completed promise
  was rejected with.
*/
function race(promises) {
  /*jshint validthis:true */
  var Promise = this;

  if (!isArray(promises)) {
    throw new TypeError('You must pass an array to race.');
  }
  return new Promise(function(resolve, reject) {
    var results = [], promise;

    for (var i = 0; i < promises.length; i++) {
      promise = promises[i];

      if (promise && typeof promise.then === 'function') {
        promise.then(resolve, reject);
      } else {
        resolve(promise);
      }
    }
  });
}

exports.race = race;
},{"./utils":17}],15:[function(require,module,exports){
"use strict";
/**
  `RSVP.reject` returns a promise that will become rejected with the passed
  `reason`. `RSVP.reject` is essentially shorthand for the following:

  ```javascript
  var promise = new RSVP.Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  var promise = RSVP.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @for RSVP
  @param {Any} reason value that the returned promise will be rejected with.
  @param {String} label optional string for identifying the returned promise.
  Useful for tooling.
  @return {Promise} a promise that will become rejected with the given
  `reason`.
*/
function reject(reason) {
  /*jshint validthis:true */
  var Promise = this;

  return new Promise(function (resolve, reject) {
    reject(reason);
  });
}

exports.reject = reject;
},{}],16:[function(require,module,exports){
"use strict";
function resolve(value) {
  /*jshint validthis:true */
  if (value && typeof value === 'object' && value.constructor === this) {
    return value;
  }

  var Promise = this;

  return new Promise(function(resolve) {
    resolve(value);
  });
}

exports.resolve = resolve;
},{}],17:[function(require,module,exports){
"use strict";
function objectOrFunction(x) {
  return isFunction(x) || (typeof x === "object" && x !== null);
}

function isFunction(x) {
  return typeof x === "function";
}

function isArray(x) {
  return Object.prototype.toString.call(x) === "[object Array]";
}

// Date.now is not available in browsers < IE9
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now#Compatibility
var now = Date.now || function() { return new Date().getTime(); };


exports.objectOrFunction = objectOrFunction;
exports.isFunction = isFunction;
exports.isArray = isArray;
exports.now = now;
},{}],18:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition) {
  if (!condition) {
    var error = new Error(
      'Minified exception occured; use the non-minified dev environment for ' +
      'the full error message and additional helpful warnings.'
    );
    error.framesToPop = 1;
    throw error;
  }
};

if ("production" !== process.env.NODE_ENV) {
  invariant = function(condition, format, a, b, c, d, e, f) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }

    if (!condition) {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      var error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.framesToPop = 1; // we don't care about invariant's own frame
      throw error;
    }
  };
}

module.exports = invariant;

}).call(this,require("FWaASH"))
},{"FWaASH":7}],19:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule keyMirror
 * @typechecks static-only
 */

"use strict";

var invariant = require("./invariant");

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
var keyMirror = function(obj) {
  var ret = {};
  var key;
  ("production" !== process.env.NODE_ENV ? invariant(
    obj instanceof Object && !Array.isArray(obj),
    'keyMirror(...): Argument must be an object.'
  ) : invariant(obj instanceof Object && !Array.isArray(obj)));
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
};

module.exports = keyMirror;

}).call(this,require("FWaASH"))
},{"./invariant":18,"FWaASH":7}],20:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule merge
 */

"use strict";

var mergeInto = require("./mergeInto");

/**
 * Shallow merges two structures into a return value, without mutating either.
 *
 * @param {?object} one Optional object with properties to merge from.
 * @param {?object} two Optional object with properties to merge from.
 * @return {object} The shallow extension of one by two.
 */
var merge = function(one, two) {
  var result = {};
  mergeInto(result, one);
  mergeInto(result, two);
  return result;
};

module.exports = merge;

},{"./mergeInto":22}],21:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule mergeHelpers
 *
 * requiresPolyfills: Array.isArray
 */

"use strict";

var invariant = require("./invariant");
var keyMirror = require("./keyMirror");

/**
 * Maximum number of levels to traverse. Will catch circular structures.
 * @const
 */
var MAX_MERGE_DEPTH = 36;

/**
 * We won't worry about edge cases like new String('x') or new Boolean(true).
 * Functions are considered terminals, and arrays are not.
 * @param {*} o The item/object/value to test.
 * @return {boolean} true iff the argument is a terminal.
 */
var isTerminal = function(o) {
  return typeof o !== 'object' || o === null;
};

var mergeHelpers = {

  MAX_MERGE_DEPTH: MAX_MERGE_DEPTH,

  isTerminal: isTerminal,

  /**
   * Converts null/undefined values into empty object.
   *
   * @param {?Object=} arg Argument to be normalized (nullable optional)
   * @return {!Object}
   */
  normalizeMergeArg: function(arg) {
    return arg === undefined || arg === null ? {} : arg;
  },

  /**
   * If merging Arrays, a merge strategy *must* be supplied. If not, it is
   * likely the caller's fault. If this function is ever called with anything
   * but `one` and `two` being `Array`s, it is the fault of the merge utilities.
   *
   * @param {*} one Array to merge into.
   * @param {*} two Array to merge from.
   */
  checkMergeArrayArgs: function(one, two) {
    ("production" !== process.env.NODE_ENV ? invariant(
      Array.isArray(one) && Array.isArray(two),
      'Tried to merge arrays, instead got %s and %s.',
      one,
      two
    ) : invariant(Array.isArray(one) && Array.isArray(two)));
  },

  /**
   * @param {*} one Object to merge into.
   * @param {*} two Object to merge from.
   */
  checkMergeObjectArgs: function(one, two) {
    mergeHelpers.checkMergeObjectArg(one);
    mergeHelpers.checkMergeObjectArg(two);
  },

  /**
   * @param {*} arg
   */
  checkMergeObjectArg: function(arg) {
    ("production" !== process.env.NODE_ENV ? invariant(
      !isTerminal(arg) && !Array.isArray(arg),
      'Tried to merge an object, instead got %s.',
      arg
    ) : invariant(!isTerminal(arg) && !Array.isArray(arg)));
  },

  /**
   * Checks that a merge was not given a circular object or an object that had
   * too great of depth.
   *
   * @param {number} Level of recursion to validate against maximum.
   */
  checkMergeLevel: function(level) {
    ("production" !== process.env.NODE_ENV ? invariant(
      level < MAX_MERGE_DEPTH,
      'Maximum deep merge depth exceeded. You may be attempting to merge ' +
      'circular structures in an unsupported way.'
    ) : invariant(level < MAX_MERGE_DEPTH));
  },

  /**
   * Checks that the supplied merge strategy is valid.
   *
   * @param {string} Array merge strategy.
   */
  checkArrayStrategy: function(strategy) {
    ("production" !== process.env.NODE_ENV ? invariant(
      strategy === undefined || strategy in mergeHelpers.ArrayStrategies,
      'You must provide an array strategy to deep merge functions to ' +
      'instruct the deep merge how to resolve merging two arrays.'
    ) : invariant(strategy === undefined || strategy in mergeHelpers.ArrayStrategies));
  },

  /**
   * Set of possible behaviors of merge algorithms when encountering two Arrays
   * that must be merged together.
   * - `clobber`: The left `Array` is ignored.
   * - `indexByIndex`: The result is achieved by recursively deep merging at
   *   each index. (not yet supported.)
   */
  ArrayStrategies: keyMirror({
    Clobber: true,
    IndexByIndex: true
  })

};

module.exports = mergeHelpers;

}).call(this,require("FWaASH"))
},{"./invariant":18,"./keyMirror":19,"FWaASH":7}],22:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule mergeInto
 * @typechecks static-only
 */

"use strict";

var mergeHelpers = require("./mergeHelpers");

var checkMergeObjectArg = mergeHelpers.checkMergeObjectArg;

/**
 * Shallow merges two structures by mutating the first parameter.
 *
 * @param {object} one Object to be merged into.
 * @param {?object} two Optional object with properties to merge from.
 */
function mergeInto(one, two) {
  checkMergeObjectArg(one);
  if (two != null) {
    checkMergeObjectArg(two);
    for (var key in two) {
      if (!two.hasOwnProperty(key)) {
        continue;
      }
      one[key] = two[key];
    }
  }
}

module.exports = mergeInto;

},{"./mergeHelpers":21}],23:[function(require,module,exports){
/** @jsx React.DOM */var State = require('../state');

module.exports = {
	play:function() {
		State.dispatch('GAME_PLAY');
	},

	pause:function() {
		State.dispatch('GAME_PAUSE');
	},

	toggle:function() {
		State.dispatch('GAME_TOGGLE');
	},

	lost:function() {
		State.dispatch('GAME_LOST');
	}
};

},{"../state":28}],24:[function(require,module,exports){
/** @jsx React.DOM */var State = require('../state');

module.exports = {
	jump: function() {
		State.dispatch('PLAYER_JUMP');
	}
};

},{"../state":28}],25:[function(require,module,exports){
/** @jsx React.DOM */var Game = require('./stores/game');
var Scene = require('./views/scene');
var State = require('./state');
var World = require('./stores/world');

require('./listeners/keyboard');
//require('./listeners/microphone');

(function loop () {
	if (Game.get('playing') && !Game.get('hasLost')) State.dispatch('GLOBAL_UPDATE');
	requestAnimationFrame(loop);
}())

},{"./listeners/keyboard":27,"./state":28,"./stores/game":31,"./stores/world":33,"./views/scene":37}],26:[function(require,module,exports){
/** @jsx React.DOM */module.exports = {
	ESCAPE: 27,
	UP: 38
};

},{}],27:[function(require,module,exports){
/** @jsx React.DOM */var PlayerActions = require('../actions/player');
var GameActions = require('../actions/game');
var Keys = require('../constants/keys');

var UP = Keys.UP, ESCAPE = Keys.ESCAPE;

window.addEventListener('keyup', function(e)  {
	switch (e.which) {
		case UP:
			PlayerActions.jump();
			break;
		case ESCAPE:
			GameActions.toggle();
			break;
	}
});

},{"../actions/game":23,"../actions/player":24,"../constants/keys":26}],28:[function(require,module,exports){
/** @jsx React.DOM */var Dispatcher = require('../lib/dispatcher');
module.exports = new Dispatcher();

},{"../lib/dispatcher":1}],29:[function(require,module,exports){
/** @jsx React.DOM */var Store  = require('../../lib/store')
var State  = require('../state');
var Vector = require('../../lib/vector');

var gravity = new Vector(0, 0.15);

var Player = Store.clone({
	_data: {
		accel    : new Vector(0, 0),
		height   : 24,
		maxSpeed : 6,
		location : new Vector(100, window.innerHeight / 2),
		velocity : new Vector(0, 0),
		width    : 34
	},

	update: function() {
		var var$5 = this._data, accel = var$5.accel, location = var$5.location, maxSpeed = var$5.maxSpeed, velocity = var$5.velocity;

		accel.add(gravity);

		velocity.add(accel);
		location.add(velocity);
		accel.mult(0);

		velocity.limit(maxSpeed);
	},

	jump: function() {
		var var$6 = this._data, velocity = var$6.velocity, accel = var$6.accel;

		velocity.y = Math.min(velocity.y, 0);

		accel.add(new Vector(0, -2))
	}
});

State.register({
	PLAYER_JUMP: function() {
		Player.jump();
	},

	GLOBAL_UPDATE: function() {
		Player.update();
	}
});

module.exports = Player;

},{"../../lib/store":4,"../../lib/vector":5,"../state":28}],30:[function(require,module,exports){
/** @jsx React.DOM */var Store = require('../../lib/store');
var Player = require('./Player');

var HEIGHT = window.innerHeight;
var WIDTH = window.innerWidth;
var ROWS = 40;
var COLS = 10;
var SCALEX = 500;
var SCALEY = HEIGHT / COLS;

var _data = {
	blocks : [],
	cols   : COLS,
	height : HEIGHT,
	map    : [],
	rows   : ROWS,
	scaleX : SCALEX,
	scaleY : SCALEY,
	width  : WIDTH
}

var offset = 800;
var separation = 300;
var pipeWidth = 40;

for (var x = 0; x < ROWS; x++) {
	var opening = Math.random() * (HEIGHT / 2) | 0

	_data.blocks.push({
		height: opening,
		width: pipeWidth,
		x: offset + x * separation,
		y: 0
	});

	_data.blocks.push({
		height: HEIGHT - (opening + 200),
		width: pipeWidth,
		x: offset + x * separation,
		y: opening + 170
	});
}

var Blocks = Store.clone({
	_data: _data,

	totalWidth: function() {
		return ROWS * SCALEX + SCALEY;
	}
});

module.exports = Blocks;

},{"../../lib/store":4,"./Player":29}],31:[function(require,module,exports){
/** @jsx React.DOM */var Store = require('../../lib/store');
var State = require('../state');

var Game = Store.clone({
	_data: {
		lost    : false,
		playing : false,
		scroll  : 0
	},

	play:function() {
		Game.set('playing', true);
	},

	pause:function() {
		Game.set('playing', false);
	},

	toggle:function() {
		Game.set('playing', !Game.get('playing'));
	},

	update:function() {
		Game.set('scroll', Game.get('scroll') + 3);
	}
});

State.register({
	GAME_PLAY:function() {
		Game.play();
	},

	GAME_PAUSE:function() {
		Game.pause();
	},

	GAME_TOGGLE:function() {
		Game.toggle();
	},

	GAME_LOST:function() {
		Game.set('lost', Date.now());
	},

	GLOBAL_UPDATE:function() {
		Game.update();
	}
});

module.exports = Game;

},{"../../lib/store":4,"../state":28}],32:[function(require,module,exports){
/** @jsx React.DOM */var Store  = require('../../lib/store')
var State  = require('../state');
var Vector = require('../../lib/vector');

var gravity = new Vector(0, 0.15);

var Player = Store.clone({
	_data: {
		accel    : new Vector(0, 0),
		height   : 24,
		maxSpeed : 6,
		location : new Vector(100, window.innerHeight / 2),
		velocity : new Vector(0, 0),
		width    : 34
	},

	update: function() {
		var var$2 = this._data, accel = var$2.accel, location = var$2.location, maxSpeed = var$2.maxSpeed, velocity = var$2.velocity;

		accel.add(gravity);

		velocity.add(accel);
		location.add(velocity);
		accel.mult(0);

		velocity.limit(maxSpeed);
	},

	jump: function() {
		var var$3 = this._data, velocity = var$3.velocity, accel = var$3.accel;

		velocity.y = Math.min(velocity.y, 0);

		accel.add(new Vector(0, -2))
	}
});

State.register({
	PLAYER_JUMP: function() {
		Player.jump();
	},

	GLOBAL_UPDATE: function() {
		Player.update();
	}
});

module.exports = Player;

},{"../../lib/store":4,"../../lib/vector":5,"../state":28}],33:[function(require,module,exports){
/** @jsx React.DOM */var Store  = require('../../lib/store');
var State  = require('../state');
var Vector = require('../../lib/vector');

var Player = require('./player');
var Game   = require('./game');
var Blocks = require('./blocks');

var GameActions = require('../actions/game');

var World = Store.clone({
	_data: {
		gravity      : new Vector(0, 0.5),
		elevation    : 112,
		windowHeight : window.innerHeight,
		windowWidth  : window.innerWidth
	},

	update: function() {
		if (this.checkCollisions()) GameActions.lost();
	},

	checkCollisions: function() {
		var var$0 = Player.get(), location = var$0.location, width = var$0.width, height = var$0.height;
		var x = location.x, y = location.y;
		var blocks = Blocks.get('blocks');
		var scroll = Game.get('scroll');

		if (y > this.get('windowHeight') - this.get('elevation')) return true;

		for (var i = 0, len = blocks.length; i < len; i++) {
			var b = blocks[i];

			if (x + width < b.x - scroll)     continue;
			if (x > (b.x + b.width) - scroll) continue;
			if (y + height < b.y)             continue;
			if (y > b.y + b.height)           continue;

			return true;
		}
	}
});

State.register({
	GLOBAL_UPDATE: function() {
		World.update();
	}
});

module.exports = World;

},{"../../lib/store":4,"../../lib/vector":5,"../actions/game":23,"../state":28,"./blocks":30,"./game":31,"./player":32}],34:[function(require,module,exports){
/** @jsx React.DOM */var World = require('../stores/world');
var Game = require('../stores/game');

var landLoaded = false;
var land = new Image();
land.onload = function() {
	landLoaded = true;
};
land.src = "assets/land.png";

module.exports = {
	draw:function(ctx, width, height) {
		if (!landLoaded) return;
		ctx.save();

		var elevation = World.get('elevation');

		ctx.save();
		ctx.translate(-Game.get('scroll'), height - elevation);

		var landPattern = ctx.createPattern(land, 'repeat');
		ctx.beginPath();
		ctx.rect(0, 0, width + Game.get('scroll'), elevation);
		ctx.fillStyle = landPattern;
		ctx.fill();
		ctx.restore();
	}
};

},{"../stores/game":31,"../stores/world":33}],35:[function(require,module,exports){
/** @jsx React.DOM */var Blocks = require("../stores/blocks");
var Game   = require('../stores/game');
var World  = require('../stores/world');

module.exports = {
	draw:function(ctx, width, height) {
		var elevation = World.get('elevation');
		var scroll = Game.get('scroll');
		ctx.save();

		ctx.translate(-scroll, 0);

		ctx.fillStyle = "#69BF4C";
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#543A46";

		Blocks.get('blocks').forEach(function(entity) {
			var x = entity.x, y = entity.y, width = entity.width, height = entity.height;

			if (World.get('debug')) {
				ctx.save();
				ctx.fillStyle = "#fff"
				ctx.font = "24px monospace";
				ctx.textAlign = 'center';
				ctx.fillText((x - scroll) + ',' + y, x + 15, y - 10);
				ctx.restore();
			}

			ctx.fillRect(x, y, width, height)
			ctx.strokeRect(x, y, width, height)
		});

		ctx.restore();
 	}
};

},{"../stores/blocks":30,"../stores/game":31,"../stores/world":33}],36:[function(require,module,exports){
/** @jsx React.DOM */var Player      = require("../stores/player");
var imageLoader = require('../../lib/imageLoader');

var preload = imageLoader([
	'/assets/bird-01.png',
	'/assets/bird-02.png',
	'/assets/bird-03.png',
	'/assets/bird-04.png'
]);

module.exports = {
	frame    : 0,
	frames   : 3,
	interval : 100,
	then     : Date.now(),

	draw: function(ctx) {
		var var$15 = Player.get(), height = var$15.height, location = var$15.location, width = var$15.width;

		preload.then(function(images) {
			ctx.save();
			var now  = Date.now();

			if (now - this.then > this.interval) {
				this.frame = this.frame >= this.frames? 0 : this.frame + 1;
				this.then = now;
			}
			ctx.drawImage(images[this.frame], location.x, location.y);

			ctx.restore();
		}.bind(this));
	}
};

},{"../../lib/imageLoader":2,"../stores/player":32}],37:[function(require,module,exports){
/** @jsx React.DOM */var requestAnimationFrame = require('../../lib/requestAnimationFrame');

var Player = require('../stores/player');
var Game   = require('../stores/game');
var Blocks = require('../stores/blocks');
var World  = require('../stores/world');

var PlayerActions = require('../actions/player');
var GameActions   = require('../actions/game');
var PlayerView    = require('./player');
var MapView       = require('./map');

var canvas    = document.getElementById('canvas');
var ctx       = canvas.getContext('2d');
canvas.width  = Blocks.get('width');
canvas.height = Blocks.get('height');

var Land = require('./land');
var Sky  = require('./sky');

function draw() {
	ctx.save();

	var width = canvas.width, height = canvas.height;
	var scroll = Game.get('scroll');

	ctx.clearRect(0, 0, width, height);

	Sky.draw(ctx, width, height);
	PlayerView.draw(ctx);
	MapView.draw(ctx, width, height);
	Land.draw(ctx, width, height);

	var isPlaying = Game.get('playing');
	var hasLost = Game.get('lost');

	if (!isPlaying || hasLost) {
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, width, height)

		ctx.font = "36pt Monospace";
		ctx.textAlign = "center";
		ctx.fillStyle = "#fff";
		ctx.fillText(hasLost ? "GAME OVER" : "PAUSED", width / 2, height / 2);
	}

	ctx.restore();
}

var frame = requestAnimationFrame(function loop() {
	frame = requestAnimationFrame(loop);
	draw();
});

},{"../../lib/requestAnimationFrame":3,"../actions/game":23,"../actions/player":24,"../stores/blocks":30,"../stores/game":31,"../stores/player":32,"../stores/world":33,"./land":34,"./map":35,"./player":36,"./sky":38}],38:[function(require,module,exports){
/** @jsx React.DOM */var World = require('../stores/world');

var skyLoaded = false;
var sky = new Image();
sky.onload = function() {
	skyLoaded = true;
};
sky.src = "assets/sky.png";

module.exports = {
	draw: function(ctx, width, height) {
		if (!skyLoaded) return;
		ctx.save();

		var elevation = World.get('elevation');

		ctx.save();
		ctx.translate(0, (height - elevation) - sky.height);

		var skyPattern = ctx.createPattern(sky, 'repeat');
		ctx.beginPath();
		ctx.rect(0, 0, width, sky.height);
		ctx.fillStyle = skyPattern;
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}
};

},{"../stores/world":33}]},{},[25])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbmF0aGFuaWVsaHVuemFrZXIvRGVza3RvcC95YXBweV9iaXJkL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbmF0aGFuaWVsaHVuemFrZXIvRGVza3RvcC95YXBweV9iaXJkL2xpYi9kaXNwYXRjaGVyLmpzIiwiL1VzZXJzL25hdGhhbmllbGh1bnpha2VyL0Rlc2t0b3AveWFwcHlfYmlyZC9saWIvaW1hZ2VMb2FkZXIuanMiLCIvVXNlcnMvbmF0aGFuaWVsaHVuemFrZXIvRGVza3RvcC95YXBweV9iaXJkL2xpYi9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUuanMiLCIvVXNlcnMvbmF0aGFuaWVsaHVuemFrZXIvRGVza3RvcC95YXBweV9iaXJkL2xpYi9zdG9yZS5qcyIsIi9Vc2Vycy9uYXRoYW5pZWxodW56YWtlci9EZXNrdG9wL3lhcHB5X2JpcmQvbGliL3ZlY3Rvci5qcyIsIi9Vc2Vycy9uYXRoYW5pZWxodW56YWtlci9EZXNrdG9wL3lhcHB5X2JpcmQvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCIvVXNlcnMvbmF0aGFuaWVsaHVuemFrZXIvRGVza3RvcC95YXBweV9iaXJkL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCIvVXNlcnMvbmF0aGFuaWVsaHVuemFrZXIvRGVza3RvcC95YXBweV9iaXJkL25vZGVfbW9kdWxlcy9lczYtcHJvbWlzZS9kaXN0L2NvbW1vbmpzL21haW4uanMiLCIvVXNlcnMvbmF0aGFuaWVsaHVuemFrZXIvRGVza3RvcC95YXBweV9iaXJkL25vZGVfbW9kdWxlcy9lczYtcHJvbWlzZS9kaXN0L2NvbW1vbmpzL3Byb21pc2UvYWxsLmpzIiwiL1VzZXJzL25hdGhhbmllbGh1bnpha2VyL0Rlc2t0b3AveWFwcHlfYmlyZC9ub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9wcm9taXNlL2FzYXAuanMiLCIvVXNlcnMvbmF0aGFuaWVsaHVuemFrZXIvRGVza3RvcC95YXBweV9iaXJkL25vZGVfbW9kdWxlcy9lczYtcHJvbWlzZS9kaXN0L2NvbW1vbmpzL3Byb21pc2UvY29uZmlnLmpzIiwiL1VzZXJzL25hdGhhbmllbGh1bnpha2VyL0Rlc2t0b3AveWFwcHlfYmlyZC9ub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9wcm9taXNlL3BvbHlmaWxsLmpzIiwiL1VzZXJzL25hdGhhbmllbGh1bnpha2VyL0Rlc2t0b3AveWFwcHlfYmlyZC9ub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9wcm9taXNlL3Byb21pc2UuanMiLCIvVXNlcnMvbmF0aGFuaWVsaHVuemFrZXIvRGVza3RvcC95YXBweV9iaXJkL25vZGVfbW9kdWxlcy9lczYtcHJvbWlzZS9kaXN0L2NvbW1vbmpzL3Byb21pc2UvcmFjZS5qcyIsIi9Vc2Vycy9uYXRoYW5pZWxodW56YWtlci9EZXNrdG9wL3lhcHB5X2JpcmQvbm9kZV9tb2R1bGVzL2VzNi1wcm9taXNlL2Rpc3QvY29tbW9uanMvcHJvbWlzZS9yZWplY3QuanMiLCIvVXNlcnMvbmF0aGFuaWVsaHVuemFrZXIvRGVza3RvcC95YXBweV9iaXJkL25vZGVfbW9kdWxlcy9lczYtcHJvbWlzZS9kaXN0L2NvbW1vbmpzL3Byb21pc2UvcmVzb2x2ZS5qcyIsIi9Vc2Vycy9uYXRoYW5pZWxodW56YWtlci9EZXNrdG9wL3lhcHB5X2JpcmQvbm9kZV9tb2R1bGVzL2VzNi1wcm9taXNlL2Rpc3QvY29tbW9uanMvcHJvbWlzZS91dGlscy5qcyIsIi9Vc2Vycy9uYXRoYW5pZWxodW56YWtlci9EZXNrdG9wL3lhcHB5X2JpcmQvbm9kZV9tb2R1bGVzL3JlYWN0L2xpYi9pbnZhcmlhbnQuanMiLCIvVXNlcnMvbmF0aGFuaWVsaHVuemFrZXIvRGVza3RvcC95YXBweV9iaXJkL25vZGVfbW9kdWxlcy9yZWFjdC9saWIva2V5TWlycm9yLmpzIiwiL1VzZXJzL25hdGhhbmllbGh1bnpha2VyL0Rlc2t0b3AveWFwcHlfYmlyZC9ub2RlX21vZHVsZXMvcmVhY3QvbGliL21lcmdlLmpzIiwiL1VzZXJzL25hdGhhbmllbGh1bnpha2VyL0Rlc2t0b3AveWFwcHlfYmlyZC9ub2RlX21vZHVsZXMvcmVhY3QvbGliL21lcmdlSGVscGVycy5qcyIsIi9Vc2Vycy9uYXRoYW5pZWxodW56YWtlci9EZXNrdG9wL3lhcHB5X2JpcmQvbm9kZV9tb2R1bGVzL3JlYWN0L2xpYi9tZXJnZUludG8uanMiLCIvVXNlcnMvbmF0aGFuaWVsaHVuemFrZXIvRGVza3RvcC95YXBweV9iaXJkL3NyYy9hY3Rpb25zL2dhbWUuanMiLCIvVXNlcnMvbmF0aGFuaWVsaHVuemFrZXIvRGVza3RvcC95YXBweV9iaXJkL3NyYy9hY3Rpb25zL3BsYXllci5qcyIsIi9Vc2Vycy9uYXRoYW5pZWxodW56YWtlci9EZXNrdG9wL3lhcHB5X2JpcmQvc3JjL2FwcC5qcyIsIi9Vc2Vycy9uYXRoYW5pZWxodW56YWtlci9EZXNrdG9wL3lhcHB5X2JpcmQvc3JjL2NvbnN0YW50cy9rZXlzLmpzIiwiL1VzZXJzL25hdGhhbmllbGh1bnpha2VyL0Rlc2t0b3AveWFwcHlfYmlyZC9zcmMvbGlzdGVuZXJzL2tleWJvYXJkLmpzIiwiL1VzZXJzL25hdGhhbmllbGh1bnpha2VyL0Rlc2t0b3AveWFwcHlfYmlyZC9zcmMvc3RhdGUuanMiLCIvVXNlcnMvbmF0aGFuaWVsaHVuemFrZXIvRGVza3RvcC95YXBweV9iaXJkL3NyYy9zdG9yZXMvUGxheWVyLmpzIiwiL1VzZXJzL25hdGhhbmllbGh1bnpha2VyL0Rlc2t0b3AveWFwcHlfYmlyZC9zcmMvc3RvcmVzL2Jsb2Nrcy5qcyIsIi9Vc2Vycy9uYXRoYW5pZWxodW56YWtlci9EZXNrdG9wL3lhcHB5X2JpcmQvc3JjL3N0b3Jlcy9nYW1lLmpzIiwiL1VzZXJzL25hdGhhbmllbGh1bnpha2VyL0Rlc2t0b3AveWFwcHlfYmlyZC9zcmMvc3RvcmVzL3BsYXllci5qcyIsIi9Vc2Vycy9uYXRoYW5pZWxodW56YWtlci9EZXNrdG9wL3lhcHB5X2JpcmQvc3JjL3N0b3Jlcy93b3JsZC5qcyIsIi9Vc2Vycy9uYXRoYW5pZWxodW56YWtlci9EZXNrdG9wL3lhcHB5X2JpcmQvc3JjL3ZpZXdzL2xhbmQuanMiLCIvVXNlcnMvbmF0aGFuaWVsaHVuemFrZXIvRGVza3RvcC95YXBweV9iaXJkL3NyYy92aWV3cy9tYXAuanMiLCIvVXNlcnMvbmF0aGFuaWVsaHVuemFrZXIvRGVza3RvcC95YXBweV9iaXJkL3NyYy92aWV3cy9wbGF5ZXIuanMiLCIvVXNlcnMvbmF0aGFuaWVsaHVuemFrZXIvRGVza3RvcC95YXBweV9iaXJkL3NyYy92aWV3cy9zY2VuZS5qcyIsIi9Vc2Vycy9uYXRoYW5pZWxodW56YWtlci9EZXNrdG9wL3lhcHB5X2JpcmQvc3JjL3ZpZXdzL3NreS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL3ZhciBQcm9taXNlID0gcmVxdWlyZSgnZXM2LXByb21pc2UnKS5Qcm9taXNlO1xuXG52YXIgRGlzcGF0Y2hlciA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLl9jYWxsYmFja3MgPSBbXTtcbn07XG5cbkRpc3BhdGNoZXIucHJvdG90eXBlID0ge1xuXG5cdHJlZ2lzdGVyOiBmdW5jdGlvbiAoYWN0aW9uVHlwZSwgY2FsbGJhY2spIHtcblx0XHR2YXIgZGlzcGF0Y2hlciA9IHRoaXM7XG5cblx0XHRpZiAodHlwZW9mIGFjdGlvblR5cGUgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRyZXR1cm4gT2JqZWN0LmtleXMoYWN0aW9uVHlwZSkubWFwKGZ1bmN0aW9uKHR5cGUpIHtcblx0XHRcdFx0ZGlzcGF0Y2hlci5yZWdpc3Rlcih0eXBlLCBhY3Rpb25UeXBlW3R5cGVdKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHRoaXMuX2NhbGxiYWNrcy5wdXNoKHtcblx0XHRcdGFjdGlvblR5cGUgOiBhY3Rpb25UeXBlLFxuXHRcdFx0YmVoYXZpb3IgICA6IGNhbGxiYWNrXG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gdGhpcy5fY2FsbGJhY2tzLmxlbmd0aCAtIDE7XG5cdH0sXG5cblx0ZGlzcGF0Y2g6IGZ1bmN0aW9uKGFjdGlvblR5cGUsIHBheWxvYWQpIHtcblx0XHR2YXIgX3Byb21pc2VzID0gW107XG5cblx0XHR0aGlzLl9jYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbihjYWxsYmFjaykge1xuXHRcdFx0aWYgKGNhbGxiYWNrLmFjdGlvblR5cGUgPT09IGFjdGlvblR5cGUpIHtcblx0XHRcdFx0X3Byb21pc2VzLnB1c2goY2FsbGJhY2suYmVoYXZpb3IocGF5bG9hZCkpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFByb21pc2UuYWxsKF9wcm9taXNlcykuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuXHRcdH0pO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpc3BhdGNoZXI7XG4iLCIvKiogQGpzeCBSZWFjdC5ET00gKi92YXIgUHJvbWlzZSA9IHJlcXVpcmUoJ2VzNi1wcm9taXNlJykuUHJvbWlzZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwcmVsb2FkIChzcmMpIHtcblx0aWYgKEFycmF5LmlzQXJyYXkoc3JjKSkge1xuXHRcdHJldHVybiBQcm9taXNlLmFsbChzcmMubWFwKHByZWxvYWQpKTtcblx0fVxuXG5cdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblx0XHR2YXIgaW1nID0gbmV3IEltYWdlKCk7XG5cblx0XHRpbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXNvbHZlKGltZyk7XG5cdFx0fTtcblxuXHRcdGltZy5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZWplY3QobmV3IEVycm9yKFwiSW1hZ2UgXCIgKyBzcmMgKyBcIiBmYWlsZWQgdG8gbG9hZC5cIikpXG5cdFx0fVxuXG5cdFx0aW1nLnNyYyA9IHNyYztcblx0fSk7XG59O1xuIiwiLyoqIEBqc3ggUmVhY3QuRE9NICovbW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL3ZhciBFbWl0dGVyID0gcmVxdWlyZShcImV2ZW50c1wiKS5FdmVudEVtaXR0ZXI7XG52YXIgbWVyZ2UgICA9IHJlcXVpcmUoJ3JlYWN0L2xpYi9tZXJnZScpO1xudmFyIENIQU5HRSAgPSAnY2hhbmdlJztcblxudmFyIFN0b3JlID0gbWVyZ2UoRW1pdHRlci5wcm90b3R5cGUsIHtcblx0Q0hBTkdFOiBDSEFOR0UsXG5cblx0Z2V0OmZ1bmN0aW9uKGtleSkge1xuXHRcdHJldHVybiBrZXk/IHRoaXMuX2RhdGFba2V5XSA6IHRoaXMuX2RhdGE7XG5cdH0sXG5cblx0c2V0OmZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcblx0XHR0aGlzLl9kYXRhW2tleV0gPSB2YWx1ZTtcblx0XHR0aGlzLmVtaXRDaGFuZ2UoKTtcblx0fSxcblxuXHRjbG9uZTpmdW5jdGlvbihwcm9wcykge1xuXHRcdHJldHVybiBtZXJnZShwcm9wcywgdGhpcyk7XG5cdH0sXG5cblx0ZW1pdENoYW5nZTpmdW5jdGlvbih0eXBlLCBwYXlsb2FkKSB7XG5cdFx0dGhpcy5lbWl0KENIQU5HRSwgdHlwZSwgcGF5bG9hZCk7XG5cdH0sXG5cblx0b25DaGFuZ2U6ZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0XHR0aGlzLm9uKENIQU5HRSwgY2FsbGJhY2spO1xuXHR9LFxuXG5cdG9mZkNoYW5nZTpmdW5jdGlvbihjYWxsYmFjaykge1xuXHRcdHRoaXMucmVtb3ZlTGlzdGVuZXIoQ0hBTkdFLCBjYWxsYmFjayk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0b3JlO1xuIiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cdGZ1bmN0aW9uIFZlY3Rvcih4LCB5KSB7XCJ1c2Ugc3RyaWN0XCI7XG5cdFx0dGhpcy54ID0geDtcblx0XHR0aGlzLnkgPSB5O1xuXHR9XG5cblx0VmVjdG9yLnByb3RvdHlwZS5hZGQ9ZnVuY3Rpb24odmVjdG9yKSB7XCJ1c2Ugc3RyaWN0XCI7XG5cdFx0dGhpcy54ICs9IHZlY3Rvci54O1xuXHRcdHRoaXMueSArPSB2ZWN0b3IueTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdFZlY3Rvci5wcm90b3R5cGUuc3ViPWZ1bmN0aW9uKHZlY3Rvcikge1widXNlIHN0cmljdFwiO1xuXHRcdHRoaXMueCAtPSB2ZWN0b3IueDtcblx0XHR0aGlzLnkgLT0gdmVjdG9yLnk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRWZWN0b3IucHJvdG90eXBlLm11bHQ9ZnVuY3Rpb24obikge1widXNlIHN0cmljdFwiO1xuXHRcdHRoaXMueCAqPSBuO1xuXHRcdHRoaXMueSAqPSBuO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0VmVjdG9yLnByb3RvdHlwZS5kaXY9ZnVuY3Rpb24obikge1widXNlIHN0cmljdFwiO1xuXHRcdHRoaXMueCA9IHRoaXMueCAvIG47XG5cdFx0dGhpcy55ID0gdGhpcy55IC8gbjtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdFZlY3Rvci5wcm90b3R5cGUubWFnPWZ1bmN0aW9uKCkge1widXNlIHN0cmljdFwiO1xuXHRcdHZhciB2YXIkMSA9IHRoaXMsIHggPSB2YXIkMS54LCB5ID0gdmFyJDEueTtcblx0XHRyZXR1cm4gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xuXHR9O1xuXG5cdFZlY3Rvci5wcm90b3R5cGUubGltaXQ9ZnVuY3Rpb24oaGlnaCkge1widXNlIHN0cmljdFwiO1xuXHRcdGlmICh0aGlzLm1hZygpID4gaGlnaCkge1xuXHRcdFx0dGhpcy5ub3JtYWxpemUoKTtcblx0XHRcdHRoaXMubXVsdChoaWdoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRWZWN0b3IucHJvdG90eXBlLm5vcm1hbGl6ZT1mdW5jdGlvbigpIHtcInVzZSBzdHJpY3RcIjtcblx0XHR2YXIgbSA9IHRoaXMubWFnKCk7XG5cdFx0aWYgKG0gPiAwKSB7XG5cdFx0XHR0aGlzLmRpdihtKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0VmVjdG9yLnN1Yj1mdW5jdGlvbiAodjEsIHYyKSB7XCJ1c2Ugc3RyaWN0XCI7XG5cdFx0cmV0dXJuIG5ldyBWZWN0b3IodjEueCAtIHYyLngsIHYxLnkgLSB2Mi55KTtcblx0fTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFZlY3RvcjtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBUeXBlRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG5cbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICB2YXIgbTtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2Uge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIWVtaXR0ZXIuX2V2ZW50cyB8fCAhZW1pdHRlci5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IDA7XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24oZW1pdHRlci5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoXCIuL3Byb21pc2UvcHJvbWlzZVwiKS5Qcm9taXNlO1xudmFyIHBvbHlmaWxsID0gcmVxdWlyZShcIi4vcHJvbWlzZS9wb2x5ZmlsbFwiKS5wb2x5ZmlsbDtcbmV4cG9ydHMuUHJvbWlzZSA9IFByb21pc2U7XG5leHBvcnRzLnBvbHlmaWxsID0gcG9seWZpbGw7IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKiBnbG9iYWwgdG9TdHJpbmcgKi9cblxudmFyIGlzQXJyYXkgPSByZXF1aXJlKFwiLi91dGlsc1wiKS5pc0FycmF5O1xudmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKFwiLi91dGlsc1wiKS5pc0Z1bmN0aW9uO1xuXG4vKipcbiAgUmV0dXJucyBhIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiBhbGwgdGhlIGdpdmVuIHByb21pc2VzIGhhdmUgYmVlblxuICBmdWxmaWxsZWQsIG9yIHJlamVjdGVkIGlmIGFueSBvZiB0aGVtIGJlY29tZSByZWplY3RlZC4gVGhlIHJldHVybiBwcm9taXNlXG4gIGlzIGZ1bGZpbGxlZCB3aXRoIGFuIGFycmF5IHRoYXQgZ2l2ZXMgYWxsIHRoZSB2YWx1ZXMgaW4gdGhlIG9yZGVyIHRoZXkgd2VyZVxuICBwYXNzZWQgaW4gdGhlIGBwcm9taXNlc2AgYXJyYXkgYXJndW1lbnQuXG5cbiAgRXhhbXBsZTpcblxuICBgYGBqYXZhc2NyaXB0XG4gIHZhciBwcm9taXNlMSA9IFJTVlAucmVzb2x2ZSgxKTtcbiAgdmFyIHByb21pc2UyID0gUlNWUC5yZXNvbHZlKDIpO1xuICB2YXIgcHJvbWlzZTMgPSBSU1ZQLnJlc29sdmUoMyk7XG4gIHZhciBwcm9taXNlcyA9IFsgcHJvbWlzZTEsIHByb21pc2UyLCBwcm9taXNlMyBdO1xuXG4gIFJTVlAuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uKGFycmF5KXtcbiAgICAvLyBUaGUgYXJyYXkgaGVyZSB3b3VsZCBiZSBbIDEsIDIsIDMgXTtcbiAgfSk7XG4gIGBgYFxuXG4gIElmIGFueSBvZiB0aGUgYHByb21pc2VzYCBnaXZlbiB0byBgUlNWUC5hbGxgIGFyZSByZWplY3RlZCwgdGhlIGZpcnN0IHByb21pc2VcbiAgdGhhdCBpcyByZWplY3RlZCB3aWxsIGJlIGdpdmVuIGFzIGFuIGFyZ3VtZW50IHRvIHRoZSByZXR1cm5lZCBwcm9taXNlcydzXG4gIHJlamVjdGlvbiBoYW5kbGVyLiBGb3IgZXhhbXBsZTpcblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgdmFyIHByb21pc2UxID0gUlNWUC5yZXNvbHZlKDEpO1xuICB2YXIgcHJvbWlzZTIgPSBSU1ZQLnJlamVjdChuZXcgRXJyb3IoXCIyXCIpKTtcbiAgdmFyIHByb21pc2UzID0gUlNWUC5yZWplY3QobmV3IEVycm9yKFwiM1wiKSk7XG4gIHZhciBwcm9taXNlcyA9IFsgcHJvbWlzZTEsIHByb21pc2UyLCBwcm9taXNlMyBdO1xuXG4gIFJTVlAuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uKGFycmF5KXtcbiAgICAvLyBDb2RlIGhlcmUgbmV2ZXIgcnVucyBiZWNhdXNlIHRoZXJlIGFyZSByZWplY3RlZCBwcm9taXNlcyFcbiAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAvLyBlcnJvci5tZXNzYWdlID09PSBcIjJcIlxuICB9KTtcbiAgYGBgXG5cbiAgQG1ldGhvZCBhbGxcbiAgQGZvciBSU1ZQXG4gIEBwYXJhbSB7QXJyYXl9IHByb21pc2VzXG4gIEBwYXJhbSB7U3RyaW5nfSBsYWJlbFxuICBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdoZW4gYWxsIGBwcm9taXNlc2AgaGF2ZSBiZWVuXG4gIGZ1bGZpbGxlZCwgb3IgcmVqZWN0ZWQgaWYgYW55IG9mIHRoZW0gYmVjb21lIHJlamVjdGVkLlxuKi9cbmZ1bmN0aW9uIGFsbChwcm9taXNlcykge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgUHJvbWlzZSA9IHRoaXM7XG5cbiAgaWYgKCFpc0FycmF5KHByb21pc2VzKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYW4gYXJyYXkgdG8gYWxsLicpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciByZXN1bHRzID0gW10sIHJlbWFpbmluZyA9IHByb21pc2VzLmxlbmd0aCxcbiAgICBwcm9taXNlO1xuXG4gICAgaWYgKHJlbWFpbmluZyA9PT0gMCkge1xuICAgICAgcmVzb2x2ZShbXSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzb2x2ZXIoaW5kZXgpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXNvbHZlQWxsKGluZGV4LCB2YWx1ZSk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc29sdmVBbGwoaW5kZXgsIHZhbHVlKSB7XG4gICAgICByZXN1bHRzW2luZGV4XSA9IHZhbHVlO1xuICAgICAgaWYgKC0tcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgIHJlc29sdmUocmVzdWx0cyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9taXNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgcHJvbWlzZSA9IHByb21pc2VzW2ldO1xuXG4gICAgICBpZiAocHJvbWlzZSAmJiBpc0Z1bmN0aW9uKHByb21pc2UudGhlbikpIHtcbiAgICAgICAgcHJvbWlzZS50aGVuKHJlc29sdmVyKGkpLCByZWplY3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2ZUFsbChpLCBwcm9taXNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnRzLmFsbCA9IGFsbDsiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsKXtcblwidXNlIHN0cmljdFwiO1xudmFyIGJyb3dzZXJHbG9iYWwgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpID8gd2luZG93IDoge307XG52YXIgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSBicm93c2VyR2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgYnJvd3Nlckdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xudmFyIGxvY2FsID0gKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSA/IGdsb2JhbCA6ICh0aGlzID09PSB1bmRlZmluZWQ/IHdpbmRvdzp0aGlzKTtcblxuLy8gbm9kZVxuZnVuY3Rpb24gdXNlTmV4dFRpY2soKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdXNlTXV0YXRpb25PYnNlcnZlcigpIHtcbiAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICB2YXIgb2JzZXJ2ZXIgPSBuZXcgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIoZmx1c2gpO1xuICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7IGNoYXJhY3RlckRhdGE6IHRydWUgfSk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIG5vZGUuZGF0YSA9IChpdGVyYXRpb25zID0gKytpdGVyYXRpb25zICUgMik7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHVzZVNldFRpbWVvdXQoKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBsb2NhbC5zZXRUaW1lb3V0KGZsdXNoLCAxKTtcbiAgfTtcbn1cblxudmFyIHF1ZXVlID0gW107XG5mdW5jdGlvbiBmbHVzaCgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgIHZhciB0dXBsZSA9IHF1ZXVlW2ldO1xuICAgIHZhciBjYWxsYmFjayA9IHR1cGxlWzBdLCBhcmcgPSB0dXBsZVsxXTtcbiAgICBjYWxsYmFjayhhcmcpO1xuICB9XG4gIHF1ZXVlID0gW107XG59XG5cbnZhciBzY2hlZHVsZUZsdXNoO1xuXG4vLyBEZWNpZGUgd2hhdCBhc3luYyBtZXRob2QgdG8gdXNlIHRvIHRyaWdnZXJpbmcgcHJvY2Vzc2luZyBvZiBxdWV1ZWQgY2FsbGJhY2tzOlxuaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiB7fS50b1N0cmluZy5jYWxsKHByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXScpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZU5leHRUaWNrKCk7XG59IGVsc2UgaWYgKEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VNdXRhdGlvbk9ic2VydmVyKCk7XG59IGVsc2Uge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlU2V0VGltZW91dCgpO1xufVxuXG5mdW5jdGlvbiBhc2FwKGNhbGxiYWNrLCBhcmcpIHtcbiAgdmFyIGxlbmd0aCA9IHF1ZXVlLnB1c2goW2NhbGxiYWNrLCBhcmddKTtcbiAgaWYgKGxlbmd0aCA9PT0gMSkge1xuICAgIC8vIElmIGxlbmd0aCBpcyAxLCB0aGF0IG1lYW5zIHRoYXQgd2UgbmVlZCB0byBzY2hlZHVsZSBhbiBhc3luYyBmbHVzaC5cbiAgICAvLyBJZiBhZGRpdGlvbmFsIGNhbGxiYWNrcyBhcmUgcXVldWVkIGJlZm9yZSB0aGUgcXVldWUgaXMgZmx1c2hlZCwgdGhleVxuICAgIC8vIHdpbGwgYmUgcHJvY2Vzc2VkIGJ5IHRoaXMgZmx1c2ggdGhhdCB3ZSBhcmUgc2NoZWR1bGluZy5cbiAgICBzY2hlZHVsZUZsdXNoKCk7XG4gIH1cbn1cblxuZXhwb3J0cy5hc2FwID0gYXNhcDtcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiRldhQVNIXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBjb25maWcgPSB7XG4gIGluc3RydW1lbnQ6IGZhbHNlXG59O1xuXG5mdW5jdGlvbiBjb25maWd1cmUobmFtZSwgdmFsdWUpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICBjb25maWdbbmFtZV0gPSB2YWx1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY29uZmlnW25hbWVdO1xuICB9XG59XG5cbmV4cG9ydHMuY29uZmlnID0gY29uZmlnO1xuZXhwb3J0cy5jb25maWd1cmUgPSBjb25maWd1cmU7IiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuXCJ1c2Ugc3RyaWN0XCI7XG4vKmdsb2JhbCBzZWxmKi9cbnZhciBSU1ZQUHJvbWlzZSA9IHJlcXVpcmUoXCIuL3Byb21pc2VcIikuUHJvbWlzZTtcbnZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZShcIi4vdXRpbHNcIikuaXNGdW5jdGlvbjtcblxuZnVuY3Rpb24gcG9seWZpbGwoKSB7XG4gIHZhciBsb2NhbDtcblxuICBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBsb2NhbCA9IGdsb2JhbDtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuZG9jdW1lbnQpIHtcbiAgICBsb2NhbCA9IHdpbmRvdztcbiAgfSBlbHNlIHtcbiAgICBsb2NhbCA9IHNlbGY7XG4gIH1cblxuICB2YXIgZXM2UHJvbWlzZVN1cHBvcnQgPSBcbiAgICBcIlByb21pc2VcIiBpbiBsb2NhbCAmJlxuICAgIC8vIFNvbWUgb2YgdGhlc2UgbWV0aG9kcyBhcmUgbWlzc2luZyBmcm9tXG4gICAgLy8gRmlyZWZveC9DaHJvbWUgZXhwZXJpbWVudGFsIGltcGxlbWVudGF0aW9uc1xuICAgIFwicmVzb2x2ZVwiIGluIGxvY2FsLlByb21pc2UgJiZcbiAgICBcInJlamVjdFwiIGluIGxvY2FsLlByb21pc2UgJiZcbiAgICBcImFsbFwiIGluIGxvY2FsLlByb21pc2UgJiZcbiAgICBcInJhY2VcIiBpbiBsb2NhbC5Qcm9taXNlICYmXG4gICAgLy8gT2xkZXIgdmVyc2lvbiBvZiB0aGUgc3BlYyBoYWQgYSByZXNvbHZlciBvYmplY3RcbiAgICAvLyBhcyB0aGUgYXJnIHJhdGhlciB0aGFuIGEgZnVuY3Rpb25cbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVzb2x2ZTtcbiAgICAgIG5ldyBsb2NhbC5Qcm9taXNlKGZ1bmN0aW9uKHIpIHsgcmVzb2x2ZSA9IHI7IH0pO1xuICAgICAgcmV0dXJuIGlzRnVuY3Rpb24ocmVzb2x2ZSk7XG4gICAgfSgpKTtcblxuICBpZiAoIWVzNlByb21pc2VTdXBwb3J0KSB7XG4gICAgbG9jYWwuUHJvbWlzZSA9IFJTVlBQcm9taXNlO1xuICB9XG59XG5cbmV4cG9ydHMucG9seWZpbGwgPSBwb2x5ZmlsbDtcbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY29uZmlnID0gcmVxdWlyZShcIi4vY29uZmlnXCIpLmNvbmZpZztcbnZhciBjb25maWd1cmUgPSByZXF1aXJlKFwiLi9jb25maWdcIikuY29uZmlndXJlO1xudmFyIG9iamVjdE9yRnVuY3Rpb24gPSByZXF1aXJlKFwiLi91dGlsc1wiKS5vYmplY3RPckZ1bmN0aW9uO1xudmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKFwiLi91dGlsc1wiKS5pc0Z1bmN0aW9uO1xudmFyIG5vdyA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpLm5vdztcbnZhciBhbGwgPSByZXF1aXJlKFwiLi9hbGxcIikuYWxsO1xudmFyIHJhY2UgPSByZXF1aXJlKFwiLi9yYWNlXCIpLnJhY2U7XG52YXIgc3RhdGljUmVzb2x2ZSA9IHJlcXVpcmUoXCIuL3Jlc29sdmVcIikucmVzb2x2ZTtcbnZhciBzdGF0aWNSZWplY3QgPSByZXF1aXJlKFwiLi9yZWplY3RcIikucmVqZWN0O1xudmFyIGFzYXAgPSByZXF1aXJlKFwiLi9hc2FwXCIpLmFzYXA7XG5cbnZhciBjb3VudGVyID0gMDtcblxuY29uZmlnLmFzeW5jID0gYXNhcDsgLy8gZGVmYXVsdCBhc3luYyBpcyBhc2FwO1xuXG5mdW5jdGlvbiBQcm9taXNlKHJlc29sdmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihyZXNvbHZlcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwYXNzIGEgcmVzb2x2ZXIgZnVuY3Rpb24gYXMgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIHRoZSBwcm9taXNlIGNvbnN0cnVjdG9yJyk7XG4gIH1cblxuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUHJvbWlzZSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRmFpbGVkIHRvIGNvbnN0cnVjdCAnUHJvbWlzZSc6IFBsZWFzZSB1c2UgdGhlICduZXcnIG9wZXJhdG9yLCB0aGlzIG9iamVjdCBjb25zdHJ1Y3RvciBjYW5ub3QgYmUgY2FsbGVkIGFzIGEgZnVuY3Rpb24uXCIpO1xuICB9XG5cbiAgdGhpcy5fc3Vic2NyaWJlcnMgPSBbXTtcblxuICBpbnZva2VSZXNvbHZlcihyZXNvbHZlciwgdGhpcyk7XG59XG5cbmZ1bmN0aW9uIGludm9rZVJlc29sdmVyKHJlc29sdmVyLCBwcm9taXNlKSB7XG4gIGZ1bmN0aW9uIHJlc29sdmVQcm9taXNlKHZhbHVlKSB7XG4gICAgcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gIH1cblxuICBmdW5jdGlvbiByZWplY3RQcm9taXNlKHJlYXNvbikge1xuICAgIHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICB9XG5cbiAgdHJ5IHtcbiAgICByZXNvbHZlcihyZXNvbHZlUHJvbWlzZSwgcmVqZWN0UHJvbWlzZSk7XG4gIH0gY2F0Y2goZSkge1xuICAgIHJlamVjdFByb21pc2UoZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW52b2tlQ2FsbGJhY2soc2V0dGxlZCwgcHJvbWlzZSwgY2FsbGJhY2ssIGRldGFpbCkge1xuICB2YXIgaGFzQ2FsbGJhY2sgPSBpc0Z1bmN0aW9uKGNhbGxiYWNrKSxcbiAgICAgIHZhbHVlLCBlcnJvciwgc3VjY2VlZGVkLCBmYWlsZWQ7XG5cbiAgaWYgKGhhc0NhbGxiYWNrKSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhbHVlID0gY2FsbGJhY2soZGV0YWlsKTtcbiAgICAgIHN1Y2NlZWRlZCA9IHRydWU7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBmYWlsZWQgPSB0cnVlO1xuICAgICAgZXJyb3IgPSBlO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YWx1ZSA9IGRldGFpbDtcbiAgICBzdWNjZWVkZWQgPSB0cnVlO1xuICB9XG5cbiAgaWYgKGhhbmRsZVRoZW5hYmxlKHByb21pc2UsIHZhbHVlKSkge1xuICAgIHJldHVybjtcbiAgfSBlbHNlIGlmIChoYXNDYWxsYmFjayAmJiBzdWNjZWVkZWQpIHtcbiAgICByZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgfSBlbHNlIGlmIChmYWlsZWQpIHtcbiAgICByZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IEZVTEZJTExFRCkge1xuICAgIHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IFJFSkVDVEVEKSB7XG4gICAgcmVqZWN0KHByb21pc2UsIHZhbHVlKTtcbiAgfVxufVxuXG52YXIgUEVORElORyAgID0gdm9pZCAwO1xudmFyIFNFQUxFRCAgICA9IDA7XG52YXIgRlVMRklMTEVEID0gMTtcbnZhciBSRUpFQ1RFRCAgPSAyO1xuXG5mdW5jdGlvbiBzdWJzY3JpYmUocGFyZW50LCBjaGlsZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgdmFyIHN1YnNjcmliZXJzID0gcGFyZW50Ll9zdWJzY3JpYmVycztcbiAgdmFyIGxlbmd0aCA9IHN1YnNjcmliZXJzLmxlbmd0aDtcblxuICBzdWJzY3JpYmVyc1tsZW5ndGhdID0gY2hpbGQ7XG4gIHN1YnNjcmliZXJzW2xlbmd0aCArIEZVTEZJTExFRF0gPSBvbkZ1bGZpbGxtZW50O1xuICBzdWJzY3JpYmVyc1tsZW5ndGggKyBSRUpFQ1RFRF0gID0gb25SZWplY3Rpb247XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2gocHJvbWlzZSwgc2V0dGxlZCkge1xuICB2YXIgY2hpbGQsIGNhbGxiYWNrLCBzdWJzY3JpYmVycyA9IHByb21pc2UuX3N1YnNjcmliZXJzLCBkZXRhaWwgPSBwcm9taXNlLl9kZXRhaWw7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdWJzY3JpYmVycy5sZW5ndGg7IGkgKz0gMykge1xuICAgIGNoaWxkID0gc3Vic2NyaWJlcnNbaV07XG4gICAgY2FsbGJhY2sgPSBzdWJzY3JpYmVyc1tpICsgc2V0dGxlZF07XG5cbiAgICBpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBjaGlsZCwgY2FsbGJhY2ssIGRldGFpbCk7XG4gIH1cblxuICBwcm9taXNlLl9zdWJzY3JpYmVycyA9IG51bGw7XG59XG5cblByb21pc2UucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogUHJvbWlzZSxcblxuICBfc3RhdGU6IHVuZGVmaW5lZCxcbiAgX2RldGFpbDogdW5kZWZpbmVkLFxuICBfc3Vic2NyaWJlcnM6IHVuZGVmaW5lZCxcblxuICB0aGVuOiBmdW5jdGlvbihvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbikge1xuICAgIHZhciBwcm9taXNlID0gdGhpcztcblxuICAgIHZhciB0aGVuUHJvbWlzZSA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKGZ1bmN0aW9uKCkge30pO1xuXG4gICAgaWYgKHRoaXMuX3N0YXRlKSB7XG4gICAgICB2YXIgY2FsbGJhY2tzID0gYXJndW1lbnRzO1xuICAgICAgY29uZmlnLmFzeW5jKGZ1bmN0aW9uIGludm9rZVByb21pc2VDYWxsYmFjaygpIHtcbiAgICAgICAgaW52b2tlQ2FsbGJhY2socHJvbWlzZS5fc3RhdGUsIHRoZW5Qcm9taXNlLCBjYWxsYmFja3NbcHJvbWlzZS5fc3RhdGUgLSAxXSwgcHJvbWlzZS5fZGV0YWlsKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdWJzY3JpYmUodGhpcywgdGhlblByb21pc2UsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhlblByb21pc2U7XG4gIH0sXG5cbiAgJ2NhdGNoJzogZnVuY3Rpb24ob25SZWplY3Rpb24pIHtcbiAgICByZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0aW9uKTtcbiAgfVxufTtcblxuUHJvbWlzZS5hbGwgPSBhbGw7XG5Qcm9taXNlLnJhY2UgPSByYWNlO1xuUHJvbWlzZS5yZXNvbHZlID0gc3RhdGljUmVzb2x2ZTtcblByb21pc2UucmVqZWN0ID0gc3RhdGljUmVqZWN0O1xuXG5mdW5jdGlvbiBoYW5kbGVUaGVuYWJsZShwcm9taXNlLCB2YWx1ZSkge1xuICB2YXIgdGhlbiA9IG51bGwsXG4gIHJlc29sdmVkO1xuXG4gIHRyeSB7XG4gICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQSBwcm9taXNlcyBjYWxsYmFjayBjYW5ub3QgcmV0dXJuIHRoYXQgc2FtZSBwcm9taXNlLlwiKTtcbiAgICB9XG5cbiAgICBpZiAob2JqZWN0T3JGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHRoZW4gPSB2YWx1ZS50aGVuO1xuXG4gICAgICBpZiAoaXNGdW5jdGlvbih0aGVuKSkge1xuICAgICAgICB0aGVuLmNhbGwodmFsdWUsIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgIGlmIChyZXNvbHZlZCkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgICAgIHJlc29sdmVkID0gdHJ1ZTtcblxuICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdmFsKSB7XG4gICAgICAgICAgICByZXNvbHZlKHByb21pc2UsIHZhbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZ1bGZpbGwocHJvbWlzZSwgdmFsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgIGlmIChyZXNvbHZlZCkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgICAgIHJlc29sdmVkID0gdHJ1ZTtcblxuICAgICAgICAgIHJlamVjdChwcm9taXNlLCB2YWwpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaWYgKHJlc29sdmVkKSB7IHJldHVybiB0cnVlOyB9XG4gICAgcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSkge1xuICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICBmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgfSBlbHNlIGlmICghaGFuZGxlVGhlbmFibGUocHJvbWlzZSwgdmFsdWUpKSB7XG4gICAgZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZnVsZmlsbChwcm9taXNlLCB2YWx1ZSkge1xuICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IFBFTkRJTkcpIHsgcmV0dXJuOyB9XG4gIHByb21pc2UuX3N0YXRlID0gU0VBTEVEO1xuICBwcm9taXNlLl9kZXRhaWwgPSB2YWx1ZTtcblxuICBjb25maWcuYXN5bmMocHVibGlzaEZ1bGZpbGxtZW50LCBwcm9taXNlKTtcbn1cblxuZnVuY3Rpb24gcmVqZWN0KHByb21pc2UsIHJlYXNvbikge1xuICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IFBFTkRJTkcpIHsgcmV0dXJuOyB9XG4gIHByb21pc2UuX3N0YXRlID0gU0VBTEVEO1xuICBwcm9taXNlLl9kZXRhaWwgPSByZWFzb247XG5cbiAgY29uZmlnLmFzeW5jKHB1Ymxpc2hSZWplY3Rpb24sIHByb21pc2UpO1xufVxuXG5mdW5jdGlvbiBwdWJsaXNoRnVsZmlsbG1lbnQocHJvbWlzZSkge1xuICBwdWJsaXNoKHByb21pc2UsIHByb21pc2UuX3N0YXRlID0gRlVMRklMTEVEKTtcbn1cblxuZnVuY3Rpb24gcHVibGlzaFJlamVjdGlvbihwcm9taXNlKSB7XG4gIHB1Ymxpc2gocHJvbWlzZSwgcHJvbWlzZS5fc3RhdGUgPSBSRUpFQ1RFRCk7XG59XG5cbmV4cG9ydHMuUHJvbWlzZSA9IFByb21pc2U7IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKiBnbG9iYWwgdG9TdHJpbmcgKi9cbnZhciBpc0FycmF5ID0gcmVxdWlyZShcIi4vdXRpbHNcIikuaXNBcnJheTtcblxuLyoqXG4gIGBSU1ZQLnJhY2VgIGFsbG93cyB5b3UgdG8gd2F0Y2ggYSBzZXJpZXMgb2YgcHJvbWlzZXMgYW5kIGFjdCBhcyBzb29uIGFzIHRoZVxuICBmaXJzdCBwcm9taXNlIGdpdmVuIHRvIHRoZSBgcHJvbWlzZXNgIGFyZ3VtZW50IGZ1bGZpbGxzIG9yIHJlamVjdHMuXG5cbiAgRXhhbXBsZTpcblxuICBgYGBqYXZhc2NyaXB0XG4gIHZhciBwcm9taXNlMSA9IG5ldyBSU1ZQLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXNvbHZlKFwicHJvbWlzZSAxXCIpO1xuICAgIH0sIDIwMCk7XG4gIH0pO1xuXG4gIHZhciBwcm9taXNlMiA9IG5ldyBSU1ZQLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXNvbHZlKFwicHJvbWlzZSAyXCIpO1xuICAgIH0sIDEwMCk7XG4gIH0pO1xuXG4gIFJTVlAucmFjZShbcHJvbWlzZTEsIHByb21pc2UyXSkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgIC8vIHJlc3VsdCA9PT0gXCJwcm9taXNlIDJcIiBiZWNhdXNlIGl0IHdhcyByZXNvbHZlZCBiZWZvcmUgcHJvbWlzZTFcbiAgICAvLyB3YXMgcmVzb2x2ZWQuXG4gIH0pO1xuICBgYGBcblxuICBgUlNWUC5yYWNlYCBpcyBkZXRlcm1pbmlzdGljIGluIHRoYXQgb25seSB0aGUgc3RhdGUgb2YgdGhlIGZpcnN0IGNvbXBsZXRlZFxuICBwcm9taXNlIG1hdHRlcnMuIEZvciBleGFtcGxlLCBldmVuIGlmIG90aGVyIHByb21pc2VzIGdpdmVuIHRvIHRoZSBgcHJvbWlzZXNgXG4gIGFycmF5IGFyZ3VtZW50IGFyZSByZXNvbHZlZCwgYnV0IHRoZSBmaXJzdCBjb21wbGV0ZWQgcHJvbWlzZSBoYXMgYmVjb21lXG4gIHJlamVjdGVkIGJlZm9yZSB0aGUgb3RoZXIgcHJvbWlzZXMgYmVjYW1lIGZ1bGZpbGxlZCwgdGhlIHJldHVybmVkIHByb21pc2VcbiAgd2lsbCBiZWNvbWUgcmVqZWN0ZWQ6XG5cbiAgYGBgamF2YXNjcmlwdFxuICB2YXIgcHJvbWlzZTEgPSBuZXcgUlNWUC5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVzb2x2ZShcInByb21pc2UgMVwiKTtcbiAgICB9LCAyMDApO1xuICB9KTtcblxuICB2YXIgcHJvbWlzZTIgPSBuZXcgUlNWUC5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVqZWN0KG5ldyBFcnJvcihcInByb21pc2UgMlwiKSk7XG4gICAgfSwgMTAwKTtcbiAgfSk7XG5cbiAgUlNWUC5yYWNlKFtwcm9taXNlMSwgcHJvbWlzZTJdKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgLy8gQ29kZSBoZXJlIG5ldmVyIHJ1bnMgYmVjYXVzZSB0aGVyZSBhcmUgcmVqZWN0ZWQgcHJvbWlzZXMhXG4gIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgLy8gcmVhc29uLm1lc3NhZ2UgPT09IFwicHJvbWlzZTJcIiBiZWNhdXNlIHByb21pc2UgMiBiZWNhbWUgcmVqZWN0ZWQgYmVmb3JlXG4gICAgLy8gcHJvbWlzZSAxIGJlY2FtZSBmdWxmaWxsZWRcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgcmFjZVxuICBAZm9yIFJTVlBcbiAgQHBhcmFtIHtBcnJheX0gcHJvbWlzZXMgYXJyYXkgb2YgcHJvbWlzZXMgdG8gb2JzZXJ2ZVxuICBAcGFyYW0ge1N0cmluZ30gbGFiZWwgb3B0aW9uYWwgc3RyaW5nIGZvciBkZXNjcmliaW5nIHRoZSBwcm9taXNlIHJldHVybmVkLlxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSB0aGF0IGJlY29tZXMgZnVsZmlsbGVkIHdpdGggdGhlIHZhbHVlIHRoZSBmaXJzdFxuICBjb21wbGV0ZWQgcHJvbWlzZXMgaXMgcmVzb2x2ZWQgd2l0aCBpZiB0aGUgZmlyc3QgY29tcGxldGVkIHByb21pc2Ugd2FzXG4gIGZ1bGZpbGxlZCwgb3IgcmVqZWN0ZWQgd2l0aCB0aGUgcmVhc29uIHRoYXQgdGhlIGZpcnN0IGNvbXBsZXRlZCBwcm9taXNlXG4gIHdhcyByZWplY3RlZCB3aXRoLlxuKi9cbmZ1bmN0aW9uIHJhY2UocHJvbWlzZXMpIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgdmFyIFByb21pc2UgPSB0aGlzO1xuXG4gIGlmICghaXNBcnJheShwcm9taXNlcykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwYXNzIGFuIGFycmF5IHRvIHJhY2UuJyk7XG4gIH1cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciByZXN1bHRzID0gW10sIHByb21pc2U7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb21pc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZXNbaV07XG5cbiAgICAgIGlmIChwcm9taXNlICYmIHR5cGVvZiBwcm9taXNlLnRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcHJvbWlzZS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKHByb21pc2UpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydHMucmFjZSA9IHJhY2U7IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAgYFJTVlAucmVqZWN0YCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHdpbGwgYmVjb21lIHJlamVjdGVkIHdpdGggdGhlIHBhc3NlZFxuICBgcmVhc29uYC4gYFJTVlAucmVqZWN0YCBpcyBlc3NlbnRpYWxseSBzaG9ydGhhbmQgZm9yIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICB2YXIgcHJvbWlzZSA9IG5ldyBSU1ZQLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICByZWplY3QobmV3IEVycm9yKCdXSE9PUFMnKSk7XG4gIH0pO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gQ29kZSBoZXJlIGRvZXNuJ3QgcnVuIGJlY2F1c2UgdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQhXG4gIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgLy8gcmVhc29uLm1lc3NhZ2UgPT09ICdXSE9PUFMnXG4gIH0pO1xuICBgYGBcblxuICBJbnN0ZWFkIG9mIHdyaXRpbmcgdGhlIGFib3ZlLCB5b3VyIGNvZGUgbm93IHNpbXBseSBiZWNvbWVzIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICB2YXIgcHJvbWlzZSA9IFJTVlAucmVqZWN0KG5ldyBFcnJvcignV0hPT1BTJykpO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gQ29kZSBoZXJlIGRvZXNuJ3QgcnVuIGJlY2F1c2UgdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQhXG4gIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgLy8gcmVhc29uLm1lc3NhZ2UgPT09ICdXSE9PUFMnXG4gIH0pO1xuICBgYGBcblxuICBAbWV0aG9kIHJlamVjdFxuICBAZm9yIFJTVlBcbiAgQHBhcmFtIHtBbnl9IHJlYXNvbiB2YWx1ZSB0aGF0IHRoZSByZXR1cm5lZCBwcm9taXNlIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aC5cbiAgQHBhcmFtIHtTdHJpbmd9IGxhYmVsIG9wdGlvbmFsIHN0cmluZyBmb3IgaWRlbnRpZnlpbmcgdGhlIHJldHVybmVkIHByb21pc2UuXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHRoYXQgd2lsbCBiZWNvbWUgcmVqZWN0ZWQgd2l0aCB0aGUgZ2l2ZW5cbiAgYHJlYXNvbmAuXG4qL1xuZnVuY3Rpb24gcmVqZWN0KHJlYXNvbikge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgUHJvbWlzZSA9IHRoaXM7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICByZWplY3QocmVhc29uKTtcbiAgfSk7XG59XG5cbmV4cG9ydHMucmVqZWN0ID0gcmVqZWN0OyIsIlwidXNlIHN0cmljdFwiO1xuZnVuY3Rpb24gcmVzb2x2ZSh2YWx1ZSkge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gdGhpcykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHZhciBQcm9taXNlID0gdGhpcztcblxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgIHJlc29sdmUodmFsdWUpO1xuICB9KTtcbn1cblxuZXhwb3J0cy5yZXNvbHZlID0gcmVzb2x2ZTsiLCJcInVzZSBzdHJpY3RcIjtcbmZ1bmN0aW9uIG9iamVjdE9yRnVuY3Rpb24oeCkge1xuICByZXR1cm4gaXNGdW5jdGlvbih4KSB8fCAodHlwZW9mIHggPT09IFwib2JqZWN0XCIgJiYgeCAhPT0gbnVsbCk7XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oeCkge1xuICByZXR1cm4gdHlwZW9mIHggPT09IFwiZnVuY3Rpb25cIjtcbn1cblxuZnVuY3Rpb24gaXNBcnJheSh4KSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeCkgPT09IFwiW29iamVjdCBBcnJheV1cIjtcbn1cblxuLy8gRGF0ZS5ub3cgaXMgbm90IGF2YWlsYWJsZSBpbiBicm93c2VycyA8IElFOVxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRGF0ZS9ub3cjQ29tcGF0aWJpbGl0eVxudmFyIG5vdyA9IERhdGUubm93IHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7IH07XG5cblxuZXhwb3J0cy5vYmplY3RPckZ1bmN0aW9uID0gb2JqZWN0T3JGdW5jdGlvbjtcbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuZXhwb3J0cy5ub3cgPSBub3c7IiwiKGZ1bmN0aW9uIChwcm9jZXNzKXtcbi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBpbnZhcmlhbnRcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxudmFyIGludmFyaWFudCA9IGZ1bmN0aW9uKGNvbmRpdGlvbikge1xuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICdNaW5pZmllZCBleGNlcHRpb24gb2NjdXJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50IGZvciAnICtcbiAgICAgICd0aGUgZnVsbCBlcnJvciBtZXNzYWdlIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuJ1xuICAgICk7XG4gICAgZXJyb3IuZnJhbWVzVG9Qb3AgPSAxO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5pZiAoXCJwcm9kdWN0aW9uXCIgIT09IHByb2Nlc3MuZW52Lk5PREVfRU5WKSB7XG4gIGludmFyaWFudCA9IGZ1bmN0aW9uKGNvbmRpdGlvbiwgZm9ybWF0LCBhLCBiLCBjLCBkLCBlLCBmKSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFyaWFudCByZXF1aXJlcyBhbiBlcnJvciBtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuXG4gICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIHZhciBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgJ0ludmFyaWFudCBWaW9sYXRpb246ICcgK1xuICAgICAgICBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24oKSB7IHJldHVybiBhcmdzW2FyZ0luZGV4KytdOyB9KVxuICAgICAgKTtcbiAgICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnZhcmlhbnQ7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiRldhQVNIXCIpKSIsIihmdW5jdGlvbiAocHJvY2Vzcyl7XG4vKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTQgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUga2V5TWlycm9yXG4gKiBAdHlwZWNoZWNrcyBzdGF0aWMtb25seVxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgaW52YXJpYW50ID0gcmVxdWlyZShcIi4vaW52YXJpYW50XCIpO1xuXG4vKipcbiAqIENvbnN0cnVjdHMgYW4gZW51bWVyYXRpb24gd2l0aCBrZXlzIGVxdWFsIHRvIHRoZWlyIHZhbHVlLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqICAgdmFyIENPTE9SUyA9IGtleU1pcnJvcih7Ymx1ZTogbnVsbCwgcmVkOiBudWxsfSk7XG4gKiAgIHZhciBteUNvbG9yID0gQ09MT1JTLmJsdWU7XG4gKiAgIHZhciBpc0NvbG9yVmFsaWQgPSAhIUNPTE9SU1tteUNvbG9yXTtcbiAqXG4gKiBUaGUgbGFzdCBsaW5lIGNvdWxkIG5vdCBiZSBwZXJmb3JtZWQgaWYgdGhlIHZhbHVlcyBvZiB0aGUgZ2VuZXJhdGVkIGVudW0gd2VyZVxuICogbm90IGVxdWFsIHRvIHRoZWlyIGtleXMuXG4gKlxuICogICBJbnB1dDogIHtrZXkxOiB2YWwxLCBrZXkyOiB2YWwyfVxuICogICBPdXRwdXQ6IHtrZXkxOiBrZXkxLCBrZXkyOiBrZXkyfVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xudmFyIGtleU1pcnJvciA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgcmV0ID0ge307XG4gIHZhciBrZXk7XG4gIChcInByb2R1Y3Rpb25cIiAhPT0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPyBpbnZhcmlhbnQoXG4gICAgb2JqIGluc3RhbmNlb2YgT2JqZWN0ICYmICFBcnJheS5pc0FycmF5KG9iaiksXG4gICAgJ2tleU1pcnJvciguLi4pOiBBcmd1bWVudCBtdXN0IGJlIGFuIG9iamVjdC4nXG4gICkgOiBpbnZhcmlhbnQob2JqIGluc3RhbmNlb2YgT2JqZWN0ICYmICFBcnJheS5pc0FycmF5KG9iaikpKTtcbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHJldFtrZXldID0ga2V5O1xuICB9XG4gIHJldHVybiByZXQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleU1pcnJvcjtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJGV2FBU0hcIikpIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE0IEZhY2Vib29rLCBJbmMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIG1lcmdlXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZXJnZUludG8gPSByZXF1aXJlKFwiLi9tZXJnZUludG9cIik7XG5cbi8qKlxuICogU2hhbGxvdyBtZXJnZXMgdHdvIHN0cnVjdHVyZXMgaW50byBhIHJldHVybiB2YWx1ZSwgd2l0aG91dCBtdXRhdGluZyBlaXRoZXIuXG4gKlxuICogQHBhcmFtIHs/b2JqZWN0fSBvbmUgT3B0aW9uYWwgb2JqZWN0IHdpdGggcHJvcGVydGllcyB0byBtZXJnZSBmcm9tLlxuICogQHBhcmFtIHs/b2JqZWN0fSB0d28gT3B0aW9uYWwgb2JqZWN0IHdpdGggcHJvcGVydGllcyB0byBtZXJnZSBmcm9tLlxuICogQHJldHVybiB7b2JqZWN0fSBUaGUgc2hhbGxvdyBleHRlbnNpb24gb2Ygb25lIGJ5IHR3by5cbiAqL1xudmFyIG1lcmdlID0gZnVuY3Rpb24ob25lLCB0d28pIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICBtZXJnZUludG8ocmVzdWx0LCBvbmUpO1xuICBtZXJnZUludG8ocmVzdWx0LCB0d28pO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBtZXJnZTtcbiIsIihmdW5jdGlvbiAocHJvY2Vzcyl7XG4vKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTQgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgbWVyZ2VIZWxwZXJzXG4gKlxuICogcmVxdWlyZXNQb2x5ZmlsbHM6IEFycmF5LmlzQXJyYXlcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGludmFyaWFudCA9IHJlcXVpcmUoXCIuL2ludmFyaWFudFwiKTtcbnZhciBrZXlNaXJyb3IgPSByZXF1aXJlKFwiLi9rZXlNaXJyb3JcIik7XG5cbi8qKlxuICogTWF4aW11bSBudW1iZXIgb2YgbGV2ZWxzIHRvIHRyYXZlcnNlLiBXaWxsIGNhdGNoIGNpcmN1bGFyIHN0cnVjdHVyZXMuXG4gKiBAY29uc3RcbiAqL1xudmFyIE1BWF9NRVJHRV9ERVBUSCA9IDM2O1xuXG4vKipcbiAqIFdlIHdvbid0IHdvcnJ5IGFib3V0IGVkZ2UgY2FzZXMgbGlrZSBuZXcgU3RyaW5nKCd4Jykgb3IgbmV3IEJvb2xlYW4odHJ1ZSkuXG4gKiBGdW5jdGlvbnMgYXJlIGNvbnNpZGVyZWQgdGVybWluYWxzLCBhbmQgYXJyYXlzIGFyZSBub3QuXG4gKiBAcGFyYW0geyp9IG8gVGhlIGl0ZW0vb2JqZWN0L3ZhbHVlIHRvIHRlc3QuXG4gKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmZiB0aGUgYXJndW1lbnQgaXMgYSB0ZXJtaW5hbC5cbiAqL1xudmFyIGlzVGVybWluYWwgPSBmdW5jdGlvbihvKSB7XG4gIHJldHVybiB0eXBlb2YgbyAhPT0gJ29iamVjdCcgfHwgbyA9PT0gbnVsbDtcbn07XG5cbnZhciBtZXJnZUhlbHBlcnMgPSB7XG5cbiAgTUFYX01FUkdFX0RFUFRIOiBNQVhfTUVSR0VfREVQVEgsXG5cbiAgaXNUZXJtaW5hbDogaXNUZXJtaW5hbCxcblxuICAvKipcbiAgICogQ29udmVydHMgbnVsbC91bmRlZmluZWQgdmFsdWVzIGludG8gZW1wdHkgb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0gez9PYmplY3Q9fSBhcmcgQXJndW1lbnQgdG8gYmUgbm9ybWFsaXplZCAobnVsbGFibGUgb3B0aW9uYWwpXG4gICAqIEByZXR1cm4geyFPYmplY3R9XG4gICAqL1xuICBub3JtYWxpemVNZXJnZUFyZzogZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGFyZyA9PT0gdW5kZWZpbmVkIHx8IGFyZyA9PT0gbnVsbCA/IHt9IDogYXJnO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJZiBtZXJnaW5nIEFycmF5cywgYSBtZXJnZSBzdHJhdGVneSAqbXVzdCogYmUgc3VwcGxpZWQuIElmIG5vdCwgaXQgaXNcbiAgICogbGlrZWx5IHRoZSBjYWxsZXIncyBmYXVsdC4gSWYgdGhpcyBmdW5jdGlvbiBpcyBldmVyIGNhbGxlZCB3aXRoIGFueXRoaW5nXG4gICAqIGJ1dCBgb25lYCBhbmQgYHR3b2AgYmVpbmcgYEFycmF5YHMsIGl0IGlzIHRoZSBmYXVsdCBvZiB0aGUgbWVyZ2UgdXRpbGl0aWVzLlxuICAgKlxuICAgKiBAcGFyYW0geyp9IG9uZSBBcnJheSB0byBtZXJnZSBpbnRvLlxuICAgKiBAcGFyYW0geyp9IHR3byBBcnJheSB0byBtZXJnZSBmcm9tLlxuICAgKi9cbiAgY2hlY2tNZXJnZUFycmF5QXJnczogZnVuY3Rpb24ob25lLCB0d28pIHtcbiAgICAoXCJwcm9kdWN0aW9uXCIgIT09IHByb2Nlc3MuZW52Lk5PREVfRU5WID8gaW52YXJpYW50KFxuICAgICAgQXJyYXkuaXNBcnJheShvbmUpICYmIEFycmF5LmlzQXJyYXkodHdvKSxcbiAgICAgICdUcmllZCB0byBtZXJnZSBhcnJheXMsIGluc3RlYWQgZ290ICVzIGFuZCAlcy4nLFxuICAgICAgb25lLFxuICAgICAgdHdvXG4gICAgKSA6IGludmFyaWFudChBcnJheS5pc0FycmF5KG9uZSkgJiYgQXJyYXkuaXNBcnJheSh0d28pKSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7Kn0gb25lIE9iamVjdCB0byBtZXJnZSBpbnRvLlxuICAgKiBAcGFyYW0geyp9IHR3byBPYmplY3QgdG8gbWVyZ2UgZnJvbS5cbiAgICovXG4gIGNoZWNrTWVyZ2VPYmplY3RBcmdzOiBmdW5jdGlvbihvbmUsIHR3bykge1xuICAgIG1lcmdlSGVscGVycy5jaGVja01lcmdlT2JqZWN0QXJnKG9uZSk7XG4gICAgbWVyZ2VIZWxwZXJzLmNoZWNrTWVyZ2VPYmplY3RBcmcodHdvKTtcbiAgfSxcblxuICAvKipcbiAgICogQHBhcmFtIHsqfSBhcmdcbiAgICovXG4gIGNoZWNrTWVyZ2VPYmplY3RBcmc6IGZ1bmN0aW9uKGFyZykge1xuICAgIChcInByb2R1Y3Rpb25cIiAhPT0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPyBpbnZhcmlhbnQoXG4gICAgICAhaXNUZXJtaW5hbChhcmcpICYmICFBcnJheS5pc0FycmF5KGFyZyksXG4gICAgICAnVHJpZWQgdG8gbWVyZ2UgYW4gb2JqZWN0LCBpbnN0ZWFkIGdvdCAlcy4nLFxuICAgICAgYXJnXG4gICAgKSA6IGludmFyaWFudCghaXNUZXJtaW5hbChhcmcpICYmICFBcnJheS5pc0FycmF5KGFyZykpKTtcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2tzIHRoYXQgYSBtZXJnZSB3YXMgbm90IGdpdmVuIGEgY2lyY3VsYXIgb2JqZWN0IG9yIGFuIG9iamVjdCB0aGF0IGhhZFxuICAgKiB0b28gZ3JlYXQgb2YgZGVwdGguXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBMZXZlbCBvZiByZWN1cnNpb24gdG8gdmFsaWRhdGUgYWdhaW5zdCBtYXhpbXVtLlxuICAgKi9cbiAgY2hlY2tNZXJnZUxldmVsOiBmdW5jdGlvbihsZXZlbCkge1xuICAgIChcInByb2R1Y3Rpb25cIiAhPT0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPyBpbnZhcmlhbnQoXG4gICAgICBsZXZlbCA8IE1BWF9NRVJHRV9ERVBUSCxcbiAgICAgICdNYXhpbXVtIGRlZXAgbWVyZ2UgZGVwdGggZXhjZWVkZWQuIFlvdSBtYXkgYmUgYXR0ZW1wdGluZyB0byBtZXJnZSAnICtcbiAgICAgICdjaXJjdWxhciBzdHJ1Y3R1cmVzIGluIGFuIHVuc3VwcG9ydGVkIHdheS4nXG4gICAgKSA6IGludmFyaWFudChsZXZlbCA8IE1BWF9NRVJHRV9ERVBUSCkpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVja3MgdGhhdCB0aGUgc3VwcGxpZWQgbWVyZ2Ugc3RyYXRlZ3kgaXMgdmFsaWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBBcnJheSBtZXJnZSBzdHJhdGVneS5cbiAgICovXG4gIGNoZWNrQXJyYXlTdHJhdGVneTogZnVuY3Rpb24oc3RyYXRlZ3kpIHtcbiAgICAoXCJwcm9kdWN0aW9uXCIgIT09IHByb2Nlc3MuZW52Lk5PREVfRU5WID8gaW52YXJpYW50KFxuICAgICAgc3RyYXRlZ3kgPT09IHVuZGVmaW5lZCB8fCBzdHJhdGVneSBpbiBtZXJnZUhlbHBlcnMuQXJyYXlTdHJhdGVnaWVzLFxuICAgICAgJ1lvdSBtdXN0IHByb3ZpZGUgYW4gYXJyYXkgc3RyYXRlZ3kgdG8gZGVlcCBtZXJnZSBmdW5jdGlvbnMgdG8gJyArXG4gICAgICAnaW5zdHJ1Y3QgdGhlIGRlZXAgbWVyZ2UgaG93IHRvIHJlc29sdmUgbWVyZ2luZyB0d28gYXJyYXlzLidcbiAgICApIDogaW52YXJpYW50KHN0cmF0ZWd5ID09PSB1bmRlZmluZWQgfHwgc3RyYXRlZ3kgaW4gbWVyZ2VIZWxwZXJzLkFycmF5U3RyYXRlZ2llcykpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZXQgb2YgcG9zc2libGUgYmVoYXZpb3JzIG9mIG1lcmdlIGFsZ29yaXRobXMgd2hlbiBlbmNvdW50ZXJpbmcgdHdvIEFycmF5c1xuICAgKiB0aGF0IG11c3QgYmUgbWVyZ2VkIHRvZ2V0aGVyLlxuICAgKiAtIGBjbG9iYmVyYDogVGhlIGxlZnQgYEFycmF5YCBpcyBpZ25vcmVkLlxuICAgKiAtIGBpbmRleEJ5SW5kZXhgOiBUaGUgcmVzdWx0IGlzIGFjaGlldmVkIGJ5IHJlY3Vyc2l2ZWx5IGRlZXAgbWVyZ2luZyBhdFxuICAgKiAgIGVhY2ggaW5kZXguIChub3QgeWV0IHN1cHBvcnRlZC4pXG4gICAqL1xuICBBcnJheVN0cmF0ZWdpZXM6IGtleU1pcnJvcih7XG4gICAgQ2xvYmJlcjogdHJ1ZSxcbiAgICBJbmRleEJ5SW5kZXg6IHRydWVcbiAgfSlcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBtZXJnZUhlbHBlcnM7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiRldhQVNIXCIpKSIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBtZXJnZUludG9cbiAqIEB0eXBlY2hlY2tzIHN0YXRpYy1vbmx5XG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZXJnZUhlbHBlcnMgPSByZXF1aXJlKFwiLi9tZXJnZUhlbHBlcnNcIik7XG5cbnZhciBjaGVja01lcmdlT2JqZWN0QXJnID0gbWVyZ2VIZWxwZXJzLmNoZWNrTWVyZ2VPYmplY3RBcmc7XG5cbi8qKlxuICogU2hhbGxvdyBtZXJnZXMgdHdvIHN0cnVjdHVyZXMgYnkgbXV0YXRpbmcgdGhlIGZpcnN0IHBhcmFtZXRlci5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb25lIE9iamVjdCB0byBiZSBtZXJnZWQgaW50by5cbiAqIEBwYXJhbSB7P29iamVjdH0gdHdvIE9wdGlvbmFsIG9iamVjdCB3aXRoIHByb3BlcnRpZXMgdG8gbWVyZ2UgZnJvbS5cbiAqL1xuZnVuY3Rpb24gbWVyZ2VJbnRvKG9uZSwgdHdvKSB7XG4gIGNoZWNrTWVyZ2VPYmplY3RBcmcob25lKTtcbiAgaWYgKHR3byAhPSBudWxsKSB7XG4gICAgY2hlY2tNZXJnZU9iamVjdEFyZyh0d28pO1xuICAgIGZvciAodmFyIGtleSBpbiB0d28pIHtcbiAgICAgIGlmICghdHdvLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBvbmVba2V5XSA9IHR3b1trZXldO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlSW50bztcbiIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL3ZhciBTdGF0ZSA9IHJlcXVpcmUoJy4uL3N0YXRlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRwbGF5OmZ1bmN0aW9uKCkge1xuXHRcdFN0YXRlLmRpc3BhdGNoKCdHQU1FX1BMQVknKTtcblx0fSxcblxuXHRwYXVzZTpmdW5jdGlvbigpIHtcblx0XHRTdGF0ZS5kaXNwYXRjaCgnR0FNRV9QQVVTRScpO1xuXHR9LFxuXG5cdHRvZ2dsZTpmdW5jdGlvbigpIHtcblx0XHRTdGF0ZS5kaXNwYXRjaCgnR0FNRV9UT0dHTEUnKTtcblx0fSxcblxuXHRsb3N0OmZ1bmN0aW9uKCkge1xuXHRcdFN0YXRlLmRpc3BhdGNoKCdHQU1FX0xPU1QnKTtcblx0fVxufTtcbiIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL3ZhciBTdGF0ZSA9IHJlcXVpcmUoJy4uL3N0YXRlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRqdW1wOiBmdW5jdGlvbigpIHtcblx0XHRTdGF0ZS5kaXNwYXRjaCgnUExBWUVSX0pVTVAnKTtcblx0fVxufTtcbiIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL3ZhciBHYW1lID0gcmVxdWlyZSgnLi9zdG9yZXMvZ2FtZScpO1xudmFyIFNjZW5lID0gcmVxdWlyZSgnLi92aWV3cy9zY2VuZScpO1xudmFyIFN0YXRlID0gcmVxdWlyZSgnLi9zdGF0ZScpO1xudmFyIFdvcmxkID0gcmVxdWlyZSgnLi9zdG9yZXMvd29ybGQnKTtcblxucmVxdWlyZSgnLi9saXN0ZW5lcnMva2V5Ym9hcmQnKTtcbi8vcmVxdWlyZSgnLi9saXN0ZW5lcnMvbWljcm9waG9uZScpO1xuXG4oZnVuY3Rpb24gbG9vcCAoKSB7XG5cdGlmIChHYW1lLmdldCgncGxheWluZycpICYmICFHYW1lLmdldCgnaGFzTG9zdCcpKSBTdGF0ZS5kaXNwYXRjaCgnR0xPQkFMX1VQREFURScpO1xuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG59KCkpXG4iLCIvKiogQGpzeCBSZWFjdC5ET00gKi9tb2R1bGUuZXhwb3J0cyA9IHtcblx0RVNDQVBFOiAyNyxcblx0VVA6IDM4XG59O1xuIiwiLyoqIEBqc3ggUmVhY3QuRE9NICovdmFyIFBsYXllckFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL3BsYXllcicpO1xudmFyIEdhbWVBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9nYW1lJyk7XG52YXIgS2V5cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9rZXlzJyk7XG5cbnZhciBVUCA9IEtleXMuVVAsIEVTQ0FQRSA9IEtleXMuRVNDQVBFO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbihlKSAge1xuXHRzd2l0Y2ggKGUud2hpY2gpIHtcblx0XHRjYXNlIFVQOlxuXHRcdFx0UGxheWVyQWN0aW9ucy5qdW1wKCk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIEVTQ0FQRTpcblx0XHRcdEdhbWVBY3Rpb25zLnRvZ2dsZSgpO1xuXHRcdFx0YnJlYWs7XG5cdH1cbn0pO1xuIiwiLyoqIEBqc3ggUmVhY3QuRE9NICovdmFyIERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9saWIvZGlzcGF0Y2hlcicpO1xubW9kdWxlLmV4cG9ydHMgPSBuZXcgRGlzcGF0Y2hlcigpO1xuIiwiLyoqIEBqc3ggUmVhY3QuRE9NICovdmFyIFN0b3JlICA9IHJlcXVpcmUoJy4uLy4uL2xpYi9zdG9yZScpXG52YXIgU3RhdGUgID0gcmVxdWlyZSgnLi4vc3RhdGUnKTtcbnZhciBWZWN0b3IgPSByZXF1aXJlKCcuLi8uLi9saWIvdmVjdG9yJyk7XG5cbnZhciBncmF2aXR5ID0gbmV3IFZlY3RvcigwLCAwLjE1KTtcblxudmFyIFBsYXllciA9IFN0b3JlLmNsb25lKHtcblx0X2RhdGE6IHtcblx0XHRhY2NlbCAgICA6IG5ldyBWZWN0b3IoMCwgMCksXG5cdFx0aGVpZ2h0ICAgOiAyNCxcblx0XHRtYXhTcGVlZCA6IDYsXG5cdFx0bG9jYXRpb24gOiBuZXcgVmVjdG9yKDEwMCwgd2luZG93LmlubmVySGVpZ2h0IC8gMiksXG5cdFx0dmVsb2NpdHkgOiBuZXcgVmVjdG9yKDAsIDApLFxuXHRcdHdpZHRoICAgIDogMzRcblx0fSxcblxuXHR1cGRhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB2YXIkNSA9IHRoaXMuX2RhdGEsIGFjY2VsID0gdmFyJDUuYWNjZWwsIGxvY2F0aW9uID0gdmFyJDUubG9jYXRpb24sIG1heFNwZWVkID0gdmFyJDUubWF4U3BlZWQsIHZlbG9jaXR5ID0gdmFyJDUudmVsb2NpdHk7XG5cblx0XHRhY2NlbC5hZGQoZ3Jhdml0eSk7XG5cblx0XHR2ZWxvY2l0eS5hZGQoYWNjZWwpO1xuXHRcdGxvY2F0aW9uLmFkZCh2ZWxvY2l0eSk7XG5cdFx0YWNjZWwubXVsdCgwKTtcblxuXHRcdHZlbG9jaXR5LmxpbWl0KG1heFNwZWVkKTtcblx0fSxcblxuXHRqdW1wOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgdmFyJDYgPSB0aGlzLl9kYXRhLCB2ZWxvY2l0eSA9IHZhciQ2LnZlbG9jaXR5LCBhY2NlbCA9IHZhciQ2LmFjY2VsO1xuXG5cdFx0dmVsb2NpdHkueSA9IE1hdGgubWluKHZlbG9jaXR5LnksIDApO1xuXG5cdFx0YWNjZWwuYWRkKG5ldyBWZWN0b3IoMCwgLTIpKVxuXHR9XG59KTtcblxuU3RhdGUucmVnaXN0ZXIoe1xuXHRQTEFZRVJfSlVNUDogZnVuY3Rpb24oKSB7XG5cdFx0UGxheWVyLmp1bXAoKTtcblx0fSxcblxuXHRHTE9CQUxfVVBEQVRFOiBmdW5jdGlvbigpIHtcblx0XHRQbGF5ZXIudXBkYXRlKCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjtcbiIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL3ZhciBTdG9yZSA9IHJlcXVpcmUoJy4uLy4uL2xpYi9zdG9yZScpO1xudmFyIFBsYXllciA9IHJlcXVpcmUoJy4vUGxheWVyJyk7XG5cbnZhciBIRUlHSFQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG52YXIgV0lEVEggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbnZhciBST1dTID0gNDA7XG52YXIgQ09MUyA9IDEwO1xudmFyIFNDQUxFWCA9IDUwMDtcbnZhciBTQ0FMRVkgPSBIRUlHSFQgLyBDT0xTO1xuXG52YXIgX2RhdGEgPSB7XG5cdGJsb2NrcyA6IFtdLFxuXHRjb2xzICAgOiBDT0xTLFxuXHRoZWlnaHQgOiBIRUlHSFQsXG5cdG1hcCAgICA6IFtdLFxuXHRyb3dzICAgOiBST1dTLFxuXHRzY2FsZVggOiBTQ0FMRVgsXG5cdHNjYWxlWSA6IFNDQUxFWSxcblx0d2lkdGggIDogV0lEVEhcbn1cblxudmFyIG9mZnNldCA9IDgwMDtcbnZhciBzZXBhcmF0aW9uID0gMzAwO1xudmFyIHBpcGVXaWR0aCA9IDQwO1xuXG5mb3IgKHZhciB4ID0gMDsgeCA8IFJPV1M7IHgrKykge1xuXHR2YXIgb3BlbmluZyA9IE1hdGgucmFuZG9tKCkgKiAoSEVJR0hUIC8gMikgfCAwXG5cblx0X2RhdGEuYmxvY2tzLnB1c2goe1xuXHRcdGhlaWdodDogb3BlbmluZyxcblx0XHR3aWR0aDogcGlwZVdpZHRoLFxuXHRcdHg6IG9mZnNldCArIHggKiBzZXBhcmF0aW9uLFxuXHRcdHk6IDBcblx0fSk7XG5cblx0X2RhdGEuYmxvY2tzLnB1c2goe1xuXHRcdGhlaWdodDogSEVJR0hUIC0gKG9wZW5pbmcgKyAyMDApLFxuXHRcdHdpZHRoOiBwaXBlV2lkdGgsXG5cdFx0eDogb2Zmc2V0ICsgeCAqIHNlcGFyYXRpb24sXG5cdFx0eTogb3BlbmluZyArIDE3MFxuXHR9KTtcbn1cblxudmFyIEJsb2NrcyA9IFN0b3JlLmNsb25lKHtcblx0X2RhdGE6IF9kYXRhLFxuXG5cdHRvdGFsV2lkdGg6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBST1dTICogU0NBTEVYICsgU0NBTEVZO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBCbG9ja3M7XG4iLCIvKiogQGpzeCBSZWFjdC5ET00gKi92YXIgU3RvcmUgPSByZXF1aXJlKCcuLi8uLi9saWIvc3RvcmUnKTtcbnZhciBTdGF0ZSA9IHJlcXVpcmUoJy4uL3N0YXRlJyk7XG5cbnZhciBHYW1lID0gU3RvcmUuY2xvbmUoe1xuXHRfZGF0YToge1xuXHRcdGxvc3QgICAgOiBmYWxzZSxcblx0XHRwbGF5aW5nIDogZmFsc2UsXG5cdFx0c2Nyb2xsICA6IDBcblx0fSxcblxuXHRwbGF5OmZ1bmN0aW9uKCkge1xuXHRcdEdhbWUuc2V0KCdwbGF5aW5nJywgdHJ1ZSk7XG5cdH0sXG5cblx0cGF1c2U6ZnVuY3Rpb24oKSB7XG5cdFx0R2FtZS5zZXQoJ3BsYXlpbmcnLCBmYWxzZSk7XG5cdH0sXG5cblx0dG9nZ2xlOmZ1bmN0aW9uKCkge1xuXHRcdEdhbWUuc2V0KCdwbGF5aW5nJywgIUdhbWUuZ2V0KCdwbGF5aW5nJykpO1xuXHR9LFxuXG5cdHVwZGF0ZTpmdW5jdGlvbigpIHtcblx0XHRHYW1lLnNldCgnc2Nyb2xsJywgR2FtZS5nZXQoJ3Njcm9sbCcpICsgMyk7XG5cdH1cbn0pO1xuXG5TdGF0ZS5yZWdpc3Rlcih7XG5cdEdBTUVfUExBWTpmdW5jdGlvbigpIHtcblx0XHRHYW1lLnBsYXkoKTtcblx0fSxcblxuXHRHQU1FX1BBVVNFOmZ1bmN0aW9uKCkge1xuXHRcdEdhbWUucGF1c2UoKTtcblx0fSxcblxuXHRHQU1FX1RPR0dMRTpmdW5jdGlvbigpIHtcblx0XHRHYW1lLnRvZ2dsZSgpO1xuXHR9LFxuXG5cdEdBTUVfTE9TVDpmdW5jdGlvbigpIHtcblx0XHRHYW1lLnNldCgnbG9zdCcsIERhdGUubm93KCkpO1xuXHR9LFxuXG5cdEdMT0JBTF9VUERBVEU6ZnVuY3Rpb24oKSB7XG5cdFx0R2FtZS51cGRhdGUoKTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcbiIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL3ZhciBTdG9yZSAgPSByZXF1aXJlKCcuLi8uLi9saWIvc3RvcmUnKVxudmFyIFN0YXRlICA9IHJlcXVpcmUoJy4uL3N0YXRlJyk7XG52YXIgVmVjdG9yID0gcmVxdWlyZSgnLi4vLi4vbGliL3ZlY3RvcicpO1xuXG52YXIgZ3Jhdml0eSA9IG5ldyBWZWN0b3IoMCwgMC4xNSk7XG5cbnZhciBQbGF5ZXIgPSBTdG9yZS5jbG9uZSh7XG5cdF9kYXRhOiB7XG5cdFx0YWNjZWwgICAgOiBuZXcgVmVjdG9yKDAsIDApLFxuXHRcdGhlaWdodCAgIDogMjQsXG5cdFx0bWF4U3BlZWQgOiA2LFxuXHRcdGxvY2F0aW9uIDogbmV3IFZlY3RvcigxMDAsIHdpbmRvdy5pbm5lckhlaWdodCAvIDIpLFxuXHRcdHZlbG9jaXR5IDogbmV3IFZlY3RvcigwLCAwKSxcblx0XHR3aWR0aCAgICA6IDM0XG5cdH0sXG5cblx0dXBkYXRlOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgdmFyJDIgPSB0aGlzLl9kYXRhLCBhY2NlbCA9IHZhciQyLmFjY2VsLCBsb2NhdGlvbiA9IHZhciQyLmxvY2F0aW9uLCBtYXhTcGVlZCA9IHZhciQyLm1heFNwZWVkLCB2ZWxvY2l0eSA9IHZhciQyLnZlbG9jaXR5O1xuXG5cdFx0YWNjZWwuYWRkKGdyYXZpdHkpO1xuXG5cdFx0dmVsb2NpdHkuYWRkKGFjY2VsKTtcblx0XHRsb2NhdGlvbi5hZGQodmVsb2NpdHkpO1xuXHRcdGFjY2VsLm11bHQoMCk7XG5cblx0XHR2ZWxvY2l0eS5saW1pdChtYXhTcGVlZCk7XG5cdH0sXG5cblx0anVtcDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHZhciQzID0gdGhpcy5fZGF0YSwgdmVsb2NpdHkgPSB2YXIkMy52ZWxvY2l0eSwgYWNjZWwgPSB2YXIkMy5hY2NlbDtcblxuXHRcdHZlbG9jaXR5LnkgPSBNYXRoLm1pbih2ZWxvY2l0eS55LCAwKTtcblxuXHRcdGFjY2VsLmFkZChuZXcgVmVjdG9yKDAsIC0yKSlcblx0fVxufSk7XG5cblN0YXRlLnJlZ2lzdGVyKHtcblx0UExBWUVSX0pVTVA6IGZ1bmN0aW9uKCkge1xuXHRcdFBsYXllci5qdW1wKCk7XG5cdH0sXG5cblx0R0xPQkFMX1VQREFURTogZnVuY3Rpb24oKSB7XG5cdFx0UGxheWVyLnVwZGF0ZSgpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXI7XG4iLCIvKiogQGpzeCBSZWFjdC5ET00gKi92YXIgU3RvcmUgID0gcmVxdWlyZSgnLi4vLi4vbGliL3N0b3JlJyk7XG52YXIgU3RhdGUgID0gcmVxdWlyZSgnLi4vc3RhdGUnKTtcbnZhciBWZWN0b3IgPSByZXF1aXJlKCcuLi8uLi9saWIvdmVjdG9yJyk7XG5cbnZhciBQbGF5ZXIgPSByZXF1aXJlKCcuL3BsYXllcicpO1xudmFyIEdhbWUgICA9IHJlcXVpcmUoJy4vZ2FtZScpO1xudmFyIEJsb2NrcyA9IHJlcXVpcmUoJy4vYmxvY2tzJyk7XG5cbnZhciBHYW1lQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvZ2FtZScpO1xuXG52YXIgV29ybGQgPSBTdG9yZS5jbG9uZSh7XG5cdF9kYXRhOiB7XG5cdFx0Z3Jhdml0eSAgICAgIDogbmV3IFZlY3RvcigwLCAwLjUpLFxuXHRcdGVsZXZhdGlvbiAgICA6IDExMixcblx0XHR3aW5kb3dIZWlnaHQgOiB3aW5kb3cuaW5uZXJIZWlnaHQsXG5cdFx0d2luZG93V2lkdGggIDogd2luZG93LmlubmVyV2lkdGhcblx0fSxcblxuXHR1cGRhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLmNoZWNrQ29sbGlzaW9ucygpKSBHYW1lQWN0aW9ucy5sb3N0KCk7XG5cdH0sXG5cblx0Y2hlY2tDb2xsaXNpb25zOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgdmFyJDAgPSBQbGF5ZXIuZ2V0KCksIGxvY2F0aW9uID0gdmFyJDAubG9jYXRpb24sIHdpZHRoID0gdmFyJDAud2lkdGgsIGhlaWdodCA9IHZhciQwLmhlaWdodDtcblx0XHR2YXIgeCA9IGxvY2F0aW9uLngsIHkgPSBsb2NhdGlvbi55O1xuXHRcdHZhciBibG9ja3MgPSBCbG9ja3MuZ2V0KCdibG9ja3MnKTtcblx0XHR2YXIgc2Nyb2xsID0gR2FtZS5nZXQoJ3Njcm9sbCcpO1xuXG5cdFx0aWYgKHkgPiB0aGlzLmdldCgnd2luZG93SGVpZ2h0JykgLSB0aGlzLmdldCgnZWxldmF0aW9uJykpIHJldHVybiB0cnVlO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IGJsb2Nrcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0dmFyIGIgPSBibG9ja3NbaV07XG5cblx0XHRcdGlmICh4ICsgd2lkdGggPCBiLnggLSBzY3JvbGwpICAgICBjb250aW51ZTtcblx0XHRcdGlmICh4ID4gKGIueCArIGIud2lkdGgpIC0gc2Nyb2xsKSBjb250aW51ZTtcblx0XHRcdGlmICh5ICsgaGVpZ2h0IDwgYi55KSAgICAgICAgICAgICBjb250aW51ZTtcblx0XHRcdGlmICh5ID4gYi55ICsgYi5oZWlnaHQpICAgICAgICAgICBjb250aW51ZTtcblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9XG59KTtcblxuU3RhdGUucmVnaXN0ZXIoe1xuXHRHTE9CQUxfVVBEQVRFOiBmdW5jdGlvbigpIHtcblx0XHRXb3JsZC51cGRhdGUoKTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gV29ybGQ7XG4iLCIvKiogQGpzeCBSZWFjdC5ET00gKi92YXIgV29ybGQgPSByZXF1aXJlKCcuLi9zdG9yZXMvd29ybGQnKTtcbnZhciBHYW1lID0gcmVxdWlyZSgnLi4vc3RvcmVzL2dhbWUnKTtcblxudmFyIGxhbmRMb2FkZWQgPSBmYWxzZTtcbnZhciBsYW5kID0gbmV3IEltYWdlKCk7XG5sYW5kLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRsYW5kTG9hZGVkID0gdHJ1ZTtcbn07XG5sYW5kLnNyYyA9IFwiYXNzZXRzL2xhbmQucG5nXCI7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRkcmF3OmZ1bmN0aW9uKGN0eCwgd2lkdGgsIGhlaWdodCkge1xuXHRcdGlmICghbGFuZExvYWRlZCkgcmV0dXJuO1xuXHRcdGN0eC5zYXZlKCk7XG5cblx0XHR2YXIgZWxldmF0aW9uID0gV29ybGQuZ2V0KCdlbGV2YXRpb24nKTtcblxuXHRcdGN0eC5zYXZlKCk7XG5cdFx0Y3R4LnRyYW5zbGF0ZSgtR2FtZS5nZXQoJ3Njcm9sbCcpLCBoZWlnaHQgLSBlbGV2YXRpb24pO1xuXG5cdFx0dmFyIGxhbmRQYXR0ZXJuID0gY3R4LmNyZWF0ZVBhdHRlcm4obGFuZCwgJ3JlcGVhdCcpO1xuXHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRjdHgucmVjdCgwLCAwLCB3aWR0aCArIEdhbWUuZ2V0KCdzY3JvbGwnKSwgZWxldmF0aW9uKTtcblx0XHRjdHguZmlsbFN0eWxlID0gbGFuZFBhdHRlcm47XG5cdFx0Y3R4LmZpbGwoKTtcblx0XHRjdHgucmVzdG9yZSgpO1xuXHR9XG59O1xuIiwiLyoqIEBqc3ggUmVhY3QuRE9NICovdmFyIEJsb2NrcyA9IHJlcXVpcmUoXCIuLi9zdG9yZXMvYmxvY2tzXCIpO1xudmFyIEdhbWUgICA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9nYW1lJyk7XG52YXIgV29ybGQgID0gcmVxdWlyZSgnLi4vc3RvcmVzL3dvcmxkJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRkcmF3OmZ1bmN0aW9uKGN0eCwgd2lkdGgsIGhlaWdodCkge1xuXHRcdHZhciBlbGV2YXRpb24gPSBXb3JsZC5nZXQoJ2VsZXZhdGlvbicpO1xuXHRcdHZhciBzY3JvbGwgPSBHYW1lLmdldCgnc2Nyb2xsJyk7XG5cdFx0Y3R4LnNhdmUoKTtcblxuXHRcdGN0eC50cmFuc2xhdGUoLXNjcm9sbCwgMCk7XG5cblx0XHRjdHguZmlsbFN0eWxlID0gXCIjNjlCRjRDXCI7XG5cdFx0Y3R4LmxpbmVXaWR0aCA9IDI7XG5cdFx0Y3R4LnN0cm9rZVN0eWxlID0gXCIjNTQzQTQ2XCI7XG5cblx0XHRCbG9ja3MuZ2V0KCdibG9ja3MnKS5mb3JFYWNoKGZ1bmN0aW9uKGVudGl0eSkge1xuXHRcdFx0dmFyIHggPSBlbnRpdHkueCwgeSA9IGVudGl0eS55LCB3aWR0aCA9IGVudGl0eS53aWR0aCwgaGVpZ2h0ID0gZW50aXR5LmhlaWdodDtcblxuXHRcdFx0aWYgKFdvcmxkLmdldCgnZGVidWcnKSkge1xuXHRcdFx0XHRjdHguc2F2ZSgpO1xuXHRcdFx0XHRjdHguZmlsbFN0eWxlID0gXCIjZmZmXCJcblx0XHRcdFx0Y3R4LmZvbnQgPSBcIjI0cHggbW9ub3NwYWNlXCI7XG5cdFx0XHRcdGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcblx0XHRcdFx0Y3R4LmZpbGxUZXh0KCh4IC0gc2Nyb2xsKSArICcsJyArIHksIHggKyAxNSwgeSAtIDEwKTtcblx0XHRcdFx0Y3R4LnJlc3RvcmUoKTtcblx0XHRcdH1cblxuXHRcdFx0Y3R4LmZpbGxSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpXG5cdFx0XHRjdHguc3Ryb2tlUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KVxuXHRcdH0pO1xuXG5cdFx0Y3R4LnJlc3RvcmUoKTtcbiBcdH1cbn07XG4iLCIvKiogQGpzeCBSZWFjdC5ET00gKi92YXIgUGxheWVyICAgICAgPSByZXF1aXJlKFwiLi4vc3RvcmVzL3BsYXllclwiKTtcbnZhciBpbWFnZUxvYWRlciA9IHJlcXVpcmUoJy4uLy4uL2xpYi9pbWFnZUxvYWRlcicpO1xuXG52YXIgcHJlbG9hZCA9IGltYWdlTG9hZGVyKFtcblx0Jy9hc3NldHMvYmlyZC0wMS5wbmcnLFxuXHQnL2Fzc2V0cy9iaXJkLTAyLnBuZycsXG5cdCcvYXNzZXRzL2JpcmQtMDMucG5nJyxcblx0Jy9hc3NldHMvYmlyZC0wNC5wbmcnXG5dKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGZyYW1lICAgIDogMCxcblx0ZnJhbWVzICAgOiAzLFxuXHRpbnRlcnZhbCA6IDEwMCxcblx0dGhlbiAgICAgOiBEYXRlLm5vdygpLFxuXG5cdGRyYXc6IGZ1bmN0aW9uKGN0eCkge1xuXHRcdHZhciB2YXIkMTUgPSBQbGF5ZXIuZ2V0KCksIGhlaWdodCA9IHZhciQxNS5oZWlnaHQsIGxvY2F0aW9uID0gdmFyJDE1LmxvY2F0aW9uLCB3aWR0aCA9IHZhciQxNS53aWR0aDtcblxuXHRcdHByZWxvYWQudGhlbihmdW5jdGlvbihpbWFnZXMpIHtcblx0XHRcdGN0eC5zYXZlKCk7XG5cdFx0XHR2YXIgbm93ICA9IERhdGUubm93KCk7XG5cblx0XHRcdGlmIChub3cgLSB0aGlzLnRoZW4gPiB0aGlzLmludGVydmFsKSB7XG5cdFx0XHRcdHRoaXMuZnJhbWUgPSB0aGlzLmZyYW1lID49IHRoaXMuZnJhbWVzPyAwIDogdGhpcy5mcmFtZSArIDE7XG5cdFx0XHRcdHRoaXMudGhlbiA9IG5vdztcblx0XHRcdH1cblx0XHRcdGN0eC5kcmF3SW1hZ2UoaW1hZ2VzW3RoaXMuZnJhbWVdLCBsb2NhdGlvbi54LCBsb2NhdGlvbi55KTtcblxuXHRcdFx0Y3R4LnJlc3RvcmUoKTtcblx0XHR9LmJpbmQodGhpcykpO1xuXHR9XG59O1xuIiwiLyoqIEBqc3ggUmVhY3QuRE9NICovdmFyIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHJlcXVpcmUoJy4uLy4uL2xpYi9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUnKTtcblxudmFyIFBsYXllciA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9wbGF5ZXInKTtcbnZhciBHYW1lICAgPSByZXF1aXJlKCcuLi9zdG9yZXMvZ2FtZScpO1xudmFyIEJsb2NrcyA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9ibG9ja3MnKTtcbnZhciBXb3JsZCAgPSByZXF1aXJlKCcuLi9zdG9yZXMvd29ybGQnKTtcblxudmFyIFBsYXllckFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL3BsYXllcicpO1xudmFyIEdhbWVBY3Rpb25zICAgPSByZXF1aXJlKCcuLi9hY3Rpb25zL2dhbWUnKTtcbnZhciBQbGF5ZXJWaWV3ICAgID0gcmVxdWlyZSgnLi9wbGF5ZXInKTtcbnZhciBNYXBWaWV3ICAgICAgID0gcmVxdWlyZSgnLi9tYXAnKTtcblxudmFyIGNhbnZhcyAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcbnZhciBjdHggICAgICAgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbmNhbnZhcy53aWR0aCAgPSBCbG9ja3MuZ2V0KCd3aWR0aCcpO1xuY2FudmFzLmhlaWdodCA9IEJsb2Nrcy5nZXQoJ2hlaWdodCcpO1xuXG52YXIgTGFuZCA9IHJlcXVpcmUoJy4vbGFuZCcpO1xudmFyIFNreSAgPSByZXF1aXJlKCcuL3NreScpO1xuXG5mdW5jdGlvbiBkcmF3KCkge1xuXHRjdHguc2F2ZSgpO1xuXG5cdHZhciB3aWR0aCA9IGNhbnZhcy53aWR0aCwgaGVpZ2h0ID0gY2FudmFzLmhlaWdodDtcblx0dmFyIHNjcm9sbCA9IEdhbWUuZ2V0KCdzY3JvbGwnKTtcblxuXHRjdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXG5cdFNreS5kcmF3KGN0eCwgd2lkdGgsIGhlaWdodCk7XG5cdFBsYXllclZpZXcuZHJhdyhjdHgpO1xuXHRNYXBWaWV3LmRyYXcoY3R4LCB3aWR0aCwgaGVpZ2h0KTtcblx0TGFuZC5kcmF3KGN0eCwgd2lkdGgsIGhlaWdodCk7XG5cblx0dmFyIGlzUGxheWluZyA9IEdhbWUuZ2V0KCdwbGF5aW5nJyk7XG5cdHZhciBoYXNMb3N0ID0gR2FtZS5nZXQoJ2xvc3QnKTtcblxuXHRpZiAoIWlzUGxheWluZyB8fCBoYXNMb3N0KSB7XG5cdFx0Y3R4LmZpbGxTdHlsZSA9IFwicmdiYSgwLCAwLCAwLCAwLjUpXCI7XG5cdFx0Y3R4LmZpbGxSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpXG5cblx0XHRjdHguZm9udCA9IFwiMzZwdCBNb25vc3BhY2VcIjtcblx0XHRjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcblx0XHRjdHguZmlsbFN0eWxlID0gXCIjZmZmXCI7XG5cdFx0Y3R4LmZpbGxUZXh0KGhhc0xvc3QgPyBcIkdBTUUgT1ZFUlwiIDogXCJQQVVTRURcIiwgd2lkdGggLyAyLCBoZWlnaHQgLyAyKTtcblx0fVxuXG5cdGN0eC5yZXN0b3JlKCk7XG59XG5cbnZhciBmcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiBsb29wKCkge1xuXHRmcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcblx0ZHJhdygpO1xufSk7XG4iLCIvKiogQGpzeCBSZWFjdC5ET00gKi92YXIgV29ybGQgPSByZXF1aXJlKCcuLi9zdG9yZXMvd29ybGQnKTtcblxudmFyIHNreUxvYWRlZCA9IGZhbHNlO1xudmFyIHNreSA9IG5ldyBJbWFnZSgpO1xuc2t5Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRza3lMb2FkZWQgPSB0cnVlO1xufTtcbnNreS5zcmMgPSBcImFzc2V0cy9za3kucG5nXCI7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRkcmF3OiBmdW5jdGlvbihjdHgsIHdpZHRoLCBoZWlnaHQpIHtcblx0XHRpZiAoIXNreUxvYWRlZCkgcmV0dXJuO1xuXHRcdGN0eC5zYXZlKCk7XG5cblx0XHR2YXIgZWxldmF0aW9uID0gV29ybGQuZ2V0KCdlbGV2YXRpb24nKTtcblxuXHRcdGN0eC5zYXZlKCk7XG5cdFx0Y3R4LnRyYW5zbGF0ZSgwLCAoaGVpZ2h0IC0gZWxldmF0aW9uKSAtIHNreS5oZWlnaHQpO1xuXG5cdFx0dmFyIHNreVBhdHRlcm4gPSBjdHguY3JlYXRlUGF0dGVybihza3ksICdyZXBlYXQnKTtcblx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0Y3R4LnJlY3QoMCwgMCwgd2lkdGgsIHNreS5oZWlnaHQpO1xuXHRcdGN0eC5maWxsU3R5bGUgPSBza3lQYXR0ZXJuO1xuXHRcdGN0eC5maWxsKCk7XG5cdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXHRcdGN0eC5yZXN0b3JlKCk7XG5cdH1cbn07XG4iXX0=
