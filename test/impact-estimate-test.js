require('./helper');
var Cm1Result = require('./fixtures/cm1-result');

var ImpactEstimate = CM1.ImpactEstimate;
var subject = new Object();
var estimate = new ImpactEstimate(subject, Cm1Result.fit);

vows.describe('ImpactEstimate').addBatch({
  '#carbon': {
    'returns the carbon footprint value': function() {
      assert.equal(estimate.carbon, 3362.979842566016);
    }
  },

  '#subject': {
    'points to the original subject of the calculation': function() {
      assert.equal(estimate.subject, subject);
    }
  },

  'proxies each property of #data': function() {
    assert.isNotNull(estimate.timeframe);
    assert.isObject(estimate.decisions);
    assert.equal(estimate.methodology, 'http://impact.brighterplanet.com/automobiles?fuel_economy=36.7&make=Honda&model=Fit');
  }
}).export(module);
