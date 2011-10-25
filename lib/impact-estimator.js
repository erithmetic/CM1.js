var http = require('http');

var ImpactEstimate = require('./impact-estimate');

var ImpactEstimator = module.exports = function(cm1) {
  this.cm1 = cm1;
  this.host = 'impact.brighterplanet.com';
};

ImpactEstimator.prototype.pluralize = function(str) {
  return str + 's';
}

ImpactEstimator.prototype.path = function() {
  return this.pluralize(this.cm1.model) + '.json';
};

ImpactEstimator.prototype.params = function(subject) {
  var params = {};
  for(var cm1_field in this.cm1.attributeMap) {
    var attribute = this.cm1.attributeMap[cm1_field];
    var value = subject[attribute];
    var result = null;
    if(value)
      result = value;
    if(typeof result == 'function')
      result = result.apply(subject);
    if(result)
      params[cm1_field] = result;
  }

  if(this.cm1.key()) {
    params.key = this.cm1.key();
  }

  if(subject.parameters) {
    for(var i in subject.parameters) {
      params[i] = subject.parameters[i];
    }
  }

  return params;
};

ImpactEstimator.prototype.getImpacts = function(subject, callback) {
  this.subject = subject;
  var req = http.request({
    host: this.host, port: 80, path: this.path(),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, function (res) {
    var data = '';
    res.on('data', function (buf) {
      data += buf;
    });

    res.on('error', function() {
      var err = new Error('Failed to get impact estimate: ' + data);
      callback(err);
    });

    res.on('end', function () {
      var json = JSON.parse(data);
      subject.impacts = new ImpactEstimate(subject, json);
      callback(null, subject.impacts);
    });
  });
  req.end(JSON.stringify(this.params(subject)));
};
