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

  if(this.emitter.parameters) {
    for(var i in this.emitter.parameters) {
      params[i] = this.emitter.parameters[i];
    }
  }

  return params;
};

EmissionEstimator.prototype.getEmissionEstimate = function(callback) {
  var emitter = this.emitter;
  var req = http.request({
    host: this.host, port: 80, path: this.path(),
    method: 'POST',
    headers: { 'content-type': 'application/json' }
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
