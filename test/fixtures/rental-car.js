var CM1 = require('../../lib/cm1');

var RentalCar = module.exports = function() {};
RentalCar.prototype.mileage = function() { return 112300; };

CM1.extend(RentalCar, {
  model: 'automobile',
  provides: ['make', 'model', 'year', {
    'fuel_efficiency': 'fuelEconomy',
    'annual_distance_estimate': 'mileage'
  }]
});
