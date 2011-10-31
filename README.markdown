# CM1.js

Carbon, energy, and other environmental impact calculations for your JavaScript objects. Built for the browser and Node.js.

## Usage

You can turn any object into an impact calculating machine. For example, let's say we have an object representing a rental car:


    var RentalCar = function() {};
    
    var car = new RentalCar();
    car.make = 'Honda';
    car.model = 'Fit';
    car.fuelEconomy = 36.7;

Now we want to figure out how much CO2 it emits. CM1.js will add impact calculation powers to your prototype. Before instantiating a RentlCar, use `CM1.extend()` to tell your prototype how to use CM1 to calculate impacts. The first argument is the prototype to extend, the second argument is a object that describes mappings between properties of your prototype instance to the characteristics sent to CM1. After executing `CM1.extend()`, A new function called `getImpacts()` will be added to your class.

    var RentalCar = function() {};
    
    CM1.extend(RentalCar, {
      model: 'automobile',
      provides: ['make', 'model', {
        'fuel_efficiency': 'fuelEconomy'
      }
    });

This says "my RentalCar prototype will use the [Automobile emitter](http://carbon.brighterplanet.com/models/automobile) to calculate impacts. It uses the make property to provide make to the web service, model maps to model, and the fuelEconomy property maps to fuel_efficiency on CM1.

Now, we can calculate impacts:

    var car = new RentalCar();
    car.make = 'Honda';
    car.model = 'Fit';
    car.fuelEconomy = 36.7;

    car.getImpacts(function(err, impacts) {
      if(err) alert("Oops, something broke: " + err);
 
      alert("My emissions are: " + impacts.carbon);
      alert("My fuel use is: " + impacts.fuelUse);
    });

There are a whole bunch of [other models](http://carbon.brighterplanet.com/models) available, including computer usage, rail trips, and flights.

## Specifying an API Key

CM1 is free for non-commercial use and available for commercial use. Commercial use requires an API key, and we recommend obtaining a non-commercial key for non-commercial use, as it will prevent rate-limiting. You can get a key at [keys.brighterplanet.com](http://keys.brighterplanet.com).

Once you have your key, you can specify it with:

    var CM1 = require('CM1');
    process.env.CM1_KEY = 'ABC123';
    
Note: if using the stand-alone library, `process.env` won't be available in your browser until you `require('CM1')`.

## Deploy With Browserify

CM1.js can be used with [browserify](http://github.com/substack/node-browserify). Simply `npm install CM1` and `require('CM1')` in your code.
