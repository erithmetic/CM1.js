# Carbon.js

Carbon calculations for your JavaScripts.

## Usage

You can turn any object into a carbon calculating machine. For example, let's say we have an object representing a rental car:


    RentalCar = function() {};
    
    var car = new RentalCar();
    car.make = 'Honda';
    car.model = 'Fit';
    car.fuel_efficiency = 36.7;

Now we want to figure out how much CO2 it emits. Carbon.js will add carbon calculation powers to your object. Before instantiating a RentlCar, use `Carbon.emitter()` to tell your object how to use CM1 to calculate emissions. A new function called `getEmissionEstimate()` will be added to your class.

    RentalCar = function() {};
    
    Carbon.emitter(RentalCar, function(emitter) {
      emitter.emitAs('automobile');
      emitter.provide('make');
      emitter.provide('model');
      emitter.provide('fuel_economy', { as: 'fuel_efficiency' });
    });

This says "my RentalCar class will use the [Automobile emitter](http://carbon.brighterplanet.com/models/automobile) to calculate emissions. It uses the make property to provide make to the web service, model maps to model, and the fuel_economy property maps to fuel_efficiency on CM1.

Now, we can calculate emissions:

    var car = new RentalCar();
    car.make = 'Honda';
    car.model = 'Fit';
    car.fuel_efficiency = 36.7;

    car.getEmissionEstimate(function(estimate) {
      alert("My emissions are: " + estimate.value());
    });

There are a whole bunch of [other emitters](http://carbon.brighterplanet.com/models) available, including computer usage, rail trips, and flights.

## Requirements

Currently, Carbon.js relies on jQuery for AJAX calls. In the future, support could be added for other libraries.
