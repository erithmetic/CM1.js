Cm1WebsocketResult = module.exports = {
  fit: {
    "characteristics": {
      "make": {"description": "Honda", "object": {"automobile_make": {"fuel_efficiency": 13.3126, "fuel_efficiency_units": "kilometres_per_litre", "name": "Honda"}}},
      "make_model": {"description": "Honda FIT", "object": {"automobile_make_model": {"fuel_efficiency_city": 11.6956, "fuel_efficiency_city_units": "kilometres_per_litre", "fuel_efficiency_highway": 14.4958, "fuel_efficiency_highway_units": "kilometres_per_litre", "make_name": "Honda", "model_name": "FIT", "name": "Honda FIT"}}}
    },
    "compliance": [],
    "decisions": {
      "carbon": {"description": "3362.979842566016", "methodology": "from co2 emission, ch4 emission, n2o emission, and hfc emission", "object": {"value": 3362.979842566016, "units": "kilograms"}},
      "co2_emission": {"description": "3205.388194215117", "methodology": "from fuel use and co2 emission factor", "object": 3205.388194215117},
      "co2_biogenic_emission": {"description": "0.0", "methodology": "from fuel use and co2 biogenic emission factor", "object": 0.0},
      "ch4_emission": {"description": "3.3015794728487244", "methodology": "from fuel use and ch4 emission factor", "object": 3.3015794728487244},
      "n2o_emission": {"description": "11.22656432608252", "methodology": "from fuel use and n2o emission factor", "object": 11.22656432608252},
      "hfc_emission": {"description": "143.06350455196815", "methodology": "from fuel use and hfc emission factor", "object": 143.06350455196815},
      "co2_emission_factor": {"description": "2.350458874563432", "methodology": "from automobile fuel", "object": 2.350458874563432},
      "co2_biogenic_emission_factor": {"description": "0.0", "methodology": "from automobile fuel", "object": 0.0},
      "ch4_emission_factor": {"description": "0.0024209943700544325", "methodology": "from automobile fuel", "object": 0.0024209943700544325},
      "n2o_emission_factor": {"description": "0.008232256485726296", "methodology": "from automobile fuel", "object": 0.008232256485726296},
      "hfc_emission_factor": {"description": "0.10490613414849073", "methodology": "from automobile fuel", "object": 0.10490613414849073},
      "fuel_use": {"description": "1363.7286867273851", "methodology": "from fuel efficiency and distance", "object": 1363.7286867273851},
      "distance": {"description": "17923.1166857184", "methodology": "from annual distance", "object": 17923.1166857184},
      "annual_distance": {"description": "17, 923.1166857184 km", "methodology": "from automobile fuel", "object": {"value": 17923.1166857184, "units": "kilometres"} },
    "automobile_fuel": {"description": "fallback", "methodology": "default", "object": {"automobile_fuel": {"annual_distance": 17923.1166857184, "annual_distance_units": "kilometres", "base_fuel_name": null, "blend_fuel_name": null, "blend_portion": null, "ch4_emission_factor": 0.0024209943700544325, "ch4_emission_factor_units": "kilograms_co2e_per_litre", "co2_biogenic_emission_factor": 0.0, "co2_biogenic_emission_factor_units": "kilograms_per_litre", "co2_emission_factor": 2.350458874563432, "co2_emission_factor_units": "kilograms_per_litre", "code": null, "distance_key": null, "ef_key": null, "emission_factor": null, "emission_factor_units": null, "hfc_emission_factor": 0.10490613414849073, "hfc_emission_factor_units": "kilograms_co2e_per_litre", "n2o_emission_factor": 0.008232256485726296, "n2o_emission_factor_units": "kilograms_co2e_per_litre", "name": "fallback"}}},
    "speed": {"description": "50.943879367060404 km/h", "methodology": "from urbanity", "object": {"value": 50.943879367060404, "units": "kilometres_per_hour"}},
    "fuel_efficiency": {"description": "13.14272909278567 km/l", "methodology": "from make model and urbanity", "object": {"value": 13.14272909278567, "units": "kilometres_per_litre"}},
    "hybridity_multiplier": {"description": "1.0", "methodology": "default", "object": 1.0},
    "urbanity": {"description": "0.43", "methodology": "default", "object": 0.43},
    "active_subtimeframe": {"description": "2011-01-01/2012-01-01", "methodology": "from acquisition and retirement", "object": {"startDate": "2011-01-01", "endDate": "2012-01-01"}},
    "acquisition": {"description": "2011-01-01", "methodology": "from retirement", "object": "2011-01-01"},
    "retirement": {"description": "2012-01-01", "methodology": "from acquisition", "object": "2012-01-01"}},
    "emitter": "Automobile",
    "equivalents": {
      "cars_off_the_road_for_a_year": 0.6120623313470149,
      "cars_off_the_road_for_a_month": 7.338022016479047,
      "cars_off_the_road_for_a_week": 31.79697441146168,
      "cars_off_the_road_for_a_day": 223.18752023173622,
      "cars_to_priuses_for_a_year": 1.2241246626940299,
      "cars_to_priuses_for_a_month": 14.676044032958094,
      "cars_to_priuses_for_a_week": 63.59394882292336,
      "cars_to_priuses_for_a_day": 446.37504046347243,
      "one_way_domestic_flight": 10.929684488339552,
      "round_trip_domestic_flight": 5.464842244169776,
      "one_way_cross_country_flight": 3.84052298021039,
      "round_trip_cross_country_flight": 1.920261490105195,
      "vegan_meals_instead_of_non_vegan_ones": 2706.14616057492,
      "days_of_veganism": 902.0487201916399,
      "weeks_of_veganism": 128.8626616074446,
      "months_of_veganism": 30.068402772382747,
      "years_of_veganism": 2.4717901842860215,
      "barrels_of_petroleum": 7.822291113808553,
      "canisters_of_bbq_propane": 140.1252811001982,
      "railroad_cars_full_of_coal": 0.01681489921283008,
      "homes_energy_in_a_year": 0.32620904472890355,
      "homes_energy_in_a_month": 3.897693637534013,
      "homes_energy_in_a_week": 16.885521789523967,
      "homes_energy_in_a_day": 118.53495051092438,
      "homes_electricity_in_a_year": 0.49435803685720436,
      "homes_electricity_in_a_month": 5.915481543073622,
      "homes_electricity_in_a_week": 25.632632360038176,
      "homes_electricity_in_a_day": 179.91605859743927,
      "homes_with_lowered_thermostat_2_degrees_for_a_winter": 17.65228119362902,
      "homes_with_raised_thermostat_3_degrees_for_a_summer": 7.936632428455798,
      "replaced_refrigerators": 3.3865207014639784,
      "loads_of_cold_laundry": 1542.1347625667574,
      "lightbulbs_for_a_year": 6.208060789376866,
      "lightbulbs_for_a_month": 75.54934216324554,
      "lightbulbs_for_a_week": 323.7809732825709,
      "lightbulbs_for_a_day": 2266.476901917524,
      "lightbulbs_for_an_evening": 13598.864774484984,
      "lightbulbs_to_CFLs_for_a_day": 38578.34255247983,
      "lightbulbs_to_CFLs_for_a_week": 5511.190832360021,
      "lightbulbs_to_CFLs_for_a_month": 1285.9463211399209,
      "lightbulbs_to_CFLs_for_a_year": 105.69509347200731,
      "days_with_lightbulbs_to_CFLs": 857.2975474266138,
      "weeks_with_lightbulbs_to_CFLs": 122.4696369267266,
      "months_with_lightbulbs_to_CFLs": 28.575239722283435,
      "years_with_lightbulbs_to_CFLs": 2.3473599301110792,
      "recycled_kgs_of_trash": 2319.295863324866,
      "recycled_bags_of_trash": 1285.1123021389647
    },
    "errors": [],
    "methodology": "http://impact.brighterplanet.com/automobiles?fuel_economy=36.7&make=Honda&model=Fit",
    "scope": "The automobile emission estimate is the total anthropogenic emissions from fuel and air conditioning used by the automobile during the timeframe. It includes CO2 emissions from combustion of non-biogenic fuel, CH4 and N2O emissions from combustion of all fuel, and fugitive HFC emissions from air conditioning.",
    "timeframe": {"startDate": "2011-01-01", "endDate": "2012-01-01" }
  }
}