describe('String', function() {
  describe('#pluralize', function() {
    it('adds an "s" to any string', function() {
      expect('Car'.pluralize()).toBe('Cars')
      expect('operas'.pluralize()).toBe('operass')
    });
    it('adds special pluralization to emitter names that need it', function() {
      expect('automobile'.pluralize()     ).toBe('automobiles');
      expect('automobile_trip'.pluralize()).toBe('automobile_trips');
      expect('bus_trip'.pluralize()       ).toBe('bus_trips');
      expect('diet'.pluralize()           ).toBe('diets');
      expect('electricity_use'.pluralize()).toBe('electricity_uses');
      expect('flight'.pluralize()         ).toBe('flights');
      expect('fuel_purchase'.pluralize()  ).toBe('fuel_purchases');
      expect('lodging'.pluralize()        ).toBe('lodgings');
      expect('meeting'.pluralize()        ).toBe('meetings');
      expect('motorcycle'.pluralize()     ).toBe('motorcycles');
      expect('pet'.pluralize()            ).toBe('pets');
      expect('purchase'.pluralize()       ).toBe('purchases');
      expect('rail_trip'.pluralize()      ).toBe('rail_trips');
      expect('residence'.pluralize()      ).toBe('residences');
      expect('shipment'.pluralize()       ).toBe('shipments');
    });
  });
});
