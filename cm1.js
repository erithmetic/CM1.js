var require = function (file, cwd) {
    var resolved = require.resolve(file, cwd || '/');
    var mod = require.modules[resolved];
    if (!mod) throw new Error(
        'Failed to resolve module ' + file + ', tried ' + resolved
    );
    var res = mod._cached ? mod._cached : mod();
    return res;
}

require.paths = [];
require.modules = {};
require.extensions = [".js",".coffee"];

require._core = {
    'assert': true,
    'events': true,
    'fs': true,
    'path': true,
    'vm': true
};

require.resolve = (function () {
    return function (x, cwd) {
        if (!cwd) cwd = '/';
        
        if (require._core[x]) return x;
        var path = require.modules.path();
        var y = cwd || '.';
        
        if (x.match(/^(?:\.\.?\/|\/)/)) {
            var m = loadAsFileSync(path.resolve(y, x))
                || loadAsDirectorySync(path.resolve(y, x));
            if (m) return m;
        }
        
        var n = loadNodeModulesSync(x, y);
        if (n) return n;
        
        throw new Error("Cannot find module '" + x + "'");
        
        function loadAsFileSync (x) {
            if (require.modules[x]) {
                return x;
            }
            
            for (var i = 0; i < require.extensions.length; i++) {
                var ext = require.extensions[i];
                if (require.modules[x + ext]) return x + ext;
            }
        }
        
        function loadAsDirectorySync (x) {
            x = x.replace(/\/+$/, '');
            var pkgfile = x + '/package.json';
            if (require.modules[pkgfile]) {
                var pkg = require.modules[pkgfile]();
                var b = pkg.browserify;
                if (typeof b === 'object' && b.main) {
                    var m = loadAsFileSync(path.resolve(x, b.main));
                    if (m) return m;
                }
                else if (typeof b === 'string') {
                    var m = loadAsFileSync(path.resolve(x, b));
                    if (m) return m;
                }
                else if (pkg.main) {
                    var m = loadAsFileSync(path.resolve(x, pkg.main));
                    if (m) return m;
                }
            }
            
            return loadAsFileSync(x + '/index');
        }
        
        function loadNodeModulesSync (x, start) {
            var dirs = nodeModulesPathsSync(start);
            for (var i = 0; i < dirs.length; i++) {
                var dir = dirs[i];
                var m = loadAsFileSync(dir + '/' + x);
                if (m) return m;
                var n = loadAsDirectorySync(dir + '/' + x);
                if (n) return n;
            }
            
            var m = loadAsFileSync(x);
            if (m) return m;
        }
        
        function nodeModulesPathsSync (start) {
            var parts;
            if (start === '/') parts = [ '' ];
            else parts = path.normalize(start).split('/');
            
            var dirs = [];
            for (var i = parts.length - 1; i >= 0; i--) {
                if (parts[i] === 'node_modules') continue;
                var dir = parts.slice(0, i + 1).join('/') + '/node_modules';
                dirs.push(dir);
            }
            
            return dirs;
        }
    };
})();

require.alias = function (from, to) {
    var path = require.modules.path();
    var res = null;
    try {
        res = require.resolve(from + '/package.json', '/');
    }
    catch (err) {
        res = require.resolve(from, '/');
    }
    var basedir = path.dirname(res);
    
    var keys = Object_keys(require.modules);
    
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.slice(0, basedir.length + 1) === basedir + '/') {
            var f = key.slice(basedir.length);
            require.modules[to + f] = require.modules[basedir + f];
        }
        else if (key === basedir) {
            require.modules[to] = require.modules[basedir];
        }
    }
};

require.define = function (filename, fn) {
    var dirname = require._core[filename]
        ? ''
        : require.modules.path().dirname(filename)
    ;
    
    var require_ = function (file) {
        return require(file, dirname)
    };
    require_.resolve = function (name) {
        return require.resolve(name, dirname);
    };
    require_.modules = require.modules;
    require_.define = require.define;
    var module_ = { exports : {} };
    
    require.modules[filename] = function () {
        require.modules[filename]._cached = module_.exports;
        fn.call(
            module_.exports,
            require_,
            module_,
            module_.exports,
            dirname,
            filename
        );
        require.modules[filename]._cached = module_.exports;
        return module_.exports;
    };
};

