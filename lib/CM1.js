var EmissionEstimate = require('./emission-estimate'),
  EmissionEstimator = require('./emission-estimator');

var CM1 = module.exports = function() {
  this.attribute_map = {};
};
CM1.EmissionEstimate = EmissionEstimate;
CM1.EmissionEstimator = EmissionEstimator;

CM1.prototype.key = function() {
  if(process && process.env && process.env.CM1_KEY)
    return process.env.CM1_KEY;
  else
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
