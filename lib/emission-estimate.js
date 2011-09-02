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
