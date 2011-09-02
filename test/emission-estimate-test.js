require('./helper');
var Cm1Result = require('./fixtures/cm1-result');

var EmissionEstimate = CM1.EmissionEstimate;
var estimate = new EmissionEstimate({}, Cm1Result.fit);

vows.describe('EmissionEstimate').addBatch({
  '#value': {
    'returns the emission value': function() {
      assert.equal(estimate.value(), 3563.616916486099);
    }
  },

  '#toString': {
    'returns a string representation of the emission value': function() {
      assert.equal(estimate.toString(), '3563.616916486099');
    }
  },

  'proxies each property of #data': function() {
    assert.isNotNull(estimate.timeframe);
    assert.isNotEmpty(estimate.reports);
    assert.equal(estimate.methodology, 'http://carbon.brighterplanet.com/automobiles.html?make=Honda&timeframe=2011-01-01%2F2012-01-01');
  }
}).export(module);
