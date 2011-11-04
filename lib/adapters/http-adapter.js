var http = require('http');

var ImpactEstimate = require('../impact-estimate'),
    Util = require('../util');

var HttpAdapter = module.exports = function() {
  this.host = 'impact.brighterplanet.com';
};

HttpAdapter.prototype.path = function(cm1) {
  return Util.pluralize(cm1.model) + '.json';
};

HttpAdapter.prototype.getImpacts = function(cm1, subject, params, callback) {
  var req = http.request({
    host: this.host, port: 80, path: this.path(cm1),
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
  req.end(JSON.stringify(params));
};