var Object_keys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) res.push(key)
    return res;
};

if (typeof process === 'undefined') process = {};

if (!process.nextTick) process.nextTick = function (fn) {
    setTimeout(fn, 0);
};

if (!process.title) process.title = 'browser';

if (!process.binding) process.binding = function (name) {
    if (name === 'evals') return require('vm')
    else throw new Error('No such module')
};

if (!process.cwd) process.cwd = function () { return '.' };

require.define("path", function (require, module, exports, __dirname, __filename) {
    function filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  var isWindows = false;
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};

});

require.define("/node_modules/dkastner-http-browserify/package.json", function (require, module, exports, __dirname, __filename) {
    module.exports = {"main":"index.js","browserify":"browser.js"}
});

require.define("/node_modules/dkastner-http-browserify/browser.js", function (require, module, exports, __dirname, __filename) {
    var http = module.exports;
var EventEmitter = require('events').EventEmitter;
var Request = require('./lib/request');

if (typeof window === 'undefined') {
    throw new Error('no window object present');
}

http.request = function (params, cb) {
    var req = Request.create(params);
    if (cb) req.on('response', cb);
    return req;
};

http.get = function (params, cb) {
    params.method = 'GET';
    var req = http.request(params, cb);
    req.end();
    return req;
};

});

require.define("events", function (require, module, exports, __dirname, __filename) {
    if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.toString.call(xs) === '[object Array]'
    }
;

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
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
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = list.indexOf(listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

});

