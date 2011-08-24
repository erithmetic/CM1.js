require('./helper');
var Cm1Result = require('./fixtures/cm1-result');

var EmissionEstimate = CM1.EmissionEstimate;
var estimate = function() {
  var estimate = new EmissionEstimate();
  estimate.data = Cm1Result.fit;
  return estimate;
};

vows.describe('EmissionEstimate').addBatch({
  '#value': {
    'returns the emission value': function() {
      assert.equal(estimate().value(), 3563.616916486099);
    }
  },

  '#methodology': {
    'returns the methodology URL': function() {
      assert.equal(estimate().methodology(), 'http://carbon.brighterplanet.com/automobiles.html?make=Honda&timeframe=2011-01-01%2F2012-01-01');
    }
  },

  '#toString': {
    'returns a string representation of the emission value': function() {
      assert.equal(estimate().toString(), '3563.616916486099');
    }
  }
}).export(module);
