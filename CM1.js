var require = function (file, cwd) {
    var resolved = require.resolve(file, cwd || '/');
    var mod = require.modules[resolved];
    if (!mod) throw new Error(
        'Failed to resolve module ' + file + ', tried ' + resolved
    );
    var res = mod._cached ? mod._cached : mod();
    return res;
}
var __require = require;

require.paths = [];
require.modules = {};
require.extensions = [".js",".coffee"];

require.resolve = (function () {
    var core = {
        'assert': true,
        'events': true,
        'fs': true,
        'path': true,
        'vm': true
    };
    
    return function (x, cwd) {
        if (!cwd) cwd = '/';
        
        if (core[x]) return x;
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

require.modules["path"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "path";
    
    var require = function (file) {
        return __require(file, ".");
    };
    
    require.resolve = function (file) {
        return __require.resolve(name, ".");
    };
    
    require.modules = __require.modules;
    __require.modules["path"]._cached = module.exports;
    
    (function () {
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
;
    }).call(module.exports);
    
    __require.modules["path"]._cached = module.exports;
    return module.exports;
};

require.modules["/node_modules/http-browserify/package.json"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = "/node_modules/http-browserify";
    var __filename = "/node_modules/http-browserify/package.json";
    
    var require = function (file) {
        return __require(file, "/node_modules/http-browserify");
    };
    
    require.resolve = function (file) {
        return __require.resolve(name, "/node_modules/http-browserify");
    };
    
    require.modules = __require.modules;
    __require.modules["/node_modules/http-browserify/package.json"]._cached = module.exports;
    
    (function () {
        module.exports = {"name":"http-browserify","version":"0.0.0","description":"http module compatability for browserify","main":"index.js","browserify":"browser.js","directories":{"lib":".","example":"example","test":"test"},"devDependencies":{"express":"2.4.x","browserify":"1.4.x"},"repository":{"type":"git","url":"http://github.com/substack/http-browserify.git"},"keywords":["http","browserify","compatible","meatless","browser"],"author":{"name":"James Halliday","email":"mail@substack.net","url":"http://substack.net"},"license":"MIT/X11","engine":{"node":">=0.4"}};
    }).call(module.exports);
    
    __require.modules["/node_modules/http-browserify/package.json"]._cached = module.exports;
    return module.exports;
};

require.modules["/node_modules/http-browserify/browser.js"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = "/node_modules/http-browserify";
    var __filename = "/node_modules/http-browserify/browser.js";
    
    var require = function (file) {
        return __require(file, "/node_modules/http-browserify");
    };
    
    require.resolve = function (file) {
        return __require.resolve(name, "/node_modules/http-browserify");
    };
    
    require.modules = __require.modules;
    __require.modules["/node_modules/http-browserify/browser.js"]._cached = module.exports;
    
    (function () {
        var http = module.exports;
var EventEmitter = require('events').EventEmitter;
var Request = require('./lib/request');

http.request = function (params, cb) {
    if (!params) params = {};
    if (!params.host) params.host = window.location.host.split(':')[0];
    if (!params.port) params.port = window.location.port;
    
    var req = new Request(new xhrHttp, params);
    if (cb) req.on('response', cb);
    return req;
};

http.get = function (params, cb) {
    params.method = 'GET';
    var req = http.request(params, cb);
    req.end();
    return req;
};

var xhrHttp = (function () {
    if (typeof window === 'undefined') {
        throw new Error('no window object present');
    }
    else if (window.XMLHttpRequest) {
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
})();
;
    }).call(module.exports);
    
    __require.modules["/node_modules/http-browserify/browser.js"]._cached = module.exports;
    return module.exports;
};

require.modules["events"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "events";
    
    var require = function (file) {
        return __require(file, ".");
    };
    
    require.resolve = function (file) {
        return __require.resolve(name, ".");
    };
    
    require.modules = __require.modules;
    __require.modules["events"]._cached = module.exports;
    
    (function () {
        if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = Array.isArray;

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
;
    }).call(module.exports);
    
    __require.modules["events"]._cached = module.exports;
    return module.exports;
};

require.modules["/node_modules/http-browserify/lib/request.js"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = "/node_modules/http-browserify/lib";
    var __filename = "/node_modules/http-browserify/lib/request.js";
    
    var require = function (file) {
        return __require(file, "/node_modules/http-browserify/lib");
    };
    
    require.resolve = function (file) {
        return __require.resolve(name, "/node_modules/http-browserify/lib");
    };
    
    require.modules = __require.modules;
    __require.modules["/node_modules/http-browserify/lib/request.js"]._cached = module.exports;
    
    (function () {
        var EventEmitter = require('events').EventEmitter;
var Response = require('./response');

var Request = module.exports = function (xhr, params) {
    var self = this;
    self.xhr = xhr;
    self.body = '';
    
    var uri = params.host + ':' + params.port + (params.path || '/');
    
    if (params.headers) {
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
    
    xhr.open(params.method || 'GET', 'http://' + uri, true);
    
    var res = new Response;
    res.on('ready', function () {
        self.emit('response', res);
    });
    
    xhr.onreadystatechange = function () {
        res.handle(xhr);
    };
};

Request.prototype = new EventEmitter;

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
;
    }).call(module.exports);
    
    __require.modules["/node_modules/http-browserify/lib/request.js"]._cached = module.exports;
    return module.exports;
};

require.modules["/node_modules/http-browserify/lib/response.js"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = "/node_modules/http-browserify/lib";
    var __filename = "/node_modules/http-browserify/lib/response.js";
    
    var require = function (file) {
        return __require(file, "/node_modules/http-browserify/lib");
    };
    
    require.resolve = function (file) {
        return __require.resolve(name, "/node_modules/http-browserify/lib");
    };
    
    require.modules = __require.modules;
    __require.modules["/node_modules/http-browserify/lib/response.js"]._cached = module.exports;
    
    (function () {
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
;
    }).call(module.exports);
    
    __require.modules["/node_modules/http-browserify/lib/response.js"]._cached = module.exports;
    return module.exports;
};

require.modules["/emission-estimate.js"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = "/";
    var __filename = "/emission-estimate.js";
    
    var require = function (file) {
        return __require(file, "/");
    };
    
    require.resolve = function (file) {
        return __require.resolve(name, "/");
    };
    
    require.modules = __require.modules;
    __require.modules["/emission-estimate.js"]._cached = module.exports;
    
    (function () {
        var EmissionEstimate = module.exports = function(emitter, data) {
  this.emitter = emitter;
  this.data = data;
  proxyDataProperties(this, data);
};

EmissionEstimate.prototype.value = function() {
  return this.data.emission;
};

EmissionEstimate.prototype.toString = function() {
  return this.value().toString();
};

var proxyDataProperties = function(estimate, data) {
  for (var property in data) {
    if (property == 'clone') continue;
    estimate[property] = data[property];
  }
};
;
    }).call(module.exports);
    
    __require.modules["/emission-estimate.js"]._cached = module.exports;
    return module.exports;
};

require.modules["/emission-estimator.js"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = "/";
    var __filename = "/emission-estimator.js";
    
    var require = function (file) {
        return __require(file, "/");
    };
    
    require.resolve = function (file) {
        return __require.resolve(name, "/");
    };
    
    require.modules = __require.modules;
    __require.modules["/emission-estimator.js"]._cached = module.exports;
    
    (function () {
        var http = require('http');

var EmissionEstimate = require('./emission-estimate');

var EmissionEstimator = module.exports = function(emitter, cm1) {
  this.emitter = emitter;
  this.cm1 = cm1;
  this.host = 'carbon.brighterplanet.com';
};

EmissionEstimator.prototype.pluralize = function(str) {
  return str + 's';
}

EmissionEstimator.prototype.path = function() {
  return this.pluralize(this.cm1.emitter_name) + '.json';
};

EmissionEstimator.prototype.params = function() {
  var params = {};
  for(var attribute in this.cm1.attribute_map) {
    var cm1_field = this.cm1.attribute_map[attribute];
    var value = this.emitter[attribute];
    var result;
    if(value) 
      result = value;
    if(typeof result == 'function')
      result = result.apply(this.emitter);
    if(result)
      params[cm1_field] = result;
  }

  if(this.cm1.key()) {
    params.key = this.cm1.key();
  }

  return params;
};

EmissionEstimator.prototype.getEmissionEstimate = function(callback) {
  var emitter = this.emitter;
  var req = http.request({
    host: this.host, port: 80, path: this.path(),
    method: 'POST',
    headers: { ContentType: 'application/json' }
  }, function (res) {
    var data = '';
    res.on('data', function (buf) {
      data += buf;
    });

    res.on('error', function() {
      var err = new Error('Failed to get emission estimate: ' + data);
      callback(err);
    });

    res.on('end', function () {
      var json = JSON.parse(data);
      emitter.emissionEstimate = new EmissionEstimate(emitter, json);
      callback(null, emitter.emissionEstimate);
    });
  });
  req.end(JSON.stringify(this.params()));
};
;
    }).call(module.exports);
    
    __require.modules["/emission-estimator.js"]._cached = module.exports;
    return module.exports;
};

require.alias("http-browserify", "/node_modules/http");

process.nextTick(function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = "/";
    var __filename = "//Users/dkastner/CM1.js/lib";
    
    var require = function (file) {
        return __require(file, "/");
    };
    require.modules = __require.modules;
    
    var EmissionEstimate = require('./emission-estimate'),
  EmissionEstimator = require('./emission-estimator');

var CM1 = module.exports = function() {
  this.attribute_map = {};
};
CM1.EmissionEstimate = EmissionEstimate;
CM1.EmissionEstimator = EmissionEstimator;

CM1.prototype.key = function() {
  return CM1.key;
};

CM1.emitter = function(klass, definition) {
  klass.cm1 = new CM1();
  klass.cm1.define(definition);
  klass.prototype.emissionEstimator = function() {
    if(!this._emissionEstimator) {
      this._emissionEstimator = new EmissionEstimator(this, klass.cm1);
    }

    return this._emissionEstimator;
  };
  klass.prototype.getEmissionEstimate = function(callback) {
    return this.emissionEstimator().getEmissionEstimate(callback);
  };
};

CM1.prototype.define = function(lambda) {
  lambda(this);
};

CM1.prototype.emitAs = function(emitter_name) {
  this.emitter_name = emitter_name;
};

CM1.prototype.provide = function(attribute, options) {
  var actual_field;
  if(options && options.as) {
    actual_field = options.as;
  } else {
    actual_field = attribute;
  }

  this.attribute_map[attribute] = actual_field;
};
;
});
