EmissionEstimator = function() {};

EmissionEstimator.prototype.params = function() {
  var params = {};
  for(var attribute in this.carbon.attribute_map) {
    var cm1_field = this.carbon.attribute_map[attribute];
    var value = this.emitter[attribute];
    var result;
    if(value) 
      result = value;
    if(typeof result == 'function')
      result = result.apply(this.emitter);
    if(result)
      params[cm1_field] = result;
  }

  if(Carbon.key) {
    params['key'] = Carbon.key;
  }

  return params;
};

EmissionEstimator.prototype.getEmissionEstimate = function(onSuccess, onError) {
  var options = this.ajaxOptions;
  options.success = EmissionEstimatorEvents.estimateSuccess(this, onSuccess);
  options.error = onError;
  options.url = this.url();
  options.data = this.params();
  $.ajax(options);
};

// Events

EmissionEstimatorEvents = {
  estimateSuccess: function(estimator, onSuccess) {
    return function(result) {
      estimator.emitter.emissionEstimate.data = result;
      onSuccess(estimator.emitter.emissionEstimate);
    };
  }
};