require.define("/node_modules/dkastner-http-browserify/lib/request.js", function (require, module, exports, __dirname, __filename) {
    var EventEmitter = require('events').EventEmitter;
var Response = require('./response');

var Request = module.exports = function() {};

Request.prototype = new EventEmitter;

Request.create = function(params) {
    if (!params) params = {};

    var req;
    if(params.host && window.XDomainRequest) { // M$ IE XDR - use when host is set and XDR present
      req = new XdrRequest(params);
    } else {                                   // Everybody else
      req = new XhrRequest(params);
    }
    return req;
}

Request.prototype.init = function(params) {
    if (!params.host) params.host = window.location.host.split(':')[0];
    if (!params.port) params.port = window.location.port;
    
    this.body = '';
    if(!/^\//.test(params.path)) params.path = '/' + params.path;
    this.uri = params.host + ':' + params.port + (params.path || '/');
    this.xhr = new this.xhrClass;

    this.xhr.open(params.method || 'GET', 'http://' + this.uri, true);
};

Request.prototype.setHeader = function (key, value) {
    if ((Array.isArray && Array.isArray(value))
    || value instanceof Array) {
        for (var i = 0; i < value.length; i++) {
            this.xhr.setRequestHeader(key, value[i]);
        }
    }
    else {
        this.xhr.setRequestHeader(key, value);
    }
};

Request.prototype.write = function (s) {
    this.body += s;
};

Request.prototype.end = function (s) {
    if (s !== undefined) this.write(s);
    this.xhr.send(this.body);
};


// XhrRequest

var XhrRequest = function(params) {
    var self = this;
    self.init(params);
    var xhr = this.xhr;
    
    if(params.headers) {
        Object.keys(params.headers).forEach(function (key) {
            var value = params.headers[key];
            if (Array.isArray(value)) {
                value.forEach(function (v) {
                    xhr.setRequestHeader(key, v);
                });
            }
            else xhr.setRequestHeader(key, value)
        });
    }
  
    xhr.onreadystatechange = function () {
        res.handle(xhr);
    };
    
    var res = new Response;
    res.on('ready', function () {
        self.emit('response', res);
    });
};

XhrRequest.prototype = new Request;

XhrRequest.prototype.xhrClass = function() {
    if (window.XMLHttpRequest) {
        return window.XMLHttpRequest;
    }
    else if (window.ActiveXObject) {
        var axs = [
            'Msxml2.XMLHTTP.6.0',
            'Msxml2.XMLHTTP.3.0',
            'Microsoft.XMLHTTP'
        ];
        for (var i = 0; i < axs.length; i++) {
            try {
                var ax = new(window.ActiveXObject)(axs[i]);
                return function () {
                    if (ax) {
                        var ax_ = ax;
                        ax = null;
                        return ax_;
                    }
                    else {
                        return new(window.ActiveXObject)(axs[i]);
                    }
                };
            }
            catch (e) {}
        }
        throw new Error('ajax not supported in this browser')
    }
    else {
        throw new Error('ajax not supported in this browser');
    }
}();



// XdrRequest

var XdrRequest = function(params) {
    var self = this;
    self.init(params);
    var xhr = this.xhr;

    self.headers = {};

    var res = new XdrResponse();

    xhr.onprogress = function() {
        xhr.readyState = 2;
        res.contentType = xhr.contentType; // There, that's all the headers you get
        res.handle(xhr);
    }
    xhr.onerror = function() {
        xhr.readyState = 3;
        xhr.error = "Who the fuck knows? IE doesn't care!";
        res.handle(xhr);
    };
    xhr.onload = function() {
        xhr.readyState = 4;
        res.handle(xhr);
    };

    res.on('ready', function () {
        self.emit('response', res);
    });
};

XdrRequest.prototype = new Request;

XdrRequest.prototype.xhrClass = window.XDomainRequest;



// XdrResponse

var XdrResponse = function() {
    this.offset = 0;
};

XdrResponse.prototype = new Response();

XdrResponse.prototype.getAllResponseHeaders = function() {
  return 'Content-Type: ' + this.contentType;
};

});

require.define("/node_modules/dkastner-http-browserify/lib/response.js", function (require, module, exports, __dirname, __filename) {
    var EventEmitter = require('events').EventEmitter;

var Response = module.exports = function (res) {
    this.offset = 0;
};

Response.prototype = new EventEmitter;

var capable = {
    streaming : true,
    status2 : true
};

function parseHeaders (res) {
    var lines = res.getAllResponseHeaders().split(/\r?\n/);
    var headers = {};
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line === '') continue;
        
        var m = line.match(/^([^:]+):\s*(.*)/);
        if (m) {
            var key = m[1].toLowerCase(), value = m[2];
            
            if (headers[key] !== undefined) {
                if ((Array.isArray && Array.isArray(headers[key]))
                || headers[key] instanceof Array) {
                    headers[key].push(value);
                }
                else {
                    headers[key] = [ headers[key], value ];
                }
            }
            else {
                headers[key] = value;
            }
        }
        else {
            headers[line] = true;
        }
    }
    return headers;
}

Response.prototype.getHeader = function (key) {
    return this.headers[key.toLowerCase()];
};

Response.prototype.handle = function (res) {
    if (res.readyState === 2 && capable.status2) {
        try {
            this.statusCode = res.status;
            this.headers = parseHeaders(res);
        }
        catch (err) {
            capable.status2 = false;
        }
        
        if (capable.status2) {
            this.emit('ready');
        }
    }
    else if (capable.streaming && res.readyState === 3) {
        try {
            if (!this.statusCode) {
                this.statusCode = res.status;
                this.headers = parseHeaders(res);
                this.emit('ready');
            }
        }
        catch (err) {}
        
        try {
            this.write(res);
        }
        catch (err) {
            capable.streaming = false;
        }
    }
    else if (res.readyState === 4) {
        if (!this.statusCode) {
            this.statusCode = res.status;
            this.emit('ready');
        }
        this.write(res);
        
        if (res.error) {
            this.emit('error', res.responseText);
        }
        else this.emit('end');
    }
};

Response.prototype.write = function (res) {
    if (res.responseText.length > this.offset) {
        this.emit('data', res.responseText.slice(this.offset));
        this.offset = res.responseText.length;
    }
};

});

