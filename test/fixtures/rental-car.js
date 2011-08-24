var CM1 = require('../../lib/cm1');

var RentalCar = module.exports = function() {};
RentalCar.prototype.mileage = function() { return 112300; };

CM1.emitter(RentalCar, function(emitter) {
  emitter.emitAs('automobile');
  emitter.provide('make');
  emitter.provide('model');
  emitter.provide('fuel_economy', { as: 'fuel_efficiency' });
  emitter.provide('mileage', { as: 'annual_distance_estimate' });
})
