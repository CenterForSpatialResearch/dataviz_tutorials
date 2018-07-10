# Querying APIs with p5.js
*This tutorial will show you how to query APIs with p5.js and how to draw with the data they return. In the process, it will introduce you to functions with callbacks and to JSON objects. This tutorial was written on July 2018.*

## What are APIs
An API, or Application Programming Interface, is a piece of software that lets machines communicate with each other. For the purposes of this tutorial we can say that APIs are gateways that let us post or get information from various services. For example, the Twitter API lets you post tweets (with authentication) or get tweets about a specific subject; weather APIs let you query the weather for different cities; and Google Maps APIs let you get routes from point A to point B.

Most good APIs have thorough documentation that lets you know what you can and cannot do ("methods"), and what the specific syntax and URLs are ("end points").

APIs are best for data that is constantly being updated. Visualizing an API lets you go beyond loading the same file all the time. You are instead querying a service that gives you the most updated data based on your request.

There are two more things to take into account when dealing with APIs:
 * Authentication: you might need to sign up for a developer account to be able to use the API and you might need to program your code so that it identifies itself and gets authenticated by the API.
 * Rate limits: most APIs are free but they have rate limits, there are only so many requests you can submit in any given timeframe. Be careful with these rate limits. You might need to program your code so that it pauses between requests.

