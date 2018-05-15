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
function elevator(name, id, capacity, speed, currentfloor, pickupfloor, destinationfloor, passengers, status, tripcount){
    this.name = name; //name of the car
    this.id = id; //ID number of the car
    this.speed = speed; //'speed' of the car (in how many secs per floor)
    this.currentfloor = currentfloor; //current floor location of the car
    this.pickupfloor = pickupfloor;
    this.destinationfloor = destinationfloor; //destination of the car
    this.capacity = capacity; //this is the default capacity of our elevator cars
    this.passengercount = passengers; //number of current pasengers in the car
    this.lifetimetripcount = tripcount;; //total lifetime trips that the car has taken
    
    //choices here are to be available, inprogress, disabled, maintenance
    this.status = status;
}


//Initialize the data to start the API (this can also be done via the Express endpoint /initialize after this is up and listening)

//Elevator primer data, details the elevator cars basic configurations
var elevatordata = 
[
    {'name':'Old Car Number 1','id':'1','capacity':'10','initializationfloor':'0','speed':'7','status':'available'}
    ,{'name':'Car 2','id':'2','capacity':'8','initializationfloor':'0','speed':'4','status':'available'}
    ,{'name':'Car 3','id':'3','capacity':'8','initializationfloor':'0','speed':'4','status':'available'}
    ,{'name':'Express Car 4','id':'4','capacity':'12','initializationfloor':'0','speed':'2','status':'available'}
];

elevatordata.forEach(element => {

    //initialize the new row about to be pushed on to the 'elevators' array object
    var someelevator = new elevator(element.name,element.id,element.capacity,element.speed,element.initializationfloor,-1,-1,0,element.status,0)

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
function triprequest(triprequestid, numberpassengers, pickupfloor, dropfloor,requeststate) {
    this.triprequestid = triprequestid; //id of this trip request
    this.numberpassengers = numberpassengers; //number of passengers for this trip request
    this.pickupfloor = currentfloor; //floor passengers need to be picked up from
    this.dropfloor = destinationfloor; //floor passengers need to be drop off from
    this.requeststate = requeststate; //the state of the request ('called','answered','cancelled')
}

//Define our Trip class
function trip(id, carid, numberpassengers, caroriginfloor, pickupfloor, dropfloor, carspeed, tripstate){
    this.id = id //id of trip
    this.carid = carid //id of car making the trip
    this.numberpassengers = numberpassengers; //number of passengers for a given trip
    this.caroriginfloor = caroriginfloor; //floor trip started on for the elevator car
    this.pickupfloor = pickupfloor; //floor passengers will be picked up from
    this.dropfloor = dropfloor; //floor passengers will be dropped off on.
    this.grosstripdistance = Math.abs(caroriginfloor-pickupfloor) + Math.abs(dropfloor-pickupfloor); //total number of floors traveled by the car for this trip
    this.passengertripdistance = Math.abs(dropfloor-pickupfloor); //total floor distance traveled by passengers on this trip
    this.triptime = this.grosstripdistance * carspeed //determine how long this trip will take based on the secs per floor it takes (speed) for the given car
    this.tripstate = this.tripstate //current state of the trip: 'intransit','completed', or 'error';
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
        var someelevator = new elevator(element.name,element.id,element.capacity,element.speed,element.initializationfloor,-1,-1,0,'available',0)

        //push the new row onto the array
        elevators.push(someelevator);

    }); //end of elevatordata foreach

    //send the relevant initialization data as output
    res.writeHead(200, { 'Content-Type': 'application/json','Content-Language':'en' }); 
    res.write(JSON.stringify({'elevators':elevators,'building':buildingdata}));
    res.end();
});



//This is the status endpoint for the API.  The purpose here is to report statuses of relevant things
app.get('/status', function (req, res) {

    //TODO:  More statuses should be constructed together to be reported here

    res.writeHead(200, { 'Content-Type': 'application/json','Content-Language':'en' }); 
    res.write(JSON.stringify({'elevators':elevators}));
    res.end();

});



