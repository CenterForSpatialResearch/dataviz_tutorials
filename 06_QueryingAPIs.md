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

Next comes the tricky part. For every station we need to calculate the angles for the different variables and put them in sequence. Take a look at the final code for that part and I'll run over the important lines below:
```js
// ***** Draw stations function ***** //
function drawStations(){
  background(255);
  for (var i = 0; i < stationData.data.stations.length; i++) {
    var row = floor(i / 12);
    var column = i%12;
    var startAngle = 0;
    var endAngle = 0;
    var bikes = stationData.data.stations[i].num_bikes_available;
    var docks = stationData.data.stations[i].num_docks_available;
    var bikesDis = stationData.data.stations[i].num_bikes_disabled;
    var docksDis = stationData.data.stations[i].num_docks_disabled;
    var stationCapacity = bikes + docks + bikesDis + docksDis;
    var stationMaxAngle = map(stationCapacity, 0, maxCapacity, 0, 360);
    noStroke();
    // Broken bikes
    fill(255, 148, 0, 50);
    endAngle = map(bikesDis, 0, stationCapacity, 0, stationMaxAngle);
    if (startAngle != endAngle){
      arc(marginX + circleSpacingX * column, marginY + circleSpacingY * row, circleSize, circleSize, radians(startAngle -90), radians(endAngle -90));
    }
    // Available bikes
    fill(255, 148, 0, 200);
    startAngle = endAngle;
    endAngle = endAngle + map(bikes, 0, stationCapacity, 0, stationMaxAngle);
    if (startAngle != endAngle){
      arc(marginX + circleSpacingX * column, marginY + circleSpacingY * row, circleSize, circleSize, radians(startAngle -90), radians(endAngle -90));
    }
    // Available docks
    fill(0, 126, 178, 150);
    startAngle = endAngle;
    endAngle = endAngle + map(docks, 0, stationCapacity, 0, stationMaxAngle);
    if (startAngle != endAngle){
      arc(marginX + circleSpacingX * column, marginY + circleSpacingY * row, circleSize, circleSize, radians(startAngle -90), radians(endAngle -90));
    }
    // Broken docks
    fill(0, 126, 178, 20);
    startAngle = endAngle;
    endAngle = endAngle + map(docksDis, 0, stationCapacity, 0, stationMaxAngle);
    if (startAngle != endAngle){
      arc(marginX + circleSpacingX * column, marginY + circleSpacingY * row, circleSize, circleSize, radians(startAngle -90), radians(endAngle -90));
    }
    stroke(230);
    fill(255);
    ellipse(marginX + circleSpacingX * column, marginY + circleSpacingY * row, circleSize/2, circleSize/2);
    noFill();
    ellipse(marginX + circleSpacingX * column, marginY + circleSpacingY * row, circleSize, circleSize);
  }
}
```
* First, I get all the variables that I need for each station.
* Second, I calculate the maximum angle for each station based on the station with the maximum capacity. I use the `map` function for this and I return a number between `0` and `360` (I start working in degrees).
* Third, I calculate the start angle and end angle for the broken bikes variable. If both are equal (no broken bikes) then I skip this. If they are not equal, then I draw an `arc` and I use the start and end angles, but convert them to `radians` because that's the type of unit the `arc` function takes.
* I do the same for all the other variables, making sure to add the last end angle to the next start angle and so on.
* Finally, I draw two circles, an interior one to transform this into a donut chart and not a pie chart, and an exterior one for the outer stroke.

You should get something like this:
![02_ColorCircles.png](https://github.com/CenterForSpatialResearch/dataviz_tutorials/blob/master/00_Images/06_APIs/02_ColorCircles.png)

Of course this needs a legend that explains what each color means and the names of the stations, but for the purposes of this tutorial I'll leave the design there and continue with the last part.

## Updating the API data and drawing
Since Citibike data is constantly getting updated (every two minutes), it would be great to have the possibility of refreshing this sketch and redrawing the visualization. For this purposes we will include a refresh button and link it to the sketch. We will actually create the button first in the `index.html` file and then link it to the `sketch.js` file.

In the `index.html` add a button element and link the p5.dom.js library:
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Querying APIs</title>
    <meta charset="utf-8">
    <!-- Link to the p5.js library -->
    <script language="javascript" type="text/javascript" src="scripts/p5/p5.js"></script>
    <script language="javascript" type="text/javascript" src="scripts/p5/addons/p5.dom.js"></script>
    <!-- Link to sketch file -->
    <script language="javascript" type="text/javascript" src="scripts/sketch.js"></script>
  </head>
  <body>
    <button id="refresh">Refresh</button></p>
  </body>
</html>
```

Note the line `<button id="refresh">Refresh</button></p>` which will add a button to your page. Of course we can style the button much better and change its layout, but again, for the purposes of this tutorial I'll leave it like it is. Note also that the button has an `id` called `refresh`. We will use that `id` to link it to the sketch.

Also, note the line `<script language="javascript" type="text/javascript" src="scripts/p5/addons/p5.dom.js"></script>` which loads the `p5.dom.js` library. This library is not included in the main `p5.js` library but will allow us to interact with the different `html` elements in the page.

Now, linking the button is actually very simple, in your `sketch.js` file, create a *global* variable to hold the button (`var button`), and in the `setup` function add the following lines:
```js
button = select('#refresh');
button.mousePressed(queryAPI);
```

These two lines do the following:
* First, they link the variable `button` that we created above to the `html` element that has the `id` `refresh`.
* Second, every time the button is pressed with the mouse, it calls the `queryAPI` function, which, of course, queries the API and redraws the visualization.

Here's the full final code for the `sketch.js` file:
```js
// ***** Global variables ***** //
var baseURL = 'https://gbfs.citibikenyc.com/gbfs/en/station_status.json'
var stationData;
var maxCapacity;
var marginX = 50;
var marginY = 50;
var circleSpacingX = 90;
var circleSpacingY = 90;
var circleSize = 60;
var button;

// ***** Setup function ***** //
function setup(){
  createCanvas(1200, 6500);
  textSize(12);
  textFont('Roboto');
  console.log('Setup complete...');
  queryAPI();
  button = select('#refresh');
  button.mousePressed(queryAPI)
  noLoop();
}

// **** Query API Function *** //
function queryAPI(){
  loadJSON(baseURL, getStationData);
}

function getStationData(apiData){
  stationData = apiData;
  print(stationData);
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
  drawStations();
  print('Queried the API...');
}

// ***** Draw stations function ***** //
function drawStations(){
  background(255);
  for (var i = 0; i < stationData.data.stations.length; i++) {
    var row = floor(i / 12);
    var column = i%12;
    var startAngle = 0;
    var endAngle = 0;
    var bikes = stationData.data.stations[i].num_bikes_available;
    var docks = stationData.data.stations[i].num_docks_available;
    var bikesDis = stationData.data.stations[i].num_bikes_disabled;
    var docksDis = stationData.data.stations[i].num_docks_disabled;
    var stationCapacity = bikes + docks + bikesDis + docksDis;
    var stationMaxAngle = map(stationCapacity, 0, maxCapacity, 0, 360);
    noStroke();
    // Broken bikes
    fill(255, 148, 0, 50);
    endAngle = map(bikesDis, 0, stationCapacity, 0, stationMaxAngle);
    if (startAngle != endAngle){
      arc(marginX + circleSpacingX * column, marginY + circleSpacingY * row, circleSize, circleSize, radians(startAngle -90), radians(endAngle -90));
    }
    // Available bikes
    fill(255, 148, 0, 200);
    startAngle = endAngle;
    endAngle = endAngle + map(bikes, 0, stationCapacity, 0, stationMaxAngle);
    if (startAngle != endAngle){
      arc(marginX + circleSpacingX * column, marginY + circleSpacingY * row, circleSize, circleSize, radians(startAngle -90), radians(endAngle -90));
    }
    // Available docks
    fill(0, 126, 178, 150);
    startAngle = endAngle;
    endAngle = endAngle + map(docks, 0, stationCapacity, 0, stationMaxAngle);
    if (startAngle != endAngle){
      arc(marginX + circleSpacingX * column, marginY + circleSpacingY * row, circleSize, circleSize, radians(startAngle -90), radians(endAngle -90));
    }
    // Broken docks
    fill(0, 126, 178, 20);
    startAngle = endAngle;
    endAngle = endAngle + map(docksDis, 0, stationCapacity, 0, stationMaxAngle);
    if (startAngle != endAngle){
      arc(marginX + circleSpacingX * column, marginY + circleSpacingY * row, circleSize, circleSize, radians(startAngle -90), radians(endAngle -90));
    }
    stroke(230);
    fill(255);
    ellipse(marginX + circleSpacingX * column, marginY + circleSpacingY * row, circleSize/2, circleSize/2);
    noFill();
    ellipse(marginX + circleSpacingX * column, marginY + circleSpacingY * row, circleSize, circleSize);
  }
}
```

For another great tutorial on how to query APIs with p5.js, check out Dan Shiffman's [video tutorial](https://www.youtube.com/watch?v=rJaXOFfwGVw).
