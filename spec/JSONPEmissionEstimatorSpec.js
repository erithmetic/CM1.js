describe('JSONPEmissionEstimator', function() {
  beforeEach(function() {
    this.estimator = new JSONPEmissionEstimator();
    this.result = 'carbon(' + Cm1Result.fit + ');';

    fakeAjax({ urls: {
      'http://carbon.brighterplanet.com/automobiles.js?make=Honda&model=Fit&fuel_efficiency=38.2&annual_distance_estimate=112300': {
        successData: this.result
      }
    } });
  });

  itBehavesLikeAn('EmissionEstimator');
});
