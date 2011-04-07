Carbon = function() {
  this.attribute_map = {};
};

Carbon.emitter = function(klass, definition) {
  klass.carbon = new Carbon();
  klass.carbon.define(definition);
  klass.prototype.emissionEstimate = new EmissionEstimate();
  klass.prototype.emissionEstimator = function() {
    if(!this._emissionEstimator) {
      this._emissionEstimator = new EmissionEstimator(this, klass.carbon);
    }

    return this._emissionEstimator;
  };
  klass.prototype.getEmissionEstimate = function(onSuccess, onError) {
    return this.emissionEstimator().getEmissionEstimate(onSuccess, onError);
  };
};

Carbon.prototype.define = function(lambda) {
  lambda(this);
};

Carbon.prototype.emitAs = function(emitter_name) {
  this.emitter_name = emitter_name;
};

Carbon.prototype.provide = function(attribute, options) {
  var actual_field;
  if(options && options.as) {
    actual_field = options.as;
  } else {
    actual_field = attribute;
  }

  this.attribute_map[attribute] = actual_field;
};
