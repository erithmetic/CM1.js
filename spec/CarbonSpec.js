describe('Carbon.js usage', function() {
  it('asynchronously calculates emissions for an emitter', function() {
    fakeAjax({ urls: {
      'http://carbon.brighterplanet.com/automobiles.json?make=Honda&model=Fit&fuel_efficiency=36.7&annual_distance_estimate=112300': {
        successData: Cm1Result.fit
      }
    } });

    var car = new RentalCar();
    car.make = 'Honda';
    car.model = 'Fit';
    car.fuel_economy = 36.7;

    var value;
    car.getEmissionEstimate(function(estimate) {
      value = estimate.value();
    });

    expect(value).toBe(3563.616916486099);
    expect(car.emissionEstimate.value()).toBe(3563.616916486099);
  });
});

describe('Carbon', function() {
  var carbon;

  beforeEach(function() {
    carbon = new Carbon();
  });

  describe('.emitter', function() {
    var car;
    beforeEach(function() {
      car = new RentalCar;
    });

    it('sets the type of emitter', function() {
      expect(RentalCar.carbon.emitter_name).toBe('automobile');
    });
    it('creates an #emissionEstimate method on the target class', function() {
      expect(car.emissionEstimate).toBeInstanceOf(EmissionEstimate);
    });
    it('creates an #emissionEstimator method on the target class', function() {
      expect(car.emissionEstimator()).toBeInstanceOf(EmissionEstimator);
    });
    it('creates a #getEmissionEstimate method on the target class', function() {
      expect(car.getEmissionEstimate()).not.toBe(null);
    });
  })

  describe('#define', function() {
    it('runs the specified methods on the Carbon instance', function() {
      carbon.define(function(instance) {
        instance.emitAs('gyrocopter');
      });
      expect(carbon.emitter_name).toBe('gyrocopter');
    })
  })

  describe('#emitAs', function() {
    it('sets the emitter name', function() {
      carbon.emitAs('dirigible');
      expect(carbon.emitter_name).toBe('dirigible');
    });
  });

  describe('#provide', function() {
    it('maps an emitter attribute with the same name as a class attribute', function() {
      carbon.provide('air_speed');
      expect(carbon.attribute_map['air_speed']).toBe('air_speed');
    })
    it('maps an emitter attribute with a different name than a class attribute', function() {
      carbon.provide('air_speed', { as: 'velocity' });
      expect(carbon.attribute_map['air_speed']).toBe('velocity');
    });
  });
});
