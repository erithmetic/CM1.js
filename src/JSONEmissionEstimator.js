JSONEmissionEstimator = function(emitter, carbon) {
  this.emitter = emitter;
  this.carbon = carbon;
};
JSONEmissionEstimator.prototype = new EmissionEstimator();

JSONEmissionEstimator.prototype.url = function() {
  return 'http://carbon.brighterplanet.com/' + this.carbon.emitter_name.pluralize() + '.json';
};

JSONEmissionEstimator.prototype.ajaxOptions = {
  dataType: 'json'
};
