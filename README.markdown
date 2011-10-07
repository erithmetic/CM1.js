# CM1.js

Carbon, energy, and other sustainability calculations for your JavaScripts. Built for the browser and Node.js.

## Usage

You can turn any object into a carbon calculating machine. For example, let's say we have an object representing a rental car:


    RentalCar = function() {};
    
    var car = new RentalCar();
    car.make = 'Honda';
    car.model = 'Fit';
    car.fuel_economy = 36.7;

Now we want to figure out how much CO2 it emits. CM1.js will add carbon calculation powers to your object. Before instantiating a RentlCar, use `Carbon.emitter()` to tell your object how to use CM1 to calculate emissions. A new function called `getEmissionEstimate()` will be added to your class.

    var CM1 = require('cm1');  //this works in Node.js and all browsers since CM1.js is packaged with browserify
    
    RentalCar = function() {};
    
    CM1.emitter(RentalCar, function(emitter) {
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
    car.fuel_economy = 36.7;

    car.getEmissionEstimate(function(err, estimate) {
      alert("My emissions are: " + estimate.value());
    });

There are a whole bunch of [other emitters](http://carbon.brighterplanet.com/models) available, including computer usage, rail trips, and flights.

## Specifying an API Key

CM1 is free for non-commercial use and available for commercial use. Commercial use requires an API key, and we recommend obtaining a non-commercial key for non-commercial use, as it will prevent rate-limiting. You can get a key at [keys.brighterplanet.com](http://keys.brighterplanet.com).

Once you have your key, you can specify it with:

    var CM1 = require('CM1');
    process.env.CM1_KEY = 'ABC123';
    
Note: if using the stand-alone library, `process.env` won't be available in your browser until you `require('CM1')`.

## Deploy With Browserify

CM1.js can be used with [browserify](http://github.com/substack/browserify). Simply `npm install CM1` and `require('CM1')` in your code.