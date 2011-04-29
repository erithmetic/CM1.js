beforeEach(function() {
  this.addMatchers({
    toBeInstanceOf: function(type) {
      return this.actual instanceof type
    }
  })
  Cm1Result = {
    fit: {"timeframe":"2011-01-01/2012-01-01","emission":3563.616916486099,"emission_units":"kilograms","errors":[],"reports":[{"committee":{"name":"emission","quorums":[{"name":"from fuel","requirements":["fuel_consumed","emission_factor"],"appreciates":[],"complies":["ghg_protocol_scope_1","ghg_protocol_scope_3","iso"]},{"name":"default","requirements":[],"appreciates":[],"complies":[]}]},"conclusion":3563.616916486099,"quorum":{"name":"from fuel","requirements":["fuel_consumed","emission_factor"],"appreciates":[],"complies":["ghg_protocol_scope_1","ghg_protocol_scope_3","iso"]}},{"committee":{"name":"emission_factor","quorums":[{"name":"from fuel type","requirements":["fuel_type"],"appreciates":[],"complies":["ghg_protocol_scope_1","ghg_protocol_scope_3","iso"]},{"name":"default","requirements":[],"appreciates":[],"complies":["ghg_protocol_scope_1","ghg_protocol_scope_3","iso"]}]},"conclusion":2.490112979487,"quorum":{"name":"default","requirements":[],"appreciates":[],"complies":["ghg_protocol_scope_1","ghg_protocol_scope_3","iso"]}},{"committee":{"name":"fuel_consumed","quorums":[{"name":"from fuel efficiency and distance","requirements":["fuel_efficiency","distance"],"appreciates":[],"complies":["ghg_protocol_scope_1","ghg_protocol_scope_3","iso"]}]},"conclusion":1431.106518395907,"quorum":{"name":"from fuel efficiency and distance","requirements":["fuel_efficiency","distance"],"appreciates":[],"complies":["ghg_protocol_scope_1","ghg_protocol_scope_3","iso"]}},{"committee":{"name":"distance","quorums":[{"name":"from annual distance","requirements":["annual_distance","active_subtimeframe"],"appreciates":[],"complies":["ghg_protocol_scope_3","iso"]}]},"conclusion":19020.836736,"quorum":{"name":"from annual distance","requirements":["annual_distance","active_subtimeframe"],"appreciates":[],"complies":["ghg_protocol_scope_3","iso"]}},{"committee":{"name":"annual_distance","quorums":[{"name":"from weekly distance and timeframe","requirements":["weekly_distance"],"appreciates":[],"complies":["ghg_protocol_scope_3","iso"]},{"name":"from daily distance and timeframe","requirements":["daily_distance"],"appreciates":[],"complies":["ghg_protocol_scope_3","iso"]},{"name":"from daily duration, speed, and timeframe","requirements":["daily_duration","speed"],"appreciates":[],"complies":["ghg_protocol_scope_3","iso"]},{"name":"from size class","requirements":["size_class"],"appreciates":[],"complies":["ghg_protocol_scope_3","iso"]},{"name":"from fuel type","requirements":["fuel_type"],"appreciates":[],"complies":["ghg_protocol_scope_3","iso"]},{"name":"default","requirements":[],"appreciates":[],"complies":["ghg_protocol_scope_3","iso"]}]},"conclusion":19020.836736,"quorum":{"name":"default","requirements":[],"appreciates":[],"complies":["ghg_protocol_scope_3","iso"]}},{"committee":{"name":"fuel_efficiency","quorums":[{"name":"from make model year variant and urbanity","requirements":["make_model_year_variant","urbanity"],"appreciates":[],"complies":["ghg_protocol_scope_1","ghg_protocol_scope_3","iso"]},{"name":"from make model year and urbanity","requirements":["make_model_year","urbanity"],"appreciates":[],"complies":["ghg_protocol_scope_1","ghg_protocol_scope_3","iso"]},{"name":"from make model and urbanity","requirements":["make_model","urbanity"],"appreciates":[],"complies":["ghg_protocol_scope_1","ghg_protocol_scope_3","iso"]},{"name":"from size class, hybridity multiplier, and urbanity","requirements":["size_class","hybridity_multiplier","urbanity"],"appreciates":[],"complies":["ghg_protocol_scope_1","ghg_protocol_scope_3","iso"]},{"name":"from make year and hybridity multiplier","requirements":["make_year","hybridity_multiplier"],"appreciates":[],"complies":["ghg_protocol_scope_1","ghg_protocol_scope_3","iso"]},{"name":"from make and hybridity multiplier","requirements":["make","hybridity_multiplier"],"appreciates":[],"complies":["ghg_protocol_scope_1","ghg_protocol_scope_3","iso"]},{"name":"from hybridity multiplier","requirements":["hybridity_multiplier"],"appreciates":[],"complies":["ghg_protocol_scope_3","iso"]}]},"conclusion":13.291,"quorum":{"name":"from make and hybridity multiplier","requirements":["make","hybridity_multiplier"],"appreciates":[],"complies":["ghg_protocol_scope_1","ghg_protocol_scope_3","iso"]}},{"committee":{"name":"hybridity_multiplier","quorums":[{"name":"from size class, hybridity, and urbanity","requirements":["size_class","hybridity","urbanity"],"appreciates":[],"complies":["ghg_protocol_scope_1","ghg_protocol_scope_3","iso"]},{"name":"from hybridity and urbanity","requirements":["hybridity","urbanity"],"appreciates":[],"complies":["ghg_protocol_scope_1","ghg_protocol_scope_3","iso"]},{"name":"default","requirements":[],"appreciates":[],"complies":["ghg_protocol_scope_1","ghg_protocol_scope_3","iso"]}]},"conclusion":1.0,"quorum":{"name":"default","requirements":[],"appreciates":[],"complies":["ghg_protocol_scope_1","ghg_protocol_scope_3","iso"]}},{"committee":{"name":"speed","quorums":[{"name":"from urbanity","requirements":["urbanity"],"appreciates":[],"complies":["ghg_protocol_scope_1","ghg_protocol_scope_3","iso"]}]},"conclusion":50.943879367060404,"quorum":{"name":"from urbanity","requirements":["urbanity"],"appreciates":[],"complies":["ghg_protocol_scope_1","ghg_protocol_scope_3","iso"]}},{"committee":{"name":"urbanity","quorums":[{"name":"default","requirements":[],"appreciates":[],"complies":["ghg_protocol_scope_1","ghg_protocol_scope_3","iso"]}]},"conclusion":0.43,"quorum":{"name":"default","requirements":[],"appreciates":[],"complies":["ghg_protocol_scope_1","ghg_protocol_scope_3","iso"]}},{"committee":{"name":"active_subtimeframe","quorums":[{"name":"from acquisition and retirement","requirements":["acquisition","retirement"],"appreciates":[],"complies":["ghg_protocol_scope_1","ghg_protocol_scope_3","iso"]}]},"conclusion":"2011-01-01/2012-01-01","quorum":{"name":"from acquisition and retirement","requirements":["acquisition","retirement"],"appreciates":[],"complies":["ghg_protocol_scope_1","ghg_protocol_scope_3","iso"]}},{"committee":{"name":"acquisition","quorums":[{"name":"from make model year variant","requirements":["make_model_year_variant"],"appreciates":[],"complies":["ghg_protocol_scope_3","iso"]},{"name":"from make model year","requirements":["make_model_year"],"appreciates":[],"complies":["ghg_protocol_scope_3","iso"]},{"name":"from make year","requirements":["make_year"],"appreciates":[],"complies":["ghg_protocol_scope_3","iso"]},{"name":"from retirement","requirements":[],"appreciates":["retirement"],"complies":["ghg_protocol_scope_3","iso"]}]},"conclusion":"2011-01-01","quorum":{"name":"from retirement","requirements":[],"appreciates":["retirement"],"complies":["ghg_protocol_scope_3","iso"]}},{"committee":{"name":"retirement","quorums":[{"name":"from acquisition","requirements":[],"appreciates":["acquisition"],"complies":["ghg_protocol_scope_3","iso"]}]},"conclusion":"2012-01-01","quorum":{"name":"from acquisition","requirements":[],"appreciates":["acquisition"],"complies":["ghg_protocol_scope_3","iso"]}}],"methodology":"http://carbon.brighterplanet.com/automobiles.html?make=Honda&timeframe=2011-01-01%2F2012-01-01","execution_id":"1c620eaa39ae4023e05a6558087970e0dbd32c4e4352e5ec790bd05b1cc5a480f29ce252565d884c","complies":[],"make":{"automobile_make":{"fuel_efficiency":13.291,"fuel_efficiency_units":"kilometres_per_litre","name":"Honda"}},"retirement":"2012-01-01","acquisition":"2011-01-01","active_subtimeframe":"2011-01-01/2012-01-01","urbanity":0.43,"speed":50.943879367060404,"hybridity_multiplier":1.0,"fuel_efficiency":13.291,"annual_distance":19020.836736,"distance":19020.836736,"fuel_consumed":1431.106518395907,"emission_factor":2.490112979487}
  }
});

jasmine.exampleGroups = {};

jasmine.Env.prototype.itBehavesLikeA = function(subject) {
  var group = jasmine.exampleGroups[subject];
  if(group) {
    group.call(this);
  } else {
    jasmine.log('Missing example group "' + subject + '"');
  }
}

jasmine.Env.prototype.sharedExamplesFor = function(subject, suite) {
  jasmine.exampleGroups[subject] = suite;
}

var itBehavesLikeA = function(subject) {
  return jasmine.getEnv().itBehavesLikeA(subject);
}
var itBehavesLikeAn = itBehavesLikeA;

var sharedExamplesFor = function(subject, suite) {
  return jasmine.getEnv().sharedExamplesFor(subject, suite);
}
