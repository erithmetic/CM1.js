describe('EmissionEstimator', function() {
  var car, estimator;

  beforeEach(function() {
    car = new RentalCar();
    car.make = 'Honda';
    car.model = 'Fit';
    car.fuel_economy = 38.2;

    estimator = new EmissionEstimator(car, RentalCar.carbon);
  })

  describe('#url', function() {
    it('returns the proper url for the emitter', function() {
      expect(estimator.url()).toBe('http://carbon.brighterplanet.com/automobiles.json');
    });
  });

  describe('#params', function() {
    it('returns an empty object if no params are set', function() {
      car.mileage = function() { return null; };
      car.make = null;
      car.model = null;
      car.fuel_economy = null;
      expect(estimator.params()).toEqual({});
    });
    it('returns an object mapping CM1 params to emitter attribute values', function() {
      expect(estimator.params()).toEqual({
        make: 'Honda',
        model: 'Fit',
        fuel_efficiency: 38.2,
        annual_distance_estimate: 112300
      });
    });
    it('includes Carbon.key if set', function() {
      Carbon.key = 'abc123';
      expect(estimator.params()).toEqual({
        make: 'Honda',
        model: 'Fit',
        fuel_efficiency: 38.2,
        annual_distance_estimate: 112300,
        key: 'abc123'
      });
      Carbon.key = null;
    });
  });

  describe('#getEmissionEstimate', function() {
    var onSuccess, onError;

    beforeEach(function() {
      fakeAjax({ urls: {
        'http://carbon.brighterplanet.com/automobiles.json?make=Honda&model=Fit&fuel_efficiency=38.2&annual_distance_estimate=112300': {
          successData: Cm1Result.fit  
        }
      } });

      onSuccess = jasmine.createSpy('onSuccess');
      onError = jasmine.createSpy('onError');
    });

    it('calls the given onSuccess method with the emissionEstimate', function() {
      car.getEmissionEstimate(onSuccess, onError);
      expect(onSuccess).toHaveBeenCalledWith(car.emissionEstimate);
    });
    it("sets the data attribute on the emitter's EmissionEstimate", function() {
      car.getEmissionEstimate(onSuccess, onError);
      expect(car.emissionEstimate.data).toBe(Cm1Result.fit);
    });
  });
});
