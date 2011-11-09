var io = require('socket.io-client');

var ImpactEstimate = require('../impact-estimate'),
    Util = require('../util');

var WebsocketAdapter = module.exports = function() {
  this.host = CM1.websocketHost || 'push-brighterplanet.no.de';
};

WebsocketAdapter.callbacks = {
  getImpacts: function(subject, callback) {
    return function(response) {
      if(response.statusCode < 300) {
        var body = JSON.parse(response.body);
        subject.impacts = new ImpactEstimate(subject, body);
        callback(null, subject.impacts);
      } else {
        callback(response.body);
      }
    };
  }
};

WebsocketAdapter.prototype.connect = function() {
  this.socket = io.connect();
};

WebsocketAdapter.prototype.getImpacts = function(cm1, subject, params, callback) {
  var request = {
    'PATH_INFO': '/' + Util.pluralize(cm1.model) + '.json',
    'body': JSON.stringify(params)
  };
  if(!this.socket) this.connect();
  this.socket.emit('impacts', request,
                   WebsocketAdapter.callbacks.getImpacts(subject, callback));
};
