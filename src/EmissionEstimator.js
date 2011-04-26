EmissionEstimator = function(emitter, carbon) {
  this.emitter = emitter;
  this.carbon = carbon;
};

EmissionEstimator.prototype.url = function() {
  return 'http://carbon.brighterplanet.com/' + this.carbon.emitter_name.pluralize() + '.json';
};

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
  $.ajax({
    url: this.url(),
    data: this.params(),
    dataType: 'json',
    success: this.onEstimateSuccess(onSuccess),
    error: onError
  });
};

// Events

EmissionEstimator.prototype.onEstimateSuccess = function(onSuccess) {
  return $.proxy(function(result) {
    this.emitter.emissionEstimate.data = result;
    onSuccess(this.emitter.emissionEstimate);
  }, this);
};
