var ImpactEstimate = require('./impact-estimate'),
  ImpactEstimator = require('./impact-estimator');

var CM1 = module.exports = function() {
  this.attributeMap = {};
};
CM1.ImpactEstimate = ImpactEstimate;
CM1.ImpactEstimator = ImpactEstimator;

CM1.prototype.key = function() {
  if(process && process.env && process.env.CM1_KEY)
    return process.env.CM1_KEY;
  else
    return CM1.key;
};

CM1.extend = function(klass, mapping) {
  klass.cm1 = new CM1();
  klass.cm1.define(mapping);
  klass.prototype.impactEstimator = new ImpactEstimator(klass.cm1);
  klass.prototype.getImpacts = function(callback) {
    return this.impactEstimator.getImpacts(this, callback);
  };
};

CM1.prototype.define = function(mapping) {
  this.emitAs(mapping.model);
  var provisions = mapping.provide || mapping.provides;
  this.provide(provisions);
};

CM1.prototype.emitAs = function(model) {
  this.model = model;
};

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

CM1.model = function(type, properties) {
  var attributes = Object.keys(properties);

  var prototype = function() {};
  CM1.extend(prototype, {
    model: type,
    provides: attributes
  });

  var object = new prototype;
  for(var i in attributes) {
    var attribute = attributes[i];
    object[attribute] = properties[attribute];
  }

  return object;
};

CM1.impacts = function(type, properties, callback) {
  var model = CM1.model(type, properties);
  model.getImpacts(callback);
};
