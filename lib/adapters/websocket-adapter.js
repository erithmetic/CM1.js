var CM1 = require('../cm1');

var ImpactEstimate = require('../impact-estimate'),
    Util = require('../util');

var WebsocketAdapter = module.exports = function() {
  process.env = process.env || {};
  var hostname = process.env.CM1_WEBSOCKET_HOST || CM1.websocketHost || 'push-brighterplanet.no.de:80';
  if(!/^http:/.test(hostname)) hostname = 'http://' + hostname;
  this.host = hostname;
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
  var socketIo = 'socket.io-client';
  this.socket = require(socketIo).connect(this.host);
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