require.define("/lib/CM1.js", function (require, module, exports, __dirname, __filename) {
    // Carbon, energy, and other environmental impact calculations for your 
// JavaScript objects. Built for the browser and Node.js.
var ImpactEstimate = require('./impact-estimate'),
  ImpactEstimator = require('./impact-estimator');

var CM1 = module.exports = function() {
  this.attributeMap = {};
};

// ## Usage
// For a quick, **one-off calculation**, you can use `CM1.impacts()`. Here's an example for a flight:
// 
//     var CM1 = require('cm1');
//     CM1.impacts('flight', {
//       origin_airport: 'IAD',
//       destination_airport: 'PDX',
//       airline: 'United',
//       trips: 2,
//       segments_per_trip: 1    // nonstop flight
//     },
//     function(err, impacts) {
//       if(err) return console.log('Argh, falied!', err);
// 
//       console.log('Carbon for my cross-country flight: ',
//                   impacts.carbon);
//       console.log('Methodology: ', impacts.methodology);
//     });
// 
CM1.impacts = function(type, properties, callback) {
  var model = CM1.model(type, properties);
  model.getImpacts(callback);
};

// Alternatively, `CM1.model()` can add impact calculation abilities to an
// **existing object** on which you can run calculations at a later time:
// 
//     var CM1 = require('cm1');
//     var model = CM1.model('flight', {
//       origin_airport: 'JFK',
//       destination_airport: 'Berlin',
//       airline: 'Luftansa'
//     });
// 
//     // later...
//     model.seat_class = 'Business';
// 
//     model.getImpacts(function(err, impacts) {
//       if(err) return console.log('Argh, falied!', err);
// 
//       console.log('Carbon for my international flight: ',
//                   impacts.carbon);
//       console.log('Methodology: ', impacts.methodology);
//     });
// 
CM1.model = function(type, properties) {
  var attributes = Object.keys(properties);

  var proto = function() {};
  CM1.extend(proto, {
    model: type,
    provides: attributes
  });

  var object = new proto();
  for(var i = 0; i < attributes.length; i++) {
    var attribute = attributes[i];
    object[attribute] = properties[attribute];
  }

  return object;
};

// You can also **extend any prototype** (class) to become and impact calculating machine. For example, let's
// say we have a class representing a rental car:
// 
// 
//     var RentalCar = function() {};
//     
//     var car = new RentalCar();
//     car.make = 'Honda';
//     car.model = 'Fit';
//     car.fuelEconomy = 36.7;
// 
// If you want to figure out how much CO2 it emits, use `CM1.extend()` to tell
// your prototype how to use CM1 to calculate impacts. The first argument is the
// prototype to extend, the second argument is a object that describes mappings
// between properties of your prototype instance to the characteristics sent to
// CM1. After executing `CM1.extend()`, A new function called `getImpacts()`
// will be added to your class. `CM1.extend()` must be run before instantiating
// the RentalCar.
// 
//     var RentalCar = function() {};
//     
//     CM1.extend(RentalCar, {
//       model: 'automobile',
//       provides: ['make', 'model', {
//         'fuel_efficiency': 'fuelEconomy'
//       }
//     });
// 
// This says "my RentalCar prototype will use the
// [Automobile emitter](http://carbon.brighterplanet.com/models/automobile) to calculate
// impacts. It uses the make property to provide make to the web service, model maps to
// model, and the fuelEconomy property maps to fuel_efficiency on CM1.
//
// Now you can calculate impacts:
// 
//     var car = new RentalCar();
//     car.make = 'Honda';
//     car.model = 'Fit';
//     car.fuelEconomy = 36.7;
// 
//     car.getImpacts(function(err, impacts) {
//       if(err) alert("Oops, something broke: " + err);
//  
//       alert("My emissions are: " + impacts.carbon);
//       alert("My fuel use is: " + impacts.fuelUse);
//     });
//
// There are a whole bunch of [other models](http://carbon.brighterplanet.com/models)
// available, including computer usage, rail trips, and flights.
// 
CM1.extend = function(klass, mapping) {
  klass.cm1 = new CM1();
  klass.cm1.define(mapping);
  klass.prototype.impactEstimator = new ImpactEstimator(klass.cm1);
  klass.prototype.getImpacts = function(callback) {
    return this.impactEstimator.getImpacts(this, callback);
  };
};

// ## Specifying an API Key
// 
// CM1 is free for non-commercial use and available for commercial use. In either 
// case, you need to sign up for a Brighter Planet API key if you haven't already.
// To do so, go to [keys.brighterplanet.com](http://keys.brighterplanet.com).
// 
// Once you have your key, you can specify it with:
// 
//     var CM1 = require('CM1');
//     process.env.CM1_KEY = 'ABC123';
//     
// Note: if using the stand-alone library, `process.env` won't be available in your
// browser until you `require('CM1')`.
// 
CM1.prototype.key = function() {
  if(process && process.env && process.env.CM1_KEY)
    return process.env.CM1_KEY;
  else
    return CM1.key;
};

// ## Connection Adapters: HTTP, Websockets, etc.
// CM1.js can use a **standard RESTful HTTP** adapter (default) or an **HTML5 Websockets** adapter.

// The **standard HTTP** adapter sends a separate HTTP request for each calculation 
// performed. This is ideal for when one or only a few calculations are made at 
// a given time.
CM1.useHttpAdapter = function() {
  CM1.setAdapter('http');
};

// The **Websockets** adapter is ideal for when many calculations need to be made at once.
// You will need to `npm install socket.io-client` to use this.
CM1.useWebsocketAdapter = function() {
  CM1.setAdapter('websocket');
};

// You can define process.env.CM1_ADAPTER to 'http' or 'websocket'. 
// Otherwise, CM1 defaults to the HTTP adapter
CM1.setAdapter = function(type) {
  process.env = process.env || {};
  type = type || process.env.CM1_ADAPTER || 'http';
  var adapter = type == 'http' ? 
    require('./adapters/http-adapter') :
    require('./adapters/websocket-adapter');
  CM1.adapter = new adapter();
};

// ## Etc.
// Apply a mapping to a CM1-enabled object.
CM1.prototype.define = function(mapping) {
  this.emitAs(mapping.model);
  var provisions = mapping.provide || mapping.provides;
  this.provide(provisions);
};

// Set the model (e.g. flight) used for calculation.
CM1.prototype.emitAs = function(model) {
  this.model = model;
};

// Define the properties of the CM1-enabled object that are sent as
// characteristics to CM1's models.
// The format of **attributes** can be:
//
// * `['foo', 'bar', 'baz']`
// * `['foo', 'bar', 'baz', { quux: 'quuxValue' }]`
// * `{ foo: 'fooProperty',  quux: 'quuxValue' }`
//
// When specifying an object parameter, the property name
// is the name of the CM1 characterstic, and the value is
// the name of the property or function on your object that
// holds the data to be sent.
CM1.prototype.provide = function(attributes) {
  for(var i in attributes) {
    if(attributes.hasOwnProperty(i)) {
      var value = attributes[i];
      if(typeof value == 'object') {
        this.provide(value);
      } else if(/^\d+$/.test(i)) {
        this.attributeMap[this.underscore(value)] = value;
      } else {
        this.attributeMap[this.underscore(i)] = value;
      }
    }
  }
};

CM1.prototype.underscore = function(string) {
  return string.replace(/([a-z])([A-Z])/g, function(str, first, second) {
    return first + '_' + second.toLowerCase();
  });
};

CM1.prototype.adapter = function() {
  if(!CM1.adapter) CM1.setAdapter();
  return CM1.adapter;
};

CM1.ImpactEstimate = ImpactEstimate;
CM1.ImpactEstimator = ImpactEstimator;
 
// ## Deploy With Browserify
// 
// CM1.js can be used with [browserify](http://github.com/substack/node-browserify).
// Simply `npm install CM1` and `require('CM1')` in your code.

});

