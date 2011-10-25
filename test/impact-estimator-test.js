require('./helper');
var RentalCar = require('./fixtures/rental-car'),
    Cm1Result = require('./fixtures/cm1-result');

var fakeweb = require('fakeweb'),
    http = require('http');
http.register_intercept({
    uri: '/automobiles.json', 
    host: 'impact.brighterplanet.com',
    body: JSON.stringify(Cm1Result.fit)
});

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
    topic: function() {
      var car = new RentalCar();
      car.getImpacts(this.callback);
    },
    'sends a null err': function(err) {
      assert.isNull(err);
    },
    'calls the callback with the impactEstimate': function(err, estimate) {
      assert.instanceOf(estimate, ImpactEstimate);
    },
    "sets the data attribute on the emitter's ImpactEstimate": function(err, estimate) {
      assert.deepEqual(estimate.data, Cm1Result.fit);
    }
  },

  '#pluralize': {
    topic: new ImpactEstimator(RentalCar.cm1),

    'adds an "s" to any string': function(estimator) {
      assert.equal(estimator.pluralize('Car'),'Cars')
      assert.equal(estimator.pluralize('operas'),'operass')
    },
    'adds special pluralization to emitter names that need it': function(estimator) {
      assert.equal(estimator.pluralize('automobile'),      'automobiles');
      assert.equal(estimator.pluralize('automobile_trip'), 'automobile_trips');
      assert.equal(estimator.pluralize('bus_trip'),        'bus_trips');
      assert.equal(estimator.pluralize('diet'),            'diets');
      assert.equal(estimator.pluralize('electricity_use'), 'electricity_uses');
      assert.equal(estimator.pluralize('flight'),          'flights');
      assert.equal(estimator.pluralize('fuel_purchase'),   'fuel_purchases');
      assert.equal(estimator.pluralize('lodging'),         'lodgings');
      assert.equal(estimator.pluralize('meeting'),         'meetings');
      assert.equal(estimator.pluralize('motorcycle'),      'motorcycles');
      assert.equal(estimator.pluralize('pet'),             'pets');
      assert.equal(estimator.pluralize('purchase'),        'purchases');
      assert.equal(estimator.pluralize('rail_trip'),       'rail_trips');
      assert.equal(estimator.pluralize('residence'),       'residences');
      assert.equal(estimator.pluralize('shipment'),        'shipments');
    }
  }
}).export(module, { error: false });
