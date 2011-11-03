var io = require('socket.io-client');

var ImpactEstimate = require('../impact-estimate'),
    Util = require('../util');

var WebsocketAdapter = module.exports = function() {
  this.host = 'push-brighterplanet.no.de';
};

WebsocketAdapter.callbacks = {
  getImpacts: function(subject, callback) {
    return function(response) {
      if(response.statusCode < 300) {
        subject.impacts = new ImpactEstimate(subject, response.body);
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
  this.socket.emit(Util.pluralize(cm1.model), params,
                   WebsocketAdapter.callbacks.getImpacts(subject, callback));
};