require.define("/lib/impact-estimate.js", function (require, module, exports, __dirname, __filename) {
    var ImpactEstimate = module.exports = function(subject, data) {
  this.subject = subject;
  this.data = data;

  if(data.decisions.carbon)
    this.carbon = data.decisions.carbon.object.value;
  proxyDataProperties(this, data);
};

var proxyDataProperties = function(estimate, data) {
  for (var property in data) {
    if(!data.hasOwnProperty(property)) continue;

    estimate[property] = data[property];
  }
};

});

require.define("/lib/impact-estimator.js", function (require, module, exports, __dirname, __filename) {
    var ImpactEstimate = require('./impact-estimate');

var ImpactEstimator = module.exports = function(cm1) {
  this.cm1 = cm1;
};

ImpactEstimator.callbacks = {
  getImpacts: function(subject, callback) {
    return function(err, impacts) {
      if(err) {
        callback(err);
      } else {
        subject.impacts = impacts;
        callback(null, impacts);
      }
    }
  }
};

ImpactEstimator.prototype.params = function(subject) {
  var params = {};
  for(var cm1_field in this.cm1.attributeMap) {
    var attribute = this.cm1.attributeMap[cm1_field];
    var value = subject[attribute];
    var result = null;
    if(value)
      result = value;
    if(typeof result == 'function')
      result = result.apply(subject);
    if(result)
      params[cm1_field] = result;
  }

  if(this.cm1.key()) {
    params.key = this.cm1.key();
  }

  if(subject.parameters) {
    for(var i in subject.parameters) {
      params[i] = subject.parameters[i];
    }
  }

  return params;
};

ImpactEstimator.prototype.getImpacts = function(subject, callback) {
  this.cm1.adapter().getImpacts(this.cm1, subject, this.params(subject),
                                ImpactEstimator.callbacks.getImpacts(subject, callback));
};

});

