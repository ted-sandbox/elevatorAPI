//ted-sandbox Elevator API
console.log('Welcome to the Elevator API');


//setup any includes from npm library
var express = require('express');

//setup the Express JS variable
var app = express();


//Setup some data structures and variables
var elevators = [];
var trips = [];
var triprequests = [];


//Define our elevator class
//This is our elevator controls main data object
function elevator(name, id, capacity, speed, currentfloor, pickupfloor, destinationfloor, numpassengers, status, tripcount){
    this.name = name; //name of the car
    this.id = id; //ID number of the car
    this.speed = speed; //'speed' of the car (in how many secs per floor)
    this.currentfloor = currentfloor; //current floor location of the car
    this.pickupfloor = pickupfloor;
    this.destinationfloor = destinationfloor; //destination of the car
    this.capacity = capacity; //this is the default capacity of our elevator cars
    this.numpassengers = numpassengers; //number of current pasengers in the car
    this.lifetimetripcount = tripcount + 1; //total lifetime trips that the car has taken
    
    //choices here are to be avaiable, intransit, disabled, maintenance
    this.status = status;
}


//Initialize the data to start the API (this can also be done via the Express endpoint /initialize after this is up and listening)

//Elevator primer data, details the elevator cars basic configurations
var elevatordata = 
[
    {'name':'Old Car Number 1','id':'1','capacity':'10','speed':'7'}
    ,{'name':'Car 2','id':'2','capacity':'8','speed':'4'}
    ,{'name':'Car 3','id':'1','capacity':'8','speed':'4'}
    ,{'name':'Express Car 4','id':'1','capacity':'12','speed':'2'}
];

elevatordata.forEach(element => {

    //initialize the new row about to be pushed on to the 'elevators' array object
    var someelevator = new elevator(element.name,element.id,element.capacity,element.speed,0,-1,-1,-1,'active',0)

    //push the new row onto the array
    elevators.push(someelevator);

}); //end of elevatordata foreach

//Initialize the building object in which the elevators are to operate.
var buildingdata = {
    'name':'Pittsburgh Tiny Skyscraper Co.',
    'groundfloor':'0',
    'floors':'31',
    'yearbuilt':'2018'
}

//end of Initialization at start of the app


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
function trip(ID,numberpassengers,caroriginfloor,pickupfloor,dropfloor,carspeed){
    this.id = id //id of car doing the trip
    this.numberpassengers = numberpassengers; //number of passengers for a given trip
    this.caroriginfloor = caroriginfloor; //floor trip started on for the elevator car
    this.pickupfloor = pickupfloor; //floor passengers will be picked up from
    this.dropfloor = dropfloor; //floor passengers will be dropped off on.
    this.grosstripdistance = Math.abs(caroriginfloor-pickupfloor) + Math.abs(dropfloor-pickupfloor); //total number of floors traveled by the car for this trip
    this.passengertripdistance = Math.abs(dropfloor-pickupfloor); //total floor distance traveled by passengers on this trip
    this.triptime = this.grosstripdistance * carspeed //determine how long this trip will take based on the secs per floor it takes (speed) for the given car
}


//This is the home endpoint for the API.
app.get('/', function (req, res) {
    res.send('Welcome to Elevator API!');
});

//This is the initialization endpoint for the API.
app.get('/initialize', function (req, res) {

    //blank out the elevator object since this is a re-initialization of the object
    elevators = [];

    elevatordata.forEach(element => {

        //initialize the new row about to be pushed on to the 'elevators' array object
        var someelevator = new elevator(element.name,element.id,element.capacity,element.speed,0,-1,-1,-1,'active',0)

        //push the new row onto the array
        elevators.push(someelevator);

    }); //end of elevatordata foreach

    //send the relevant data as output
    res.send(elevators);
});



//This is the status endpoint for the API.  The purpose here is to report statuses of relevant things
app.get('/status', function (req, res) {

    //TODO:  More statuses should be constructed together to be reported here

    res.send(elevators);
});



//This is the single triprequest endpoint for the API.
app.get('/triprequest/:passengers/:pickup/:drop', function (req, res) {


    //TODO:  Find available elevators from the 'elevators' data array

    //TODO:  Determine the closest elevator (randomly select one if there is a tie in which is closest.)

    //TODO:  Move the car and create trip object for the given situation

    //TODO:  Report out periodically on the status of the car to the console and/or front end

    res.send('Fantastic! You have requested a trip on the Elevator.  Your request is for ' + req.params.passengers + ' persons. The requested trip is from the ' + req.params.pickup + ' to ' + req.params.drop + ' floors.  Elevator being called now.');
});


//This is the bulk triprequest endpoint for the API.
app.get('/bulktriprequest/:bulktripdataJSON', function (req, res) {

    //TODO: build handler to simulate an incoming bulk set of trip requests
    //The purpose of this is to be able to enter in a simulated bulk set of data to see how the control works under some bulk load

    res.send('This is the future endpoint for making bulk trip requests.');
});



//This starts the express app listening on a specified port
app.listen(3000, function () {
    console.log('Elevator API app listening on port 3000!');
});