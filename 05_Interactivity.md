# Adding interactive elements to a p5.js sketch
*This tutorial will introduce you to different interactive elements in p5.js. It will show you how to code hover actions and buttons, adding depth and richness to your graphs, and making them more engaging. This tutorial was written on July 2018.*

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




----------

Of course if your aim is to create interactive data visualizations with p5.js you'll need to learn how to load, work, and visualize existing datasets. This tutorial uses a sample dataset from Citibike to show you how to do this and create a basic scatter plot graph. We will begin by loading the dataset and printing it to the console. Next, we will create a simple scatter plot. And finally, we will create subsets of the data and create other graphs.

## Data
The data for this tutorial was originally downloaded from the [Citibike system data page](https://www.citibikenyc.com/system-data), and was filtered using Jupyter Notebooks (Python and Pandas). The original downloaded file (Citibike trips for October 2017) contained 1,897,592 records. From here we selected only the trips started on October 10, 2017 (63,589 records) and we kept only the ones where the rider had a year of birth (59,184 records). Finally, a random sample of 5,000 rows was generated.

To follow this tutorial, please download the [dataset](https://raw.githubusercontent.com/CenterForSpatialResearch/dataviz_tutorials/master/00_Data/20171011_SelectedCitibikeTrips_Rnd5000.csv) (right-click and save as `20171011_SelectedCitibikeTrips_Rnd5000.csv`).

## Basic setup
Again, before starting to code our sketch you need to have [downloaded](https://p5js.org/download/) the p5.js library. In addition, you need to have your webpage's folder setup. Mine is setup like this:
* `TestingGround` (folder):
  * `index.html`
  * `scripts` (folder):
    * `sketch.js`
    * `p5` (folder):
      * Unzipped p5 library
  * `data` (folder):
    * `20171011_SelectedCitibikeTrips_Rnd5000.csv`

*Note that I have put the p5.js library in the `scripts/p5` folders and the downloaded dataset in the `data` folder.*

In the `index.html` you should add the following code:
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Data and p5.js</title>
    <meta charset="utf-8">
    <!-- Google fonts code -->
    <link href="https://fonts.googleapis.com/css?family=Roboto+Condensed:300,400,700" rel="stylesheet">
    <!-- Link to the p5.js library -->
    <script language="javascript" type="text/javascript" src="scripts/p5/p5.js"></script>
    <!-- Link to sketch file -->
    <script language="javascript" type="text/javascript" src="scripts/sketch.js"></script>
  </head>
  <body>
  </body>
</html>
```

The only difference with the other `index.html` files that we used in the previous tutorials is that here I'm loading the `Roboto` Google Font. This happens in the line `<link href="https://fonts.googleapis.com/css?family=Roboto+Condensed:300,400,700" rel="stylesheet">` inside the `head` section of the `html` file.

Once you've setup your folder this way, go ahead and run a localhost and navigate to the appropriate URL on your browser. If you need more information on how to run a localhost you can check out our [previous tutorial](https://github.com/CenterForSpatialResearch/dataviz_tutorials/blob/master/01_SetupLocalHostBasicWeb.md).

## Loading data in p5.js
It is actually quite easy to load data into a p5.js sketch. You do this through the `loadTable` function, which takes three arguments:
* The location/name of the file
* The type of file (`csv` or `tsv`)
* And whether or not the file has headers.

However, because JavaScript is **asynchronous** - meaning that one line of code can be run even if the previous one hasn't finished - the `loadTable` function should be located inside the `preload` function or should contain a `callback` (we will talk more about `callbacks` in the tutorial about APIs, so I won't go into it here). The `preload` function, like the `setup` and `draw` functions, has special properties. In p5.js, the `preload` function always runs first, before the `setup` function, thus making sure files are loaded before any other functions are called. More information about the `preload` function can be found [here](https://p5js.org/reference/#/p5/preload).

Hence, to load the data, write the following in your `sketch.js` file:
```js
// ***** Global variables ***** //
var tripTable;

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
}
```

Note that I'm doing a couple of things:
* First, I'm declaring an empty *global* variable `var tripTable;` that will hold the table once it is loaded.
* Next, there's the `preload` function, where I load the table into the `tripTable` variable.
* Then, in the `setup` function, I'm setting the font to be `Roboto`, the font that was loaded in the `index.html` (this is unrelated to the loading of the data, but I just wanted to show you how to load a custom font.)
* Finally, in the `setup` too I'm printing to the `console` the number of rows and columns of the table, just to make sure everything loaded correctly:
  * Note that I'm using the `print` function and not the `console.log` one. Both of them work fine.
  * Also note that I'm suing the `getRowCount()` and `getColumnCount()` functions to get the number of rows and the number of columns of the table. These two functions will be very useful once we start looping through the rows and columns of the table.
* Your `console` should print `5000 rows loaded...` and `16 columns loaded...`

Finally, to see what's inside your table and its actual structure add this line to the end of your `setup` function: `console.log(tripTable);`. And reload your page. You should be able to see the table printed in the `console`. It will be an object, and you will be able to expand its different components and see the headers and individual rows. It's always good practice to print these things to the `console` when you are first loading data, just to make sure that everything is loading fine and your data is there.

## Understanding the data
First, before we can actually draw with the data, we need to understand the range of values. To do this I built a separate function that loops through the dataset and gets the maximum values for `birth year` and `tripduration`, the two columns that I will use in the scatter plot. Here's my whole code so far:
```js
// ***** Global variables ***** //
var tripTable;
var maxYears = 0;
var minYears = 2000;
var yearRange;
var maxDuration = 0;
var minDuration = 5000;
var durationRange;

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
  // noLoop(); // ** New
}

// ***** Get maximum values function ***** //
function getMaxValues(){
  for (var i = 0; i < tripTable.getRowCount(); i++) {
    maxYears = max(maxYears, float(tripTable.getString(i, 'birth year')));
    minYears = min(minYears, float(tripTable.getString(i, 'birth year')));
    maxDuration = max(maxDuration, float(tripTable.getString(i, 'tripduration')));
    minDuration = min(minDuration, float(tripTable.getString(i, 'tripduration')));
  }
  yearRange = maxYears - minYears;
  durationRange = maxDuration - minDuration;
  print('Max year: ' + str(maxYears));
  print('Min year: ' + str(minYears));
  print('Max duration: ' + str(maxDuration));
  print('Min duration: ' + str(minDuration));
  print('Year range: ' + str(yearRange));
  print('Duration range: ' + str(durationRange));
}
```

I'm doing the following things here:
* Declaring six *global* variables at the beginning to hold the maximum and minimum values, and the range between them. I'm setting the maximum to `0` and the minimum to some arbitrary large numbers.
* Defining the function to get the maximum and minimum values:
  * This function loops through the values of the table and gets the maximum value between the variable I declared above and the selected value for each row.
  * Note in those lines how I have to get the values with the `getString()` function. This function gets the values based on two arguments, the row number (`i`) and the column header (`birth year` or `tripduration`).
  * The values are originally encoded as strings, but then I have to convert them to numbers with decimals with the `float()` function, in order to compare them with the maximum or minimum value with the `max` or `min` functions.
  * Once I loop through the whole dataset I print values to make sure everything is fine.

You should get on your console `2001` and `1893` as the maximum and minimum years of birth and `21186` and `64` as the maximum and minimum trip duration. These trip duration numbers are coded in seconds, which means that the maximum duration is somewhere around 5 hours and 48 minutes, way over the Citibike limit, but those trips do exist. The minimum year might be an error but we'll deal with that later.

## Setting up the graph
The next step will be to start drawing the axis and the labels of the graph. To do this, we need to figure out the margins and draw the necessary axis lines and labels. Here is the whole code. I'll go over what I did below.
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
  noLoop(); // ** New
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
    line(marginX + (i + 1) * (graphWidth / 9), marginY, marginX + (i + 1) * (graphWidth / 9), marginY + graphHeight);
  }
  // Draw mayor axis lines
  stroke(0);
  line(marginX, height - marginY, width - marginX, height - marginY);
  line(marginX, marginY, marginX, height - marginY);
  // Draw labels
  noStroke();
  for (var i = 0; i < 10; i++) {
    textAlign(CENTER, TOP);
    text(round(minYears + i * (yearRange / 9)), marginX + (graphWidth / 9) * i, marginY + graphHeight + 5);
    textAlign(RIGHT, CENTER);
    text(round(maxDuration - i * (durationRange / 9)), marginX - 5, marginY + (graphHeight / 9) * i);
  }
}
```
* First, I created two more *global* variables to hold the margins (`marginX` and `marginY`). These are very useful when calculating where everything should be drawn.
* Next, in the `setup` function I added the line `noLoop()`. This makes sure that the draw function will only be drawn once and not 60 frames per second. Since this is going to be a static graph (for now), I don't need everything to be drawn multiple times, just once is enough.
* Next, in the function where I calculate the maximum and minimum variables, I overwrite the `minDuration` value and set it to `0`. I do this because I want the Y axis to start at `0` and not at `64`.
* Next, in the `draw` function I do the following:
  * Based on the margins, I calculate the width and height of the actual graph, not canvas. This will also help me figure out where everything goes on the canvas.
  * Next, I draw the minor axis lines:
    * `stroke()` refers to the color (in grayscale) of the lines. Remember, 255 is white and 0 is black.
    * I draw the lines using the margins and the graph height and width that I calculated before.
  * Similarly I draw the mayor axis lines.
  * Finally, I draw the labels:
    * `textAlign` aligns the text in the horizontal (`LEFT`, `CENTER`, or `RIGHT`) and in the vertical (`TOP`, `CENTER`, or `BOTTOM`) directions. These arguments need to be capitalized.
    * Here I use the margins, the graph height and width, and the minimum, maximum, and ranges I calculated before. It's a little hard to understand at first view but if you deconstruct it carefully you'll make sense of it.

You should see something like this:
![01_LabelsAxis.png](https://github.com/CenterForSpatialResearch/dataviz_tutorials/blob/master/00_Images/04_Data/01_LabelsAxis.png)

## Plotting the dots
Now let's do a first pass at plotting the dots. This is actually pretty simple. I just added this piece of code at the end of the `draw` function:
```js
// Plotting the dots
fill(0);
for (var i = 0; i < tripTable.getRowCount(); i++) {
  var thisYear = float(tripTable.getString(i, 'birth year'));
  var thisDuration = float(tripTable.getString(i, 'tripduration'));
  var thisX = map(thisYear, minYears, maxYears, marginX, marginX + graphWidth);
  var thisY = map(thisDuration, minDuration, maxDuration, marginY + graphHeight, marginY);
  ellipse(thisX, thisY, 3, 3);
}
```

This is what's happening here:
* The `fill()` function sets the color of the dots.
* Then I loop through the table and get the year of birth and the duration into `float` variables.
* This step is crucial: I then use the `map()` function to convert the values into positions (x and y).
  * The `map` function takes a value that exists in one range, and then translates it into a different range.
  * For example, it takes the value for the year of birth and based on the minimum and maximum birth years, translates that value into another an x position based on the coordinates for the graph.
  * The `map` takes 5 arguments: the value to convert, the minimum value for that value, the maximum value for that value, and the minimum and maximum values for the new value.
* With these new x and y values, I simply draw the ellipses.

You should get something like this:
![02_Ellipses.png](https://github.com/CenterForSpatialResearch/dataviz_tutorials/blob/master/00_Images/04_Data/02_Ellipses.png)

With this graph I can see that most of the riders in this dataset were born after 1930 and that most of the trips lasted less than 75 minutes (4,500 seconds). I'll take those new values and overwrite the maximum and minimum values for the years and duration to make a tighter graph, getting rid of the outliers.

Now the graph should look like this:
![03_AdjustedValues.png](https://github.com/CenterForSpatialResearch/dataviz_tutorials/blob/master/00_Images/04_Data/03_AdjustedValues.png)

This graph tells us that most Citibike users were born between 1950 and 2000, and that most rides take between 0 and 1,500 seconds (25 minutes). This makes sense. And there isn't a huge difference in ride duration between older and younger people. More research is needed, of course, but this is a good start.

Finally, I just adjusted the values and the number of labels and minor axis to make everything cleaner and more legible. Here's the final code:
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
  noLoop(); // ** New
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

And here's the final graph:
![04_FinalGraph.png](https://github.com/CenterForSpatialResearch/dataviz_tutorials/blob/master/00_Images/04_Data/04_FinalGraph.png)
