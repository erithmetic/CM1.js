// Carbon, energy, and other environmental impact calculations for your 
// JavaScript objects. Built for the browser and Node.js.
var _ = require('underscore');

var ImpactEstimate = require('./impact-estimate'),
  ImpactEstimator = require('./impact-estimator');

var CM1 = function() {
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
  var proto = function() {};
  CM1.extend(proto, {
    model: type,
    provides: _.keys(properties)
  });

  var object = new proto();
  _.each(properties, function(value, key) {
    object[key] = value;
  });

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

module.exports = CM1;
