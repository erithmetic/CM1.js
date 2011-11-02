require('./helper');

var Util = require('../lib/util');

vows.describe('Util').addBatch({
  '.pluralize': {
    'adds an "s" to any string': function() {
      assert.equal(Util.pluralize('Car'),'Cars')
      assert.equal(Util.pluralize('operas'),'operass')
    },
    'adds special pluralization to emitter names that need it': function() {
      assert.equal(Util.pluralize('automobile'),      'automobiles');
      assert.equal(Util.pluralize('automobile_trip'), 'automobile_trips');
      assert.equal(Util.pluralize('bus_trip'),        'bus_trips');
      assert.equal(Util.pluralize('diet'),            'diets');
      assert.equal(Util.pluralize('electricity_use'), 'electricity_uses');
      assert.equal(Util.pluralize('flight'),          'flights');
      assert.equal(Util.pluralize('fuel_purchase'),   'fuel_purchases');
      assert.equal(Util.pluralize('lodging'),         'lodgings');
      assert.equal(Util.pluralize('meeting'),         'meetings');
      assert.equal(Util.pluralize('motorcycle'),      'motorcycles');
      assert.equal(Util.pluralize('pet'),             'pets');
      assert.equal(Util.pluralize('purchase'),        'purchases');
      assert.equal(Util.pluralize('rail_trip'),       'rail_trips');
      assert.equal(Util.pluralize('residence'),       'residences');
      assert.equal(Util.pluralize('shipment'),        'shipments');
    }
  }
}).export(module);
