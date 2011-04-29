sharedExamplesFor('EmissionEstimator', function() {
  beforeEach(function() {
    car = new RentalCar();
    car.make = 'Honda';
    car.model = 'Fit';
    car.fuel_economy = 38.2;
    this.estimator.emitter = car;
    this.estimator.carbon = RentalCar.carbon;
  })

  describe('#url', function() {
    it('returns the proper url for the emitter', function() {
      expect(this.estimator.url()).toMatch(/http:\/\/carbon.brighterplanet.com\/automobiles.js/);
    });
  });

  describe('#params', function() {
    it('returns an empty object if no params are set', function() {
      car.mileage = function() { return null; };
      car.make = null;
      car.model = null;
      car.fuel_economy = null;
      expect(this.estimator.params()).toEqual({});
    });
    it('returns an object mapping CM1 params to emitter attribute values', function() {
      expect(this.estimator.params()).toEqual({
        make: 'Honda',
        model: 'Fit',
        fuel_efficiency: 38.2,
        annual_distance_estimate: 112300
      });
    });
    it('includes Carbon.key if set', function() {
      Carbon.key = 'abc123';
      expect(this.estimator.params()).toEqual({
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
      onSuccess = jasmine.createSpy('onSuccess');
      onError = jasmine.createSpy('onError');
    });

    it('calls the given onSuccess method with the emissionEstimate', function() {
      this.estimator.getEmissionEstimate(onSuccess, onError);
      expect(onSuccess).toHaveBeenCalledWith(car.emissionEstimate);
    });
    it("sets the data attribute on the emitter's EmissionEstimate", function() {
      this.estimator.getEmissionEstimate(onSuccess, onError);
      expect(this.estimator.emitter.emissionEstimate.data).toBe(this.result);
    });
  });
});