require.define("/lib/adapters/http-adapter.js", function (require, module, exports, __dirname, __filename) {
    var http = require('http');

var ImpactEstimate = require('../impact-estimate'),
    Util = require('../util');

var HttpAdapter = module.exports = function() {
  this.host = 'impact.brighterplanet.com';
};

HttpAdapter.prototype.path = function(cm1) {
  return Util.pluralize(cm1.model) + '.json';
};

HttpAdapter.prototype.getImpacts = function(cm1, subject, params, callback) {
  var req = http.request({
    host: this.host, port: 80, path: this.path(cm1),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, function (res) {
    var data = '';
    res.on('data', function (buf) {
      data += buf;
    });

    res.on('error', function() {
      var err = new Error('Failed to get impact estimate: ' + data);
      callback(err);
    });

    res.on('end', function () {
      var json = JSON.parse(data);
      subject.impacts = new ImpactEstimate(subject, json);
      callback(null, subject.impacts);
    });
  });
  req.end(JSON.stringify(params));
};

});

require.define("/lib/util.js", function (require, module, exports, __dirname, __filename) {
    var Util = module.exports = {
  pluralize: function(str) {
    return str + 's';
  }
};

});

require.define("/lib/adapters/websocket-adapter.js", function (require, module, exports, __dirname, __filename) {
    var CM1 = require('../cm1');

var ImpactEstimate = require('../impact-estimate'),
    Util = require('../util');

var WebsocketAdapter = module.exports = function() {
  process.env = process.env || {};
  var hostname = process.env.CM1_WEBSOCKET_HOST || CM1.websocketHost || 'push-brighterplanet.no.de:80';
  if(!/^http:/.test(hostname)) hostname = 'http://' + hostname;
  this.host = hostname;
};

WebsocketAdapter.callbacks = {
  getImpacts: function(subject, callback) {
    return function(response) {
      if(response.statusCode < 300) {
        var body = JSON.parse(response.body);
        subject.impacts = new ImpactEstimate(subject, body);
        callback(null, subject.impacts);
      } else {
        callback(response.body);
      }
    };
  }
};

WebsocketAdapter.prototype.connect = function() {
  var socketIo = 'socket.io-client';
  this.socket = require(socketIo).connect(this.host);
};

WebsocketAdapter.prototype.getImpacts = function(cm1, subject, params, callback) {
  var request = {
    'PATH_INFO': '/' + Util.pluralize(cm1.model) + '.json',
    'body': JSON.stringify(params)
  };
  if(!this.socket) this.connect();
  this.socket.emit('impacts', request,
                   WebsocketAdapter.callbacks.getImpacts(subject, callback));
};

});

require.define("/lib/cm1.js", function (require, module, exports, __dirname, __filename) {
    // Carbon, energy, and other environmental impact calculations for your 
// JavaScript objects. Built for the browser and Node.js.
var ImpactEstimate = require('./impact-estimate'),
  ImpactEstimator = require('./impact-estimator');

var CM1 = module.exports = function() {
  this.attributeMap = {};
};

// ## Usage
// For a quick, **one-off calculation**, you can use `CM1.impacts()`. Here's an example for a flight:
// 
//     var CM1 = require('cm1');
//     CM1.impacts('flight', {
//       origin_airport: 'IAD',
//       destination_airport: 'PDX',
//       airline: 'United',
//       trips: 2,
//       segments_per_trip: 1    // nonstop flight
//     },
//     function(err, impacts) {
//       if(err) return console.log('Argh, falied!', err);
// 
//       console.log('Carbon for my cross-country flight: ',
//                   impacts.carbon);
//       console.log('Methodology: ', impacts.methodology);
//     });
// 
CM1.impacts = function(type, properties, callback) {
  var model = CM1.model(type, properties);
  model.getImpacts(callback);
};

// Alternatively, `CM1.model()` can add impact calculation abilities to an
// **existing object** on which you can run calculations at a later time:
// 
//     var CM1 = require('cm1');
//     var model = CM1.model('flight', {
//       origin_airport: 'JFK',
//       destination_airport: 'Berlin',
//       airline: 'Luftansa'
//     });
// 
//     // later...
//     model.seat_class = 'Business';
// 
//     model.getImpacts(function(err, impacts) {
//       if(err) return console.log('Argh, falied!', err);
// 
//       console.log('Carbon for my international flight: ',
//                   impacts.carbon);
//       console.log('Methodology: ', impacts.methodology);
//     });
// 
CM1.model = function(type, properties) {
  var attributes = Object.keys(properties);

  var proto = function() {};
  CM1.extend(proto, {
    model: type,
    provides: attributes
  });

  var object = new proto();
  for(var i = 0; i < attributes.length; i++) {
    var attribute = attributes[i];
    object[attribute] = properties[attribute];
  }

  return object;
};

// You can also **extend any prototype** (class) to become and impact calculating machine. For example, let's
// say we have a class representing a rental car:
// 
// 
//     var RentalCar = function() {};
//     
//     var car = new RentalCar();
//     car.make = 'Honda';
//     car.model = 'Fit';
//     car.fuelEconomy = 36.7;
// 
// If you want to figure out how much CO2 it emits, use `CM1.extend()` to tell
// your prototype how to use CM1 to calculate impacts. The first argument is the
// prototype to extend, the second argument is a object that describes mappings
// between properties of your prototype instance to the characteristics sent to
// CM1. After executing `CM1.extend()`, A new function called `getImpacts()`
// will be added to your class. `CM1.extend()` must be run before instantiating
// the RentalCar.
// 
//     var RentalCar = function() {};
//     
//     CM1.extend(RentalCar, {
//       model: 'automobile',
//       provides: ['make', 'model', {
//         'fuel_efficiency': 'fuelEconomy'
//       }
//     });
// 
// This says "my RentalCar prototype will use the
// [Automobile emitter](http://carbon.brighterplanet.com/models/automobile) to calculate
// impacts. It uses the make property to provide make to the web service, model maps to
// model, and the fuelEconomy property maps to fuel_efficiency on CM1.
//
// Now you can calculate impacts:
// 
//     var car = new RentalCar();
//     car.make = 'Honda';
//     car.model = 'Fit';
//     car.fuelEconomy = 36.7;
// 
//     car.getImpacts(function(err, impacts) {
//       if(err) alert("Oops, something broke: " + err);
//  
//       alert("My emissions are: " + impacts.carbon);
//       alert("My fuel use is: " + impacts.fuelUse);
//     });
//
// There are a whole bunch of [other models](http://carbon.brighterplanet.com/models)
// available, including computer usage, rail trips, and flights.
// 
CM1.extend = function(klass, mapping) {
  klass.cm1 = new CM1();
  klass.cm1.define(mapping);
  klass.prototype.impactEstimator = new ImpactEstimator(klass.cm1);
  klass.prototype.getImpacts = function(callback) {
    return this.impactEstimator.getImpacts(this, callback);
  };
};

// ## Specifying an API Key
// 
// CM1 is free for non-commercial use and available for commercial use. In either 
// case, you need to sign up for a Brighter Planet API key if you haven't already.
// To do so, go to [keys.brighterplanet.com](http://keys.brighterplanet.com).
// 
// Once you have your key, you can specify it with:
// 
//     var CM1 = require('CM1');
//     process.env.CM1_KEY = 'ABC123';
//     
// Note: if using the stand-alone library, `process.env` won't be available in your
// browser until you `require('CM1')`.
// 
CM1.prototype.key = function() {
  if(process && process.env && process.env.CM1_KEY)
    return process.env.CM1_KEY;
  else
    return CM1.key;
};

// ## Connection Adapters: HTTP, Websockets, etc.
// CM1.js can use a **standard RESTful HTTP** adapter (default) or an **HTML5 Websockets** adapter.

// The **standard HTTP** adapter sends a separate HTTP request for each calculation 
// performed. This is ideal for when one or only a few calculations are made at 
// a given time.
CM1.useHttpAdapter = function() {
  CM1.setAdapter('http');
};

// The **Websockets** adapter is ideal for when many calculations need to be made at once.
// You will need to `npm install socket.io-client` to use this.
CM1.useWebsocketAdapter = function() {
  CM1.setAdapter('websocket');
};

// You can define process.env.CM1_ADAPTER to 'http' or 'websocket'. 
// Otherwise, CM1 defaults to the HTTP adapter
CM1.setAdapter = function(type) {
  process.env = process.env || {};
  type = type || process.env.CM1_ADAPTER || 'http';
  var adapter = type == 'http' ? 
    require('./adapters/http-adapter') :
    require('./adapters/websocket-adapter');
  CM1.adapter = new adapter();
};

// ## Etc.
// Apply a mapping to a CM1-enabled object.
CM1.prototype.define = function(mapping) {
  this.emitAs(mapping.model);
  var provisions = mapping.provide || mapping.provides;
  this.provide(provisions);
};

// Set the model (e.g. flight) used for calculation.
CM1.prototype.emitAs = function(model) {
  this.model = model;
};

// Define the properties of the CM1-enabled object that are sent as
// characteristics to CM1's models.
// The format of **attributes** can be:
//
// * `['foo', 'bar', 'baz']`
// * `['foo', 'bar', 'baz', { quux: 'quuxValue' }]`
// * `{ foo: 'fooProperty',  quux: 'quuxValue' }`
//
// When specifying an object parameter, the property name
// is the name of the CM1 characterstic, and the value is
// the name of the property or function on your object that
// holds the data to be sent.
CM1.prototype.provide = function(attributes) {
  for(var i in attributes) {
    if(attributes.hasOwnProperty(i)) {
      var value = attributes[i];
      if(typeof value == 'object') {
        this.provide(value);
      } else if(/^\d+$/.test(i)) {
        this.attributeMap[this.underscore(value)] = value;
      } else {
        this.attributeMap[this.underscore(i)] = value;
      }
    }
  }
};

CM1.prototype.underscore = function(string) {
  return string.replace(/([a-z])([A-Z])/g, function(str, first, second) {
    return first + '_' + second.toLowerCase();
  });
};

CM1.prototype.adapter = function() {
  if(!CM1.adapter) CM1.setAdapter();
  return CM1.adapter;
};

CM1.ImpactEstimate = ImpactEstimate;
CM1.ImpactEstimator = ImpactEstimator;
 
// ## Deploy With Browserify
// 
// CM1.js can be used with [browserify](http://github.com/substack/node-browserify).
// Simply `npm install CM1` and `require('CM1')` in your code.

});

require.alias("dkastner-http-browserify", "/node_modules/http");

require.define("/browser.js", function (require, module, exports, __dirname, __filename) {
    window.CM1 = require('./lib/CM1');

});
require("/browser.js");