Here are some very common APIs that people use and some of the things you can do through them (there are many many many more...):
* [Twitter](https://dev.twitter.com/rest/public):
    Search; Post; Get information (status, followers, etc)
* [Google Maps](https://developers.google.com/maps/):
    Get directions; Geocode addresses
* [Foursquare](https://developer.foursquare.com/docs/):
    Search for venues; Post
* [Instagram](https://www.instagram.com/developer/):
    Get user information; Get location information, including media
* [New York Times](http://developer.nytimes.com/):
    Search for articles; Get access to comments
* [OpenWeatherMap](http://openweathermap.org/API):
    Current weather; Historical weather
* [Zillow](https://www.zillow.com/howto/api/APIOverview.htm):
    Get estimates; Search for properties
* [Google Sheets](https://developers.google.com/sheets/api/):
    Use data on your Google Sheets; Post data to your Google Sheets

In this tutorial we will use the [Citibike Station Status API](http://gbfs.citibikenyc.com/gbfs/gbfs.json) to create an interactive data visualization piece that shows how many available bikes and docks are in each of the Citibike stations.

## Setup
We will begin with the same setup as before. However, since we are not loading any files we don't need the `data` folder. Here's my folder structure for this project:
* `TestingGround` (folder):
  * `index.html`
  * `scripts` (folder):
    * `sketch.js`
    * `p5` (folder):
      * Unzipped p5 library

The `index.html` file is:
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Querying APIs</title>
    <meta charset="utf-8">
    <!-- Link to the p5.js library -->
    <script language="javascript" type="text/javascript" src="scripts/p5/p5.js"></script>
    <!-- Link to sketch file -->
    <script language="javascript" type="text/javascript" src="scripts/sketch.js"></script>
  </head>
  <body>
  </body>
</html>
```

And the `sketch.js` file starts with just the setup function, as follows:
```js
// ***** Setup function ***** //
function setup(){
  createCanvas(800, 450);
  textSize(12);
  textFont('Roboto');
  console.log('Setup complete...');
}
```

## Querying the API
In p5.js APIs are queried using the `loadJSON` function. The simple form of this function takes a single argument, the API URL. However, because JavaScript is asynchronous and the API might take some time to respond, it always necessary to put the `loadJSON` function in the `preload` function, or to add a `callback`.

`Callbacks` are a way of telling a function to do something, then pause until that thing is done, and once it is done, do something else. In our case we will tell the `loadJSON` function to query the API and that **only** when it gets a response, do something else. This way we won't have any problems trying to draw with the API data without having received an appropriate response from the API. More information about the `loadJSON` function and `callbacks` can be found in the [p5.js documentation](https://p5js.org/reference/#/p5/loadJSON).

First, I will create a separate function that queries the API, with a `callback`, and I'll run this function from the `setup` because I want to query the API as soon as the page loads. Here's the code:
```js
// ***** Global variables ***** //
var baseURL = 'https://gbfs.citibikenyc.com/gbfs/en/station_status.json'
var stationData;

// ***** Setup function ***** //
function setup(){
  createCanvas(800, 450);
  textSize(12);
  textFont('Roboto');
  console.log('Setup complete...');
  queryAPI();
}

// **** Query API Function *** //
function queryAPI(){
  loadJSON(baseURL, getStationData);
}

function getStationData(apiData){
  stationData = apiData;
  print(stationData);
}
```

There I'm doing the following things:
* I create two *global* variables, one for the URL (`baseURL`) and one to hold the response from the API call (`stationData`).
* I'm creating the `queryAPI` function, which holds the `loadJSON` function:
  * The `loadJSON` function takes two arguments, the `baseURL`, and the `callback`, which points towards a separate function `getStationData`.
  * So, basically, once the API returns a response, the `loadJSON` function will call the `getStationData` function and pass on the response of the API as an argument.
* In the `getStationData` which takes one argument (`apiData`) coming from the `callback`, I pass the data to the `stationData` variable and `print` that variable to the console.

If you expand the printout in the console you will see the `JSON` object with the station data. `JSON` objects are a very common type of objects in JavaScript. Their name actually means 'JavaScript Object Notation'. And as we saw in the [Basic JavaScript syntax tutorial](https://github.com/CenterForSpatialResearch/dataviz_tutorials/blob/master/02_IntroToJavascript.md), objects can contain arrays, dictionaries, and functions.

In our case, the JSON object returned by the API contains data about the stations. We just need to parse it and extract the relevant information.

## Parsing the data
Parsing the data from a JSON object is just a matter of calling out the different properties, or arrays, in the object. For example, in the case of the Citibike station data, we can see from the printout in the console, that it is an object, which has another object inside called `data`.

If I print that object (`print(stationData.data)`) I'll get what's inside that object. In this case, I'll get an array called `stations` with all the stations. Give it a try.

To get the first station, we should then do `print(stationData.data.stations[0])`. Remember that `0` is the first position in an array. This should print the first station with all its properties.

Finally, to get one of those properties, say the number of available bikes, from the first station, we should do `print(stationData.data.stations[0].num_bikes_available)`.

So, putting it all together, I'll get the number of bikes and docks available, and the number of bikes and docks disabled, from every station, and I'll add them up to get the capacity. To do this for all the stations I'll put them in a loop. Here's the function:
```js
function getStationData(apiData){
  stationData = apiData;
  for (var i = 0; i < stationData.data.stations.length; i++) {
    var stationID = stationData.data.stations[i].station_id;
    var bikes = stationData.data.stations[i].num_bikes_available;
    var docks = stationData.data.stations[i].num_docks_available;
    var bikesDis = stationData.data.stations[i].num_bikes_disabled;
    var docksDis = stationData.data.stations[i].num_docks_disabled;
    var stationCapacity = bikes + docks + bikesDis + docksDis;
    print(stationID + ' -- ' + str(stationCapacity));
  }
}
```

This function gets the variables and adds them, and then prints the station id, with the capacity.

## Drawing with the API data
Once we have the data, drawing with it is pretty straight forward. First, I'm creating a *global* variable to hold the maximum capacity, and I'm calculating that variables in the `getStationData` function. Here's what I have so far:
```js
// ***** Global variables ***** //
var baseURL = 'https://gbfs.citibikenyc.com/gbfs/en/station_status.json'
var stationData;
var maxCapacity;

// ***** Setup function ***** //
function setup(){
  createCanvas(800, 450);
  textSize(12);
  textFont('Roboto');
  console.log('Setup complete...');
  queryAPI();
}

// **** Query API Function *** //
function queryAPI(){
  loadJSON(baseURL, getStationData);
}

function getStationData(apiData){
  stationData = apiData;
  maxCapacity = 0;
  for (var i = 0; i < stationData.data.stations.length; i++) {
    var stationID = stationData.data.stations[i].station_id;
    var bikes = stationData.data.stations[i].num_bikes_available;
    var docks = stationData.data.stations[i].num_docks_available;
    var bikesDis = stationData.data.stations[i].num_bikes_disabled;
    var docksDis = stationData.data.stations[i].num_docks_disabled;
    var stationCapacity = bikes + docks + bikesDis + docksDis;
    maxCapacity = max(maxCapacity, stationCapacity);
  }
  print(maxCapacity);
}
```

Next, for every station I'll draw a circle. I'll do this not in the `draw` function but in a separate one. The reason for this is that I want to be able to call this function at specific moments (when I reload the call to the API further later in the tutorial), and I don't need the sketch to update constantly.

Here's the function (I call it at the end of the `getStationData` function):
```js
// ***** Draw stations function ***** //
function drawStations(){
  background(255);
  for (var i = 0; i < stationData.data.stations.length; i++) {
    var row = floor(i / 12);
    var column = i%12;
    fill(0);
    ellipse(marginX + circleSpacingX * column, marginY + circleSpacingY * row, circleSize, circleSize);
  }
}
```

The two things I would underline about the function is the use of the `floor` function and `modulus` operation to create the grid of circles. You should be seeing something like this:
![01_CircleGrid.png](https://github.com/CenterForSpatialResearch/dataviz_tutorials/blob/master/00_Images/06_APIs/01_CircleGrid.png)



Link to Daniel Shiffman's youtube tutorial.


Capacity
Bikes available
Docks available
Bikes disabled
Docks disabled

Loop through them, get max size of station. That's the full circle.







---------

## Interactivity
Interactive elements, although not absolutely necessary, add richness and depth to your visualizations. In addition, they engage the audience, enticing them to spend more time exploring your graphs and charts. There is an ongoing debate on whether or not interactivity is essential and the extent of it. See, for example, ["The death of interactive infographics?"](https://medium.com/@dominikus/the-end-of-interactive-visualizations-52c585dcafcb) by Dominikus Baur and ["In Defense of Interactive Graphics"](https://www.vis4.net/blog/2017/03/in-defense-of-interactive-graphics/) by Gregor Aisch.

In this tutorial we will code two types of interactive behavior: hover and buttons. Through hovers you will reveal more detail about a specific point in the graph, and with the buttons you will highlight a specific subset of the data. We will do this through p5.js.

*Note that there are other ways of achieving this interactivity, most notably through native html elements linked to your p5.js code. However, because these sets of tutorials deal mainly with p5.js and are only introductory, we will stick to coding these behaviors within this JavaScript library.*

## Setup
This tutorial builds directly upon the [previous one](https://github.com/CenterForSpatialResearch/dataviz_tutorials/blob/master/04_WorkingWithData_p5js.md). If you haven't done that one, please complete it before starting this one. We will start right where the other one finishes.

The folder setup is as follows:
* `TestingGround` (folder):
  * `index.html`
  * `scripts` (folder):
    * `sketch.js`
    * `p5` (folder):
      * Unzipped p5 library
  * `data` (folder):
    * `20171011_SelectedCitibikeTrips_Rnd5000.csv`

The `index.html` file is:
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Intro to p5.js</title>
    <meta charset="utf-8">
    <!-- Link to the p5.js library -->
    <script language="javascript" type="text/javascript" src="scripts/p5/p5.js"></script>
    <!-- Link to sketch file -->
    <script language="javascript" type="text/javascript" src="scripts/sketch.js"></script>
  </head>
  <body>
  </body>
</html>
```

And the final `sketch.js` file is as follows:
```js
// ***** Global variables ***** //
var tripTable;
var maxYears = 0;
var minYears = 2000;
var yearRange;
var maxDuration = 0;
var minDuration = 5000;
var durationRange;
var marginX = 50;
var marginY = 40;

// ***** Preload function ***** //
function preload(){
  tripTable = loadTable('data/20171011_SelectedCitibikeTrips_Rnd5000.csv', 'csv', 'header');
  console.log('Done loading table...');
}

// ***** Setup function ***** //
function setup(){
  createCanvas(800, 450);
  textSize(12);
  textFont('Roboto');
  console.log('Setup complete...');
  print(tripTable.getRowCount() + ' rows loaded...');
  print(tripTable.getColumnCount() + ' columns loaded...');
  console.log(tripTable);
  getMaxValues();
  noLoop();
}

// ***** Get maximum values function ***** //
function getMaxValues(){
  for (var i = 0; i < tripTable.getRowCount(); i++) {
    maxYears = max(maxYears, float(tripTable.getString(i, 'birth year')));
    minYears = min(minYears, float(tripTable.getString(i, 'birth year')));
    maxDuration = max(maxDuration, float(tripTable.getString(i, 'tripduration')));
    minDuration = min(minDuration, float(tripTable.getString(i, 'tripduration')));
  }
  minDuration = 0;
  maxDuration = 4500;
  minYears = 1935;
  maxYears = 2005;
  yearRange = maxYears - minYears;
  durationRange = maxDuration - minDuration;
  print('Max year: ' + str(maxYears));
  print('Min year: ' + str(minYears));
  print('Max duration: ' + str(maxDuration));
  print('Min duration: ' + str(minDuration));
  print('Year range: ' + str(yearRange));
  print('Duration range: ' + str(durationRange));
}

function draw(){
  background(255);
  var graphHeight = height - marginY * 2;
  var graphWidth = width - marginX * 2;
  // Draw minor axis lines
  stroke(230);
  for (var i = 0; i < 9; i++) {
    line(marginX, marginY + i * (graphHeight / 9), marginX + graphWidth, marginY + i * (graphHeight / 9));
  }
  for (var i = 0; i < 7; i++) {
    line(marginX + (i + 1) * (graphWidth / 7), marginY, marginX + (i + 1) * (graphWidth / 7), marginY + graphHeight);
  }
  // Draw mayor axis lines
  stroke(0);
  line(marginX, height - marginY, width - marginX, height - marginY);
  line(marginX, marginY, marginX, height - marginY);
  // Draw labels
  noStroke();
  fill(0);
  for (var i = 0; i < 8; i++) {
    textAlign(CENTER, TOP);
    text(round(minYears + i * (yearRange / 7)), marginX + (graphWidth / 7) * i, marginY + graphHeight + 5);
  }
  for (var i = 0; i < 10; i++) {
    textAlign(RIGHT, CENTER);
    text(round(maxDuration - i * (durationRange / 9)), marginX - 5, marginY + (graphHeight / 9) * i);
  }
  // Plotting the dots
  fill(0);
  for (var i = 0; i < tripTable.getRowCount(); i++) {
    var thisYear = float(tripTable.getString(i, 'birth year'));
    var thisDuration = float(tripTable.getString(i, 'tripduration'));
    var thisX = map(thisYear, minYears, maxYears, marginX, marginX + graphWidth);
    var thisY = map(thisDuration, minDuration, maxDuration, marginY + graphHeight, marginY);
    ellipse(thisX, thisY, 3, 3);
  }
}
```

Make sure you have your localhost running and that this sketch is working. You should start with something looking like this:
![04_FinalGraph.png](https://github.com/CenterForSpatialResearch/dataviz_tutorials/blob/master/00_Images/04_Data/04_FinalGraph.png)

## Hover
We will first code the hover action. This means that when you hover over a point in the graph, a small popup window will appear and will give you more information about that particular point.

The first thing we need to do is to remove the `noLoop()` function from the `setup` function. The reason we introduced that function was because we didn't need the graph to redraw itself constantly, just once was enough. But now that we are going to be hovering over points and popup windows will appear and disappear, we need the graph to be constantly redrawn, and responsive. So go ahead and remove that line from the `setup`.

The next thing we need to do is to convert the table into objects. Just as in the [bouncing ellipses](https://github.com/CenterForSpatialResearch/dataviz_tutorials/blob/master/03_IntroToP5.md) tutorial, each of the lines in the trip table will be an object, with different behaviors. One of these behaviors will be to check for the mouse position, and if the mouse position is hovering over it, it will display a popup with its information.

To make all the lines into objects I do the following things:
* Move the `graphWidth` and `graphHeight` calculations out of the `draw` function. I need to have these done before I create the objects, so that the objects can use them in calculating their individual x and y positions:
  * I create two empty variables at the top (*global*) to hold them: `var graphHeight;` and `var graphWidth;`
  * In the `setup` function, I then calculate those variables: `graphHeight = height - marginY * 2;` and `graphWidth = width - marginX * 2;`
* Create an empty variable at the top (*global*) that will hold all the objects: `var tripObjects = [];`
* Declare and define the class of objects for the trips:
```js
function trip(duration, usertype, yearBirth, gender){
  // Properties
  this.duration = duration;
  this.usertype = usertype;
  this.yearBirth = yearBirth;
  this.gender = gender;
  this.ellipseSize = 3;
  this.positionX = map(this.yearBirth, minYears, maxYears, marginX, marginX + graphWidth);
  this.positionY = map(this.duration, minDuration, maxDuration, marginY + graphHeight, marginY);

  // Functions
  this.drawEllipse = function() {
    fill(0);
    ellipse(this.positionX, this.positionY, this.ellipseSize, this.ellipseSize);
  }
}
```

  * You can see here a couple of things:
    * One, the actual objects take four arguments (`duration`, `usertype`, `yearBirth`, and `gender`).
    * These arguments will be used to build the objects.
    * I calculate the `this.positionX` and `this.positionY` using the `yearBirth` and `duration`, and the `graphWidth` and `graphHeight`.
    * And finally, I have a function that actually draws the ellipses.
* I also add a part in the `setup` where I actually create the objects while looping through the table:
```js
for (var i = 0; i < tripTable.getRowCount(); i++) {
  var duration = float(tripTable.getString(i, 'tripduration'));
  var usertype = tripTable.getString(i, 'usertype');
  var birthYear = float(tripTable.getString(i, 'birth year'));
  var gender = tripTable.getString(i, 'gender');
  tripObjects.push(new trip(duration, usertype, birthYear, gender));
}
```

  * As you can see there, I'm getting individual variables and then feeding them into the objects as their arguments.
* And finally, I changed the `draw` function to draw the objects and not the rows from the table:
```js
for (var i = 0; i < tripObjects.length; i++) {
  tripObjects[i].drawEllipse();
}
```

Here's the full code so far:
```js
// ***** Global variables ***** //
var tripTable;
var maxYears = 0;
var minYears = 2000;
var yearRange;
var maxDuration = 0;
var minDuration = 5000;
var durationRange;
var marginX = 50;
var marginY = 40;
var graphHeight;
var graphWidth;
var tripObjects = [];

// ***** Preload function ***** //
function preload(){
  tripTable = loadTable('data/20171011_SelectedCitibikeTrips_Rnd5000.csv', 'csv', 'header');
  console.log('Done loading table...');
}

// ***** Setup function ***** //
function setup(){
  createCanvas(800, 450);
  textSize(12);
  textFont('Roboto');
  console.log('Setup complete...');
  print(tripTable.getRowCount() + ' rows loaded...');
  print(tripTable.getColumnCount() + ' columns loaded...');
  console.log(tripTable);
  getMaxValues();
  graphHeight = height - marginY * 2;
  graphWidth = width - marginX * 2;
  for (var i = 0; i < tripTable.getRowCount(); i++) {
    var duration = float(tripTable.getString(i, 'tripduration'));
    var usertype = tripTable.getString(i, 'usertype');
    var birthYear = float(tripTable.getString(i, 'birth year'));
    var gender = tripTable.getString(i, 'gender');
    if ((birthYear > maxYears) || (birthYear < minYears)){
      continue;
    }
    tripObjects.push(new trip(duration, usertype, birthYear, gender));
  }
}

// ***** Get maximum values function ***** //
function getMaxValues(){
  for (var i = 0; i < tripTable.getRowCount(); i++) {
    maxYears = max(maxYears, float(tripTable.getString(i, 'birth year')));
    minYears = min(minYears, float(tripTable.getString(i, 'birth year')));
    maxDuration = max(maxDuration, float(tripTable.getString(i, 'tripduration')));
    minDuration = min(minDuration, float(tripTable.getString(i, 'tripduration')));
  }
  minDuration = 0;
  maxDuration = 4500;
  minYears = 1935;
  maxYears = 2005;
  yearRange = maxYears - minYears;
  durationRange = maxDuration - minDuration;
  print('Max year: ' + str(maxYears));
  print('Min year: ' + str(minYears));
  print('Max duration: ' + str(maxDuration));
  print('Min duration: ' + str(minDuration));
  print('Year range: ' + str(yearRange));
  print('Duration range: ' + str(durationRange));
}

function trip(duration, usertype, yearBirth, gender){
  // Properties
  this.duration = duration;
  this.usertype = usertype;
  this.yearBirth = yearBirth;
  this.gender = gender;
  this.ellipseSize = 3;
  this.positionX = map(this.yearBirth, minYears, maxYears, marginX, marginX + graphWidth);
  this.positionY = map(this.duration, minDuration, maxDuration, marginY + graphHeight, marginY);

  // Functions
  this.drawEllipse = function() {
    fill(0);
    noStroke();
    ellipse(this.positionX, this.positionY, this.ellipseSize, this.ellipseSize);
  }
}

function draw(){
  background(255);

  // Draw minor axis lines
  stroke(230);
  for (var i = 0; i < 9; i++) {
    line(marginX, marginY + i * (graphHeight / 9), marginX + graphWidth, marginY + i * (graphHeight / 9));
  }
  for (var i = 0; i < 7; i++) {
    line(marginX + (i + 1) * (graphWidth / 7), marginY, marginX + (i + 1) * (graphWidth / 7), marginY + graphHeight);
  }
  // Draw mayor axis lines
  stroke(0);
  line(marginX, height - marginY, width - marginX, height - marginY);
  line(marginX, marginY, marginX, height - marginY);
  // Draw labels
  noStroke();
  fill(0);
  for (var i = 0; i < 8; i++) {
    textAlign(CENTER, TOP);
    text(round(minYears + i * (yearRange / 7)), marginX + (graphWidth / 7) * i, marginY + graphHeight + 5);
  }
  for (var i = 0; i < 10; i++) {
    textAlign(RIGHT, CENTER);
    text(round(maxDuration - i * (durationRange / 9)), marginX - 5, marginY + (graphHeight / 9) * i);
  }
  // Plotting the dots
  for (var i = 0; i < tripObjects.length; i++) {
    tripObjects[i].drawEllipse();
  }
}
```

This code does the same thing as before, but uses objects instead. The good thing is that objects will allows us to code other types of behaviors much easier.

Now that we have objects, we can create a second function in the object class that checks the mouse position and if this is less than a certain distance, displays a popup with the trip information. Here are the parts I added:
```js
this.checkMouse = function() {
  if (dist(this.positionX, this.positionY, mouseX, mouseY) < 1.5){
    fill(255);
    stroke(200);
    rect(this.positionX - 75, this.positionY - 90, 150, 85);
    noStroke();
    fill(0);
    textAlign(LEFT, TOP);
    text('Trip duration: ' + str(this.duration) + ' sec', this.positionX - 68, this.positionY - 81);
    text('User birth year: ' + str(this.yearBirth), this.positionX - 68, this.positionY - 63);
    text('Type of user: ' + this.usertype, this.positionX - 68, this.positionY - 44);
    var thisGender;
    if (this.gender == '0') {
      thisGender = 'Unknown';
    }
    else if (this.gender == '1') {
      thisGender = 'Male';
    }
    else {
      thisGender = 'Female';
    }
    text('Gender: ' + thisGender, this.positionX - 68, this.positionY - 26);
  }
}
```

This is the function that checks the mouse position. It uses the `dist()` function from p5.js, which takes two x and y coordinates and returns the distance between them. If that distance is less than `1.5` it draws a rectangle based on the position of the ellipse and on that rectangle writes the characteristics of the trip (distance, gender, year of birth and type of user).

And in the `draw` function I'm adding this call to that specific function:
```js
// Checking for mouse position to display popup
for (var i = 0; i < tripObjects.length; i++) {
  tripObjects[i].checkMouse();
}
```

This is a simple loop through the objects which calls the `checkMouse` function that we wrote.

Here's the full code so far:

```js
// ***** Global variables ***** //
var tripTable;
var maxYears = 0;
var minYears = 2000;
var yearRange;
var maxDuration = 0;
var minDuration = 5000;
var durationRange;
var marginX = 50;
var marginY = 40;
var graphHeight;
var graphWidth;
var tripObjects = [];

// ***** Preload function ***** //
function preload(){
  tripTable = loadTable('data/20171011_SelectedCitibikeTrips_Rnd5000.csv', 'csv', 'header');
  console.log('Done loading table...');
}

// ***** Setup function ***** //
function setup(){
  createCanvas(800, 450);
  textSize(12);
  textFont('Roboto');
  console.log('Setup complete...');
  print(tripTable.getRowCount() + ' rows loaded...');
  print(tripTable.getColumnCount() + ' columns loaded...');
  console.log(tripTable);
  getMaxValues();
  graphHeight = height - marginY * 2;
  graphWidth = width - marginX * 2;
  for (var i = 0; i < tripTable.getRowCount(); i++) {
    var duration = float(tripTable.getString(i, 'tripduration'));
    var usertype = tripTable.getString(i, 'usertype');
    var birthYear = float(tripTable.getString(i, 'birth year'));
    var gender = tripTable.getString(i, 'gender');
    if ((birthYear > maxYears) || (birthYear < minYears) || (duration > maxDuration) || (duration < minDuration)){
      continue;
    }
    tripObjects.push(new trip(duration, usertype, birthYear, gender));
  }
}

// ***** Get maximum values function ***** //
function getMaxValues(){
  for (var i = 0; i < tripTable.getRowCount(); i++) {
    maxYears = max(maxYears, float(tripTable.getString(i, 'birth year')));
    minYears = min(minYears, float(tripTable.getString(i, 'birth year')));
    maxDuration = max(maxDuration, float(tripTable.getString(i, 'tripduration')));
    minDuration = min(minDuration, float(tripTable.getString(i, 'tripduration')));
  }
  minDuration = 0;
  maxDuration = 4500;
  minYears = 1935;
  maxYears = 2005;
  yearRange = maxYears - minYears;
  durationRange = maxDuration - minDuration;
  print('Max year: ' + str(maxYears));
  print('Min year: ' + str(minYears));
  print('Max duration: ' + str(maxDuration));
  print('Min duration: ' + str(minDuration));
  print('Year range: ' + str(yearRange));
  print('Duration range: ' + str(durationRange));
}

function trip(duration, usertype, yearBirth, gender){
  // Properties
  this.duration = duration;
  this.usertype = usertype;
  this.yearBirth = yearBirth;
  this.gender = gender;
  this.ellipseSize = 3;
  this.positionX = map(this.yearBirth, minYears, maxYears, marginX, marginX + graphWidth);
  this.positionY = map(this.duration, minDuration, maxDuration, marginY + graphHeight, marginY);

  // Functions
  this.drawEllipse = function() {
    noStroke();
    fill(0);
    ellipse(this.positionX, this.positionY, this.ellipseSize, this.ellipseSize);
  }
  this.checkMouse = function() {
    if (dist(this.positionX, this.positionY, mouseX, mouseY) < 1.5){
      fill(255);
      stroke(200);
      rect(this.positionX - 75, this.positionY - 90, 150, 85);
      noStroke();
      fill(0);
      textAlign(LEFT, TOP);
      text('Trip duration: ' + str(this.duration) + ' sec', this.positionX - 68, this.positionY - 81);
      text('User birth year: ' + str(this.yearBirth), this.positionX - 68, this.positionY - 63);
      text('Type of user: ' + this.usertype, this.positionX - 68, this.positionY - 44);
      var thisGender;
      if (this.gender == '0') {
        thisGender = 'Unknown';
      }
      else if (this.gender == '1') {
        thisGender = 'Male';
      }
      else {
        thisGender = 'Female';
      }
      text('Gender: ' + thisGender, this.positionX - 68, this.positionY - 26);
    }
  }
}

function draw(){
  background(255);
  // Draw minor axis lines
  stroke(230);
  for (var i = 0; i < 9; i++) {
    line(marginX, marginY + i * (graphHeight / 9), marginX + graphWidth, marginY + i * (graphHeight / 9));
  }
  for (var i = 0; i < 7; i++) {
    line(marginX + (i + 1) * (graphWidth / 7), marginY, marginX + (i + 1) * (graphWidth / 7), marginY + graphHeight);
  }
  // Draw mayor axis lines
  stroke(0);
  line(marginX, height - marginY, width - marginX, height - marginY);
  line(marginX, marginY, marginX, height - marginY);
  // Draw labels
  noStroke();
  fill(0);
  for (var i = 0; i < 8; i++) {
    textAlign(CENTER, TOP);
    text(round(minYears + i * (yearRange / 7)), marginX + (graphWidth / 7) * i, marginY + graphHeight + 5);
  }
  for (var i = 0; i < 10; i++) {
    textAlign(RIGHT, CENTER);
    text(round(maxDuration - i * (durationRange / 9)), marginX - 5, marginY + (graphHeight / 9) * i);
  }
  // Plotting the dots
  for (var i = 0; i < tripObjects.length; i++) {
    tripObjects[i].drawEllipse();
  }
  // Checking for mouse position to display popup
  for (var i = 0; i < tripObjects.length; i++) {
    tripObjects[i].checkMouse();
  }
}
```

Your sketch should look something like this when you hover over a point:
![01_Hover.png](https://github.com/CenterForSpatialResearch/dataviz_tutorials/blob/master/00_Images/05_Interactivity/01_Hover.png)

## Buttons
Here we will create buttons to select and color-code a subset of the data. For example, we will color the dots by gender or by type of user, which will allow the audience to identify other patterns in the dataset. First, we will create the buttons and make sure they are responsive, and then we will link them to the actual scatter plot.

The buttons that we will create are simple rectangles. We will also add a function that will check whether the mouse is on top of them and/or clicking them. Again, you could do this with native html buttons but here we are sticking with p5.js.

Here's the basic function that draws the buttons:
```js
function drawButtons() {
  var buttonLabels = ['All trips', 'By gender', 'By user type'];
  var buttonLength = 100;
  var buttonSpacing = 5;
  for (var i = 0; i < buttonLabels.length; i++) {
    fill(230);
    noStroke();
    rect(440 + (buttonLength + buttonSpacing) * i, 20, buttonLength, 20);
    fill(100);
    textAlign(CENTER, CENTER);
    text(buttonLabels[i], 440 + buttonLength / 2 + (buttonLength + buttonSpacing) * i, 30)
  }
}
```

I moved the graph down a bit to make space for the buttons. I did this by changing the `marginY` at the top (*global*) from 40 to 55. Also, remember to add a line in the `draw` function to call this new function: `drawButtons();`

Now that we have the buttons, let's add a variable to control which one is selected, and color them accordingly:
* I added this *global* variable `var selectedButton = 0;` to hold the selected button number.
* And I modified the `drawButtons` function to color the selected button yellow. I added an `if` statement that checks the `selectedButton` variable against the `i` and changes the `fill` color.
```js
function drawButtons() {
  var buttonLabels = ['All trips', 'By gender', 'By user type'];
  var buttonLength = 100;
  var buttonSpacing = 5;
  for (var i = 0; i < buttonLabels.length; i++) {
    if (selectedButton == i) {
      fill(255, 233, 127);
    }
    else {
      fill(230);
    }
    noStroke();
    rect(440 + (buttonLength + buttonSpacing) * i, 20, buttonLength, 20);
    fill(100);
    textAlign(CENTER, CENTER);
    text(buttonLabels[i], 440 + buttonLength / 2 + (buttonLength + buttonSpacing) * i, 30)
  }
}
```

So far your graph should look something like this:
![02_BasicButtons.png](https://github.com/CenterForSpatialResearch/dataviz_tutorials/blob/master/00_Images/05_Interactivity/02_BasicButtons.png)

Now I'll code a section that responds to mouse clicks and modifies the selected button:
* First I'll move the `buttonLength` and `buttonSpacing` variables to the top and make them *global*. I'm doing this because I'll need access to them outside of the `drawButtons` function.
* Next, I'll use the `mousePressed` function to check whether or not the mouse is pressed. This function is pre-built into p5.js. Here's how I use it:
```js
function mousePressed(){
  if (mouseX > 440 && mouseY > 20 && mouseX < (440 + buttonLength) && mouseY < 40){
    selectedButton = 0;
  }
  if (mouseX > (440 + buttonLength + buttonSpacing) && mouseY > 20 && mouseX < (440 + buttonLength * 2 + buttonSpacing) && mouseY < 40){
    selectedButton = 1;
  }
  if (mouseX > (440 + buttonLength * 2 + buttonSpacing * 2) && mouseY > 20 && mouseX < (440 + buttonLength * 3 + buttonSpacing * 2) && mouseY < 40){
    selectedButton = 2;
  }
}
```

* Note how, once the mouse is pressed, I check for the position of the mouse, and if it's over the button I change the value of the `selectedButton` variable. This in turn changes the color of the button.

Finally, let's link that variable to the color of the dots. First, I'll do the code for the gender of the rider. The dataset contains 3 options for gender: `Unknown`, `Male`, or `Female`. When the `Gender` button is clicked I want to gray-out all the dots that have `Unknown` gender and color code the ones for `Male` and `Female`. So I'll code this behavior in the `trip` class function.

Here's the modified `trip` class function:
```js
function trip(duration, usertype, yearBirth, gender){
  // Properties
  this.duration = duration;
  this.usertype = usertype;
  this.yearBirth = yearBirth;
  this.gender = gender;
  this.ellipseSize = 3;
  this.positionX = map(this.yearBirth, minYears, maxYears, marginX, marginX + graphWidth);
  this.positionY = map(this.duration, minDuration, maxDuration, marginY + graphHeight, marginY);

  // Functions
  this.drawEllipse = function() {
    noStroke();
    if (selectedButton == 0){
      fill(0);
    }
    else if (selectedButton == 1) {
      if (this.gender == '0'){
        fill(200);
      }
      else if (this.gender == '1'){
        fill(255, 136, 0);
      }
      else if (this.gender == '2'){
        fill(0, 170, 255);
      }
    }
    ellipse(this.positionX, this.positionY, this.ellipseSize, this.ellipseSize);
  }
  this.checkMouse = function() {
    if (dist(this.positionX, this.positionY, mouseX, mouseY) < 1.5){
      fill(255);
      stroke(200);
      rect(this.positionX - 75, this.positionY - 90, 150, 85);
      noStroke();
      fill(0);
      textAlign(LEFT, TOP);
      text('Trip duration: ' + str(this.duration) + ' sec', this.positionX - 68, this.positionY - 81);
      text('User birth year: ' + str(this.yearBirth), this.positionX - 68, this.positionY - 63);
      text('Type of user: ' + this.usertype, this.positionX - 68, this.positionY - 44);
      var thisGender;
      if (this.gender == '0') {
        thisGender = 'Unknown';
      }
      else if (this.gender == '1') {
        thisGender = 'Male';
      }
      else {
        thisGender = 'Female';
      }
      text('Gender: ' + thisGender, this.positionX - 68, this.positionY - 26);
    }
  }
}
```

Note that in the `this.drawEllipse` function, I added a series of conditional (`if`) statements that respond to the `selectedButton` variable. With these conditionals I'm changing the `fill` color of the dots.

Now I'll just write a small functions that adds a legend once the gender button is selected and I'll call it in the `draw` function. Here's the function:
```js
function drawLegend(){
  if (selectedButton == 1){
    fill(0, 170, 255);
    ellipse(graphWidth - 10, marginY + 12, 4, 4);
    fill(255, 136, 0);
    ellipse(graphWidth - 10, marginY + 27, 4, 4);
    fill(100);
    textAlign(LEFT, CENTER);
    text('Female', graphWidth - 5, marginY + 12);
    text('Male', graphWidth - 5, marginY + 27);
  }
}
```

And I call it in the `draw` function like this: `drawLegend();`

Your graph should be looking like this:
![03_Legend.png](https://github.com/CenterForSpatialResearch/dataviz_tutorials/blob/master/00_Images/05_Interactivity/03_Legend.png)

After this I'll code something very similar for the user type button.

Here is the final code with all the interactivity:
```js
// ***** Global variables ***** //
var tripTable;
var maxYears = 0;
var minYears = 2000;
var yearRange;
var maxDuration = 0;
var minDuration = 5000;
var durationRange;
var marginX = 50;
var marginY = 55;
var graphHeight;
var graphWidth;
var tripObjects = [];
var selectedButton = 0;
var buttonLength = 100;
var buttonSpacing = 5;

// ***** Preload function ***** //
function preload(){
  tripTable = loadTable('data/20171011_SelectedCitibikeTrips_Rnd5000.csv', 'csv', 'header');
  console.log('Done loading table...');
}

// ***** Setup function ***** //
function setup(){
  createCanvas(800, 450);
  textSize(12);
  textFont('Roboto');
  console.log('Setup complete...');
  print(tripTable.getRowCount() + ' rows loaded...');
  print(tripTable.getColumnCount() + ' columns loaded...');
  console.log(tripTable);
  getMaxValues();
  graphHeight = height - marginY * 2;
  graphWidth = width - marginX * 2;
  for (var i = 0; i < tripTable.getRowCount(); i++) {
    var duration = float(tripTable.getString(i, 'tripduration'));
    var usertype = tripTable.getString(i, 'usertype');
    var birthYear = float(tripTable.getString(i, 'birth year'));
    var gender = tripTable.getString(i, 'gender');
    if ((birthYear > maxYears) || (birthYear < minYears) || (duration > maxDuration) || (duration < minDuration)){
      continue;
    }
    tripObjects.push(new trip(duration, usertype, birthYear, gender));
  }
}

// ***** Get maximum values function ***** //
function getMaxValues(){
  for (var i = 0; i < tripTable.getRowCount(); i++) {
    maxYears = max(maxYears, float(tripTable.getString(i, 'birth year')));
    minYears = min(minYears, float(tripTable.getString(i, 'birth year')));
    maxDuration = max(maxDuration, float(tripTable.getString(i, 'tripduration')));
    minDuration = min(minDuration, float(tripTable.getString(i, 'tripduration')));
  }
  minDuration = 0;
  maxDuration = 4500;
  minYears = 1935;
  maxYears = 2005;
  yearRange = maxYears - minYears;
  durationRange = maxDuration - minDuration;
  print('Max year: ' + str(maxYears));
  print('Min year: ' + str(minYears));
  print('Max duration: ' + str(maxDuration));
  print('Min duration: ' + str(minDuration));
  print('Year range: ' + str(yearRange));
  print('Duration range: ' + str(durationRange));
}

function trip(duration, usertype, yearBirth, gender){
  // Properties
  this.duration = duration;
  this.usertype = usertype;
  this.yearBirth = yearBirth;
  this.gender = gender;
  this.ellipseSize = 3;
  this.positionX = map(this.yearBirth, minYears, maxYears, marginX, marginX + graphWidth);
  this.positionY = map(this.duration, minDuration, maxDuration, marginY + graphHeight, marginY);

  // Functions
  this.drawEllipse = function() {
    noStroke();
    if (selectedButton == 0){
      fill(0);
    }
    else if (selectedButton == 1) {
      if (this.gender == '0'){
        fill(200);
      }
      else if (this.gender == '1'){
        fill(255, 136, 0);
      }
      else if (this.gender == '2'){
        fill(0, 170, 255);
      }
    }
    else if (selectedButton == 2){
      if (this.usertype == 'Subscriber'){
        fill(255, 136, 0);
      }
      else if (this.usertype == 'Customer'){
        fill(0, 170, 255);
      }
    }
    ellipse(this.positionX, this.positionY, this.ellipseSize, this.ellipseSize);
  }
  this.checkMouse = function() {
    if (dist(this.positionX, this.positionY, mouseX, mouseY) < 1.5){
      fill(255);
      stroke(200);
      rect(this.positionX - 75, this.positionY - 90, 150, 85);
      noStroke();
      fill(0);
      textAlign(LEFT, TOP);
      text('Trip duration: ' + str(this.duration) + ' sec', this.positionX - 68, this.positionY - 81);
      text('User birth year: ' + str(this.yearBirth), this.positionX - 68, this.positionY - 63);
      text('Type of user: ' + this.usertype, this.positionX - 68, this.positionY - 44);
      var thisGender;
      if (this.gender == '0') {
        thisGender = 'Unknown';
      }
      else if (this.gender == '1') {
        thisGender = 'Male';
      }
      else {
        thisGender = 'Female';
      }
      text('Gender: ' + thisGender, this.positionX - 68, this.positionY - 26);
    }
  }
}

function drawButtons() {
  var buttonLabels = ['All trips', 'By gender', 'By user type'];
  for (var i = 0; i < buttonLabels.length; i++) {
    if (selectedButton == i) {
      fill(255, 233, 127);
    }
    else {
      fill(230);
    }
    noStroke();
    rect(440 + (buttonLength + buttonSpacing) * i, 20, buttonLength, 20);
    fill(100);
    textAlign(CENTER, CENTER);
    text(buttonLabels[i], 440 + buttonLength / 2 + (buttonLength + buttonSpacing) * i, 30)
  }
}

function draw(){
  background(255);
  drawButtons();
  drawLegend();
  // Draw minor axis lines
  stroke(230);
  for (var i = 0; i < 9; i++) {
    line(marginX, marginY + i * (graphHeight / 9), marginX + graphWidth, marginY + i * (graphHeight / 9));
  }
  for (var i = 0; i < 7; i++) {
    line(marginX + (i + 1) * (graphWidth / 7), marginY, marginX + (i + 1) * (graphWidth / 7), marginY + graphHeight);
  }
  // Draw mayor axis lines
  stroke(0);
  line(marginX, height - marginY, width - marginX, height - marginY);
  line(marginX, marginY, marginX, height - marginY);
  // Draw labels
  noStroke();
  fill(0);
  for (var i = 0; i < 8; i++) {
    textAlign(CENTER, TOP);
    text(round(minYears + i * (yearRange / 7)), marginX + (graphWidth / 7) * i, marginY + graphHeight + 5);
  }
  for (var i = 0; i < 10; i++) {
    textAlign(RIGHT, CENTER);
    text(round(maxDuration - i * (durationRange / 9)), marginX - 5, marginY + (graphHeight / 9) * i);
  }
  // Plotting the dots
  for (var i = 0; i < tripObjects.length; i++) {
    tripObjects[i].drawEllipse();
  }
  // Checking for mouse position to display popup
  for (var i = 0; i < tripObjects.length; i++) {
    tripObjects[i].checkMouse();
  }
}

function mousePressed(){
  if (mouseX > 440 && mouseY > 20 && mouseX < (440 + buttonLength) && mouseY < 40){
    selectedButton = 0;
  }
  if (mouseX > (440 + buttonLength + buttonSpacing) && mouseY > 20 && mouseX < (440 + buttonLength * 2 + buttonSpacing) && mouseY < 40){
    selectedButton = 1;
  }
  if (mouseX > (440 + buttonLength * 2 + buttonSpacing * 2) && mouseY > 20 && mouseX < (440 + buttonLength * 3 + buttonSpacing * 2) && mouseY < 40){
    selectedButton = 2;
  }
}

function drawLegend(){
  if (selectedButton == 1){
    fill(0, 170, 255);
    ellipse(graphWidth - 15, marginY + 12, 4, 4);
    fill(255, 136, 0);
    ellipse(graphWidth - 15, marginY + 27, 4, 4);
    fill(100);
    textAlign(LEFT, CENTER);
    text('Female', graphWidth - 10, marginY + 12);
    text('Male', graphWidth - 10, marginY + 27);
  }
  if (selectedButton == 2){
    fill(0, 170, 255);
    ellipse(graphWidth - 15, marginY + 12, 4, 4);
    fill(255, 136, 0);
    ellipse(graphWidth - 15, marginY + 27, 4, 4);
    fill(100);
    textAlign(LEFT, CENTER);
    text('Customer', graphWidth - 10, marginY + 12);
    text('Subscriber', graphWidth - 10, marginY + 27);
  }
}
```
