require('./helper');

var Cm1Result = require('./fixtures/cm1-result'),
    RentalCar = require('./fixtures/rental-car');

var fakeweb = require('fakeweb'),
    http = require('http');
http.register_intercept({
    uri: '/automobiles.json', 
    host: 'impact.brighterplanet.com',
    body: JSON.stringify(Cm1Result.fit)
});

var car = new RentalCar();
car.make = 'Honda';
car.model = 'Fit';
car.fuelEconomy = 36.7;

vows.describe('CM1').addBatch({
  'usage': {
    topic: function() {
      car.getImpacts(this.callback);
    },

    'asynchronously calculates emissions for an emitter': function(err, impacts) {
      assert.equal(impacts.carbon, 3362.979842566016);
    },
    "sets the emitter's impacts property": function() {
      assert.equal(car.impacts.carbon, 3362.979842566016);
    }
  },

  '.key': {
    'uses process.env.CM1_KEY if available': function() {
      CM1.key = null;
      process.env.CM1_KEY = 'ABC123';
      assert.equal(RentalCar.cm1.key(), 'ABC123');
      delete process.env.CM1_KEY;
    }
  },

  '.model': {
    topic: new RentalCar(),

    'sets the model': function() {
      assert.equal(RentalCar.cm1.model, 'automobile');
    },
    'creates a #getImpacts method on the target prototype': function(car) {
      assert.isNotNull(car.getImpacts);
    }
  },

  '#define': {
    'configures the CM1 mapping': function() {
      var cm1 = new CM1();
      cm1.define({ model: 'gyrocopter' });
      assert.equal(cm1.model, 'gyrocopter');
    },
    'allows either `provide` or `provides` to map characteristics': function() {
      var cm1 = new CM1();
      cm1.define({ provide: ['speed'] });
      assert.equal(cm1.attributeMap.speed, 'speed');

      var cm1 = new CM1();
      cm1.define({ provides: ['speed'] });
      assert.equal(cm1.attributeMap.speed, 'speed');
    }
  },

  '#emitAs': {
    'sets the model name': function() {
      var cm1 = new CM1();
      cm1.emitAs('dirigible');
      assert.equal(cm1.model, 'dirigible');
    }
  },

  '#provide': {
    topic: new CM1(),

    'maps an emitter attribute with the same name as a class attribute': function(cm1) {
      cm1.provide(['air_speed']);
      assert.equal(cm1.attributeMap.air_speed, 'air_speed');
    },
    'maps an emitter attribute with a different name than a class attribute': function(cm1) {
      cm1.provide({ air_speed: 'velocity' });
      assert.equal(cm1.attributeMap.air_speed, 'velocity');
    },
    'maps mixed standard attributes and renamed attributes': function(cm1) {
      cm1.provide(['drag_coefficient', 'weight', { air_speed: 'velocity' }]);
      assert.equal(cm1.attributeMap.drag_coefficient, 'drag_coefficient');
      assert.equal(cm1.attributeMap.weight, 'weight');
      assert.equal(cm1.attributeMap.air_speed, 'velocity');
    },
    'underscorizes attribute names': function(cm1) {
      cm1.provide(['airSpeedAwesomeness', { drag_coefficient: 'coeffOfDrag' }]);
      assert.equal(cm1.attributeMap.air_speed_awesomeness, 'airSpeedAwesomeness');
      assert.equal(cm1.attributeMap.drag_coefficient, 'coeffOfDrag');
    }
  },

  '#underscore': {
    topic: new CM1(),

    'underscores a string': function(cm1) {
      assert.equal(cm1.underscore('totallyAwesomeBro'), 'totally_awesome_bro');
    },
    'leaves an uncamelized string alone': function(cm1) {
      assert.equal(cm1.underscore('totally'), 'totally');
    }
  }
}).export(module);
