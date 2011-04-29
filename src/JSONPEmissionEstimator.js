JSONPEmissionEstimator = function(emitter, carbon) {
  this.emitter = emitter;
  this.carbon = carbon;
};
JSONPEmissionEstimator.prototype = new EmissionEstimator();

JSONPEmissionEstimator.prototype.url = function() {
  return 'http://carbon.brighterplanet.com/' + this.carbon.emitter_name.pluralize() + '.js';
};

JSONPEmissionEstimator.prototype.ajaxOptions = {
  dataType: 'jsonp',
  jsonp: false,
  jsonpCallback: 'carbon'
};
