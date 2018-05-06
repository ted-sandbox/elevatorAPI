//ted-sandbox Elevator API
console.log('Welcome to the Elevator API');


//setup any includes from npm library
var express = require('express');


//setup the Express JS variable
var app = express();


//Setup some data structures and variables

//Define our elevator class
function elevator(name, id, currentfloor, destinationfloor, numpassengers, carstatus){
    this.name = name; //name of the car
    this.id = id;//ID number of the car
    this.currentfloor = currentfloor; //current floor location of the car
    this.destinationfloor = destinationfloor; //destination of the car
    this.capacity = 8 //this is the default capacity of our elevator cars
    this.numpassengers = numpassengers; //number of current pasengers in the car
    this.lifetimetripcount = tripcount + 1; //total lifetime trips that the car has taken
    
    //choices are active, disabled, maintenance
    this.status = status;
}


//Define our floor class
function floor(floornumber){
    this.floornumber = floornumber
}

//Define our TripRequest class
function triprequest(numberpassengers,pickupfloor,dropfloor) {
    this.numberpassengers = numberpassengers; //number of passengers for this trip request
    this.pickupfloor = currentfloor; //floor passengers need to be picked up from
    this.dropfloor = destinationfloor; //floor passengers need to be drop off from
}

//Define our actual class
function trip(ID,numberpassengers,caroriginfloor,pickupfloor,dropfloor){
    this.id = id //id of car doing the trip
    this.numberpassengers = numberpassengers; //number of passengers for a given trip
    this.caroriginfloor = caroriginfloor; //floor trip started on for the elevator car
    this.pickupfloor = pickupfloor; //floor passengers will be picked up from
    this.dropfloor = dropfloor; //floor passengers will be dropped off on.
    this.grosstripdistance = Math.abs(caroriginfloor-pickupfloor) + Math.abs(dropfloor-pickupfloor); //total number of floors traveled by the car for this trip
    this.passengertripdistance = Math.abs(dropfloor-pickupfloor); //total floor distance traveled by passengers on this trip
}


//This is the home endpoint for the API.
app.get('/', function (req, res) {
    res.send('Welcome to Elevator API!');
});

//This is the single triprequest endpoint for the API.
app.get('/triprequest/:passengers/:pickup/:drop', function (req, res) {
    res.send('Fantastic! You have requested a trip on the Elevator.  Your request is for ' + req.params.passengers + ' persons. The requested trip is from the ' + req.params.pickup + ' to ' + req.params.drop + ' floors.');
});



//This starts the express app listening on a specified port
app.listen(3000, function () {
    console.log('Elevator API app listening on port 3000!');
});