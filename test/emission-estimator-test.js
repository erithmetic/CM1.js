require('./helper');
var RentalCar = require('./fixtures/rental-car'),
    Cm1Result = require('./fixtures/cm1-result');

var fakeweb = require('fakeweb'),
    http = require('http');
http.register_intercept({
    uri: '/automobiles.json', 
    host: 'carbon.brighterplanet.com',
    body: JSON.stringify(Cm1Result.fit)
});

var EmissionEstimate = require('../lib/emission-estimate'),
    EmissionEstimator = CM1.EmissionEstimator;

vows.describe('EmissionEstimator').addBatch({
  '#params': {
    topic: new EmissionEstimator(new RentalCar(), RentalCar.cm1),

    'returns an empty object if no params are set': function(estimator) {
      estimator.emitter.mileage = function() { return null; };
      assert.deepEqual(estimator.params(), {});
    },
    'returns an object mapping CM1 params to emitter attribute values': function(estimator) {
      estimator = new EmissionEstimator(new RentalCar(), RentalCar.cm1);
      estimator.emitter.make = 'Honda';
      estimator.emitter.model = 'Fit';
      estimator.emitter.fuel_economy = 38.2;

      assert.deepEqual(estimator.params(), {
        make: 'Honda',
        model: 'Fit',
        fuel_efficiency: 38.2,
        annual_distance_estimate: 112300
      });
    },
    'includes CM1.key if set': function(estimator) {
      CM1.key = 'abc123';
      assert.deepEqual(estimator.params().key, 'abc123');
      CM1.key = null;
    },
    'includes any emitter#parameters if defined': function(estimator) {
      estimator.emitter.parameters = { fuel_economy: 2.3 };
      assert.equal(estimator.params().fuel_economy, 2.3);
    }
  },

  '#getEmissionEstimate': {
    topic: function() {
      var car = new RentalCar();
      car.getEmissionEstimate(this.callback);
    },
    //'sends a null err': function(err) {
      //assert.isNull(err);
    //},
    'calls the given onSuccess method with the emissionEstimate': function(err, estimate) {
      assert.instanceOf(estimate, EmissionEstimate);
    },
    "sets the data attribute on the emitter's EmissionEstimate": function(err, estimate) {
      assert.deepEqual(estimate.data, Cm1Result.fit);
    }
  },

  '#pluralize': {
    topic: new EmissionEstimator(new RentalCar(), RentalCar.cm1),

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
}).export(module);
