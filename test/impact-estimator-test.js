require('./helper');
var RentalCar = require('./fixtures/rental-car'),
    Cm1Result = require('./fixtures/cm1-result');

var ImpactEstimate = require('../lib/impact-estimate'),
    ImpactEstimator = CM1.ImpactEstimator;

CM1.useHttpAdapter();

vows.describe('ImpactEstimator').addBatch({
  '.callbacks': {
    '.getImpacts': {
      'sets subject.impacts to the result on success': function() {
        var car = {};
        var cb = ImpactEstimator.callbacks.getImpacts(car, function() {});
        cb(null, Cm1Result.fit);
        assert.equal(car.impacts, Cm1Result.fit);
      },
      'passes along the error on failure': function() {
        var clientCallback = sinon.spy();
        var cb = ImpactEstimator.callbacks.getImpacts({}, clientCallback);
        var err = 'I have failed, my Leige';
        cb(err);
        assert.ok(clientCallback.calledWith(err));
      }
    }
  },

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

      var adapter = sinon.mock(estimator.cm1.adapter());
      adapter.expects('getImpacts');

      estimator.getImpacts(car, function() {});

      adapter.verify();
    },
  }
}).export(module, { error: false });
