describe('EmissionEstimate', function() {
  var estimate;

  beforeEach(function() {
    estimate = new EmissionEstimate();
    estimate.data = Cm1Result.fit;
  });
  
  describe('#value', function() {
    it('returns the emission value', function() {
      expect(estimate.value()).toBe(3563.616916486099);
    });
  });

  describe('#methodology', function() {
    it('returns the methodology URL', function() {
      expect(estimate.methodology()).toBe('http://carbon.brighterplanet.com/automobiles.html?make=Honda&timeframe=2011-01-01%2F2012-01-01');
    });
  });

  describe('#toString', function() {
    it('returns a string representation of the emission value', function() {
      expect(estimate.toString()).toBe('3563.616916486099');
    });
  });
});