//This is the single triprequest endpoint for the API.
app.get('/triprequest/:requestpassengers/:pickup/:drop', function (req, res) {

    //Our goal here is to try to find all available elevators that can fulfill the trip request.  We will select the best available elevator (closest and can meet request capacity)

    //initialize the available elevators to zilch
    var availableelevators = [];

    //intialize the selected elevator to -1 (which means not selected);
    var selectedelevatorid = -1;

    //set the initial "idealgap", used to help determine who is the closet elevator, this first number of '999' is just a placeholder until the first member of the loop overwrites it with a real distance.
    var idealgap = 999;

    var winner = -1;

    //TODO:  Find available elevators from the 'elevators' data array that can best meet the request's capacity and pickup floor location
    elevators.forEach(element => {
        
        //find out if the elevator is 'available' and can meet the request (i.e number of passengers based on it's current riders)
        if(element.status == 'available' && (element.capacity-element.passengercount)-req.params.requestpassengers >= 0){
            
            console.log(element.name);
           // console.log((Number(element.capacity)-Number(element.numberpassengers))-Number(req.params.requestpassengers));

            console.log(element.capacity);
            console.log(element.passengercount);
            console.log(req.params.requestpassengers);
            console.log((Number(element.capacity)-Number(element.passengercount))-Number(req.params.requestpassengers));

            //initialize the new row about to be pushed on to the 'elevators' array object
            var someelevator = new elevator(element.name,element.id,element.capacity,element.speed,element.currentfloor,element.pickupfloor,element.destinationfloor,element.passengers,element.status,element.tripcount)
           
            //push the available elevator onto the array
            availableelevators.push(someelevator);

             //Determine the idealgap distance that at least one elevator can meet the distance for an elevator that can meet the trip capacity
            if(Math.abs(element.currentfloor-req.params.pickup) < idealgap) {
                //Make this new lesser found distance the idealgap 
                idealgap = Math.abs(element.currentfloor - req.params.pickup);
            }

        }

    }); //end of elevators forEach

    //Console out the ideal gap
    console.log('The ideal gap is: ' + idealgap);


    if (availableelevators.length == 0) {
        
        //no elevators are currently available, trip request cannot be met at this time
        console.log('There are no elevators that can meet the incoming trip equest needs');

        winner = 0;

    } else if (availableelevators.length == 1) {

        //only one elevator is available, we will use this one
        console.log('There is one elevator that can meet the incoming trip request needs');
        console.log(availableelevators.length);

        winner = 0;

    } else if (availableelevators.length > 1) {

        console.log('There are multiple elevators that can meet the incoming trip request needs');
        console.log(availableelevators.length);


        //Loop through the available elevators and remove any of them that do not satisfy being one of the "closest" (this is determined by looking at the elevator's current location to the proposed pickup location)
        for(i=0;i<availableelevators.length;i++) {

            //if the elevator you are reviewing is further away than the "idealgap" 
            if( Math.abs(availableelevators[i].currentfloor - req.params.pickup) > idealgap) {

                //delete it from the available elevators array (this will leave an undefined "hole" in the array, but that's better than altering the overall length of the array since this action is occurring in a loop)
                delete(availableelevators[i]);
            }

        }; // end of for loop through the available elevators array to remove elements

        console.log('The count of the refined of closest available elevators is: ' + availableelevators.length);

        //TODO:  Now, if there are more than one availble elevators left that are "closest", then now randomly elect a "winner" to satisfy the trip request
        winner = Math.floor(Math.random() * Math.floor(availableelevators.length));

        console.log('The elected winner is: ' + winner);

        //Update the available elevators object to only have the winner
        for(i=0;i<availableelevators.length; i++) {

            if(i != winner){
                //delete the non winners (i.e. everyone not matching the winning index)
                delete(availableelevators[i]);
            }

        } //end of for loop to delete all non-winners

       //By now the availalbeelevators object of the winning index has only one row with useful data in it.
       //this row is the row that will be reported out on and also used for making the trip request.

    } // end of else if


    //TODO:  Create trip object and "move the car (via a trip time loop function to simulate the motion of the car from it's current location to the pickupu floor and finally the destination floor)" for the given situation (i.e. push the trip onto the trips array, set the current elevator to intransit for a given length of time)
    


    //TODO:  Report out periodically on the status of the car to the console and/or front end

    //res.send('Fantastic! You have requested a trip on the Elevator.  Your request is for ' + req.params.passengers + ' persons. The requested trip is from the ' + req.params.pickup + ' to ' + req.params.drop + ' floors.  Elevator being called now.');

    res.writeHead(200, { 'Content-Type': 'application/json','Content-Language':'en' }); 
    res.write(JSON.stringify({'requestpassengers':req.params.requestpassengers,'pickup':req.params.pickup,'drop':req.params.drop,'availableelevators':availableelevators[winner]}));
    res.end();


});


//This is the bulk triprequest endpoint for the API.
app.get('/bulktriprequest/:bulktripdataJSON', function (req, res) {

    //TODO: build handler to simulate an incoming bulk set of trip requests
    //The purpose of this is to be able to enter in a simulated bulk set of data to see how the control works under some bulk load

    res.send('This is the future endpoint for making bulk trip requests.');
});


//This is the endpoint to get the historical trip data for the Elevator Control
app.get('/trips', function (req, res) {
    //Report out on all the trips ever made (either historical or currently active)
    res.writeHead(200, { 'Content-Type': 'application/json','Content-Language':'en' }); 
    res.write(JSON.stringify({'trips':trips}));
    res.end();
});


//This is the endpoint to get the historical trip data for the Elevator Control
app.get('/triprequests', function (req, res) {
    //Report out on the all the trip requests ever made (either historical or currenlty active)
    res.writeHead(200, { 'Content-Type': 'application/json','Content-Language':'en' }); 
    res.write(JSON.stringify({'triprequests':triprequests}));
    res.end();
});


//This is the endpoint to get the historical trip data for the Elevator Control
app.get('/currentactivity', function (req, res) {
   
    //TODO: report out on the inprogress trips (the ones that are 'inprogress') and triprequests (the ones that are 'called') to the Elevator Control
    
    //reset the active trips array to zilch
    var activetrips = [];

    //loop over the trips and see which ones are 'inprogress'.  We'll be reporting these matches out.
    trips.forEach(element => {

        if(element.tripstate == 'inprogress') {
            
            //if the trip is 'inprogress', then push it onto the activetrips array for reporting out
            activetrips.push(element);
        }

    }); //end of forEach for trips


    //reset the active requests array to zilch
    var activerequests = [];

    //loop over the triprequests and see which ones are 'called'.  We'll be reporting out on these matches too.
    triprequests.forEach(element =>{

        if(element.requeststate == 'called') {

            //if the request is being 'called', then push it onto the activerequests array for reporting out
            activerequests.push(element);
        }

    }); //end of forEach for triprequests


    //Now, report out the reults of the above filtering
    res.writeHead(200, { 'Content-Type': 'application/json','Content-Language':'en' }); 
    res.write(JSON.stringify({'activetrips':activetrips,'activerequests':activerequests}));
    res.end();

});



//This starts the express app listening on a specified port
app.listen(3000, function () {
    console.log('Elevator API app listening on port 3000!');
});