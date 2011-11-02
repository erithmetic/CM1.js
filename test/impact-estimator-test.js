require('./helper');
var RentalCar = require('./fixtures/rental-car'),
    Cm1Result = require('./fixtures/cm1-result');

var ImpactEstimate = require('../lib/impact-estimate'),
    ImpactEstimator = CM1.ImpactEstimator;

vows.describe('ImpactEstimator').addBatch({
  '#params': {
    topic: new ImpactEstimator(RentalCar.cm1),

    'returns an empty object if no params are set': function(estimator) {
      var car = new RentalCar();
      car.mileage = function() { return null; };
      assert.deepEqual(estimator.params(car), {});
    },
    'returns an object mapping CM1 params to emitter attribute values': function(estimator) {
      var car = new RentalCar();
      estimator = new ImpactEstimator(RentalCar.cm1);
      car.make = 'Honda';
      car.model = 'Fit';
      car.fuelEconomy = 38.2;

      assert.deepEqual(estimator.params(car), {
        make: 'Honda',
        model: 'Fit',
        fuel_efficiency: 38.2,
        annual_distance_estimate: 112300
      });
    },
    'includes CM1.key if set': function(estimator) {
      var car = new RentalCar();
      CM1.key = 'abc123';
      assert.deepEqual(estimator.params(car).key, 'abc123');
      CM1.key = null;
    },
    'includes any emitter#parameters if defined': function(estimator) {
      var car = new RentalCar();
      car.parameters = { fuel_economy: 2.3 };
      assert.equal(estimator.params(car).fuel_economy, 2.3);
    }
  },

  '#getImpacts': {
    topic: new ImpactEstimator(RentalCar.cm1),

    'delegates to the current adapter': function(estimator) {
      var car = new RentalCar();
      CM1.useHttpAdapter();
      sinon.spy(estimator.cm1.adapter,'getImpacts');
      estimator.getImpacts(car, function() {});
      assert.isTrue(estimator.cm1.adapter.getImpacts.called);
    }
  }
}).export(module, { error: false });
