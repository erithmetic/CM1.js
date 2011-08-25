require('./helper');

var Cm1Result = require('./fixtures/cm1-result'),
    RentalCar = require('./fixtures/rental-car');

var fakeweb = require('fakeweb'),
    http = require('http');
http.register_intercept({
    uri: '/automobiles.json', 
    host: 'carbon.brighterplanet.com',
    body: JSON.stringify(Cm1Result.fit)
});

var car = new RentalCar();
car.make = 'Honda';
car.model = 'Fit';
car.fuel_economy = 36.7;

vows.describe('CM1').addBatch({
  'usage': {
    'asynchronously calculates emissions for an emitter': function() {
      var value;
      car.getEmissionEstimate(function(estimate) {
        value = estimate.value();
      }, function() {});

      assert.equal(value, 3563.616916486099);
      assert.equal(car.emissionEstimate.value(), 3563.616916486099);
    }
  },

  '.emitter': {
    topic: new RentalCar(),

    'sets the type of emitter': function() {
      assert.equal(RentalCar.cm1.emitter_name, 'automobile');
    },
    'creates an #emissionEstimate property on the target class': function(car) {
      assert.isObject(car.emissionEstimate);
    },
    'creates an #emissionEstimator method on the target class': function(car) {
      assert.isObject(car.emissionEstimator());
    },
    'creates a #getEmissionEstimate method on the target class': function(car) {
      assert.isNotNull(car.getEmissionEstimate(function(){}, function(){}));
    }
  },

  '#define': {
    'runs the specified methods on the Carbon instance': function() {
      var cm1 = new CM1();
      cm1.define(function(instance) {
        instance.emitAs('gyrocopter');
      });
      assert.equal(cm1.emitter_name, 'gyrocopter');
    }
  },

  '#emitAs': {
    'sets the emitter name': function() {
      var cm1 = new CM1();
      cm1.emitAs('dirigible');
      assert.equal(cm1.emitter_name, 'dirigible');
    }
  },

  '#provide': {
    topic: new CM1(),

    'maps an emitter attribute with the same name as a class attribute': function(cm1) {
      cm1.provide('air_speed');
      assert.equal(cm1.attribute_map['air_speed'], 'air_speed');
    },
    'maps an emitter attribute with a different name than a class attribute': function(cm1) {
      cm1.provide('air_speed', { as: 'velocity' });
      assert.equal(cm1.attribute_map['air_speed'], 'velocity');
    }
  }
}).export(module);