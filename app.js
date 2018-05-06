//ted-sandbox Elevator API
console.log('Welcome to the Elevator API');


//setup any includes from npm library
var express = require('express');


//setup the Express JS variable
var app = express();


//Setup some data structures and variables

//Define our elevator class
function elevator (name, number, currentfloor, destinationfloor, numpassengers, tripcount, carstatus){

    this.name = car; //name of the car
    this.number = //ID number of the car
    this.currentfloor = currentfloor; //current floor location of the car
    this.destinationfloor = destinationfloor; //destination of the car
    this.capacity = 8 //this is the default capacity of our elevator cars
    this.numpassengers = numpassengers; //number of current pasengers in the car
    this.lifetimetripcount = tripcount + 1; //total lifetime trips that the car has taken
    
    //choices are active, disabled, maintenance
    this.status

}

//Define our floor class
function floor(floornumber){
    this.floornumber = floornumber
}


//This is the home endpoint for the API.
app.get('/', function (req, res) {
    res.send('Welcome to Elevator API!');
});


//This starts the express app listening on a specified port
app.listen(3000, function () {
    console.log('Elevator API app listening on port 3000!');
});