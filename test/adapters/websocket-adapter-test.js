require('../helper');
var Cm1WebsocketResult = require('../fixtures/cm1-result');

var WebsocketAdapter = require('../../lib/adapters/websocket-adapter'),
    ImpactEstimate = require('../../lib/impact-estimate');

var adapter = new WebsocketAdapter();
adapter.socket = { emit: function() {} };

var cm1 = { model: 'automobile' };

vows.describe('WebsocketAdapter').addBatch({
  '.callbacks': {
    '.getImpacts': {
      'success': {
        topic: function() {
          var subject = {};
          var func = WebsocketAdapter.callbacks.getImpacts(subject, this.callback);
          func({
            statusCode: 200,
            body: JSON.stringify(Cm1WebsocketResult.fit)
          });
        },

        'calls callback with response data on success': function(err, impacts) {
          assert.isNull(err);
          assert.equal(impacts.carbon, 3362.979842566016);
        }
      },
      'failure': {
        topic: function() {
          var subject = {};
          var func = WebsocketAdapter.callbacks.getImpacts(subject, this.callback);
          func({
            statusCode: 500,
            body: 'Leap::NoSolutionError'
          });
        },

        'calls callback with err on failure': function(err) {
          assert.isNotNull(err);
        }
      }
    }
  },
  '#getImpacts': {
    'makes a websocket request for emissions': function() {
      var car = {};
      var params = {
        annual_distance_estimate: 24000,
        make: 'Trabant'
      };
      var emitParams = {
        'PATH_INFO': '/automobiles.json',
        'body': JSON.stringify(params)
      };


      var mock = sinon.mock(adapter.socket);
      mock.expects('emit').withArgs('impacts', emitParams);

      adapter.getImpacts(cm1, car, params);

      mock.verify();
    }
  },
}).export(module, { error: false });
