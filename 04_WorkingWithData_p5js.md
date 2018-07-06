# Working with Data in p5.js
*This tutorial will guide you through how to load data in the form of a .cvs file into a p5.js sketch and how to create a simple scatter plot graph with it. This tutorial was written on July 2018.*

## Working with data in p5.js
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
  for (var i = 0; i < 10; i++) {
    line(marginX, marginY + i * (graphHeight / 10), marginX + graphWidth, marginY + i * (graphHeight / 10));
    line(marginX + (i + 1) * (graphWidth / 10), marginY, marginX + (i + 1) * (graphWidth / 10), marginY + graphHeight);
  }
  // Draw mayor axis lines
  stroke(0);
  line(marginX, height - marginY, width - marginX, height - marginY);
  line(marginX, marginY, marginX, height - marginY);
  // Draw labels
  noStroke();
  for (var i = 0; i < 11; i++) {
    textAlign(CENTER, TOP);
    text(round(minYears + i * (yearRange / 10)), marginX + (graphWidth / 10) * i, marginY + graphHeight + 5);
    textAlign(RIGHT, CENTER);
    text(round(maxDuration - i * (durationRange / 10)), marginX - 5, marginY + (graphHeight / 10) * i);
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
Now let's do a first pass at plotting the dots.
















-------------

In the `index.html` you should add the following code:
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

Note the link to the `p5.js` library and to the `sketch.js` file.

Once you've setup your folder this way, go ahead and run a localhost and navigate to the appropriate URL on your browser. If you need more information on how to run a localhost you can check out our [previous tutorial](https://github.com/CenterForSpatialResearch/dataviz_tutorials/blob/master/01_SetupLocalHostBasicWeb.md).

## p5.js sketch
In this tutorial all the coding will take place in the `sketch.js` file. You could also write it directly in the `index.html` file, but since we will soon be working with longer, more elaborate code, it is better to keep those two separate.

In your `sketch.js` file, let's start by creating a `canvas`. A `canvas`, as it names implies, is equivalent to a piece of fabric, or paper, where we will draw our design. The `canvas` is going to be the main receptacle of our code. You create a `canvas` in the `setup` function, which is one of the main functions in p5.js. In your `sketch.js` file type:
```js
function setup() {
  createCanvas(800, 450);
  background(0);
}
```
Here we are doing the following things:
* We are creating the `setup` function, which will be run once as soon as you load the page
* And in that function, we are creating the `canvas` with a size of `800` by `450` pixels
* And we are filling it with a black `background`.

As we saw in the [last tutorial](https://github.com/CenterForSpatialResearch/dataviz_tutorials/blob/master/02_IntroToJavascript.md) each one of these (`setup`, `createCanvas`, and `background`) are functions. We are creating the `setup` but the other two have been already defined in the library and we are just supplying the arguments: in the case of the `createCanvas`, the width and the height, and in the case of the `background`, the color.

By default, p5.js expects colors in `r,g,b` mode (red, green and blue), with values from 0 to 255, and if you supply only one value, it treats it as a grayscale, where 0 is black and 255 is white. You can use the `colorMode()` function to change the way colors are inputed, but for this tutorial the default works. To learn more about colors in p5.js check out this [documentation](https://p5js.org/learn/color.html).

Now that we have a `canvas`, let's draw the first circle. We could do this directly in the `setup` function, but since we ultimately want the circles to move and update, we will use the `draw` function. As in the case of the `setup` function, the `draw` function also has some special behavior in p5.js: this function will be run continuously at 60 frames per second (or close to that, depending on the complexity of the sketch and your computer's speed). In your `sketch.js` file, write the following below the `setup` function:
```js
function draw() {
  background(0);
  fill(255);
  ellipse(400, 225, 20, 20);
}
```
Again, here we are using some pre-built functions like `background`, `fill`, and `ellipse`. The `fill` tells the browser that whatever is drawn afterwards should be filled with `255` (white), and the `ellipse` actually draws the circle. This last function takes four arguments in the following order: `x location`, `y location`, `width`, and `height`. All of those are measured in pixels, and the `x` and `y` locations are measured from the top left corner of the sketch, the `x` towards the right and the `y` towards the bottom.

Finally, the reason why we are drawing the `background` again is because we want to 'clear' the sketch every time the draw function runs. We do this by putting a new full black background, erasing everything, and starting again. Otherwise we would draw ellipses on top of each other (60 times per second). In this instance this doesn't matter that much, but later on, when you want to make things 'move' you will need to 'erase' everything and draw again, otherwise you will leave a 'trail'. If this doesn't make sense now, that's fine, you will understand in a few moments.

On your screen you should have something like this:
![01_OneEllipse.png](https://github.com/CenterForSpatialResearch/dataviz_tutorials/blob/master/00_Images/03_IntroToP5/01_OneEllipse.png)

Now, let's say we want the ellipse to follow the position of the mouse, we can do it using the `mouseX` and `mouseY` system variables. These two variables come pre-built into p5.js and they supply the code the x and y coordinates of the mouse. To use them, change your `draw` function into the following:
```js
function draw() {
  background(0);
  fill(255);
  ellipse(mouseX, mouseY, 20, 20);
}
```
The only thing we did was to change the x and y position of the ellipse, and replace it with the `mouseX` and `mouseY` variables. That way the ellipse will always be where your mouse is.

Now to clearly view what the `background()` function is doing in the `draw` function, go ahead and remove it from there. Now it should read like this:
```js
function draw() {
  fill(255);
  ellipse(mouseX, mouseY, 20, 20);
}
```

Remember to reload your webpage to see the changes.

You should have gotten something like this without the `background` function in the `draw` function:
![02_Trails.png](https://github.com/CenterForSpatialResearch/dataviz_tutorials/blob/master/00_Images/03_IntroToP5/02_Trails.png)

The difference between having the `background` function and not should be very clear now. With it, you draw a full black background over everything and 'clear' the `canvas`, without it, you keep on drawing on the same background and see all the traces.

Add the `background` function back again.

Now, just to play around a bit with loops in our current sketch, let's say you want to create a small grid of ellipses, 10 x 10, based on where the mouse is. The way to do this would be to use two nested `for` loops in our `draw` function, and create the ellipses there. You would write it this way:
```js
function draw() {
  background(0);
  fill(255);
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      ellipse(mouseX + i * 25, mouseY + j * 25, 20, 20);
    }
  }
}
```

Note the `mouseX + i * 25` and the `mouseY + j * 25` parts of the code. Here, we are linking the position of the ellipses to the mouse (`mouseX` or `mouseY`), but also to the loop (`i` or `j`), and we are spacing them both horizontally and vertically by 25 pixels.

You should get something like this:
![03_EllipseGrid.png](https://github.com/CenterForSpatialResearch/dataviz_tutorials/blob/master/00_Images/03_IntroToP5/03_EllipseGrid.png)

Finally, let's get back to just one ellipse, but let's make it move independently of the mouse. Let's have the ellipse start at the `0` x position, and move horizontally towards the other end of the `canvas`.

For this purpose, I'll create two *global* variables, `positionX` and `positionY`. *Global* means that I'm declaring them outside any function, and as such, can be access by any function in the code. If I was declaring them in the `setup`, for example, they wouldn't be available in the `draw` function. But I want to make them accessible to all functions, so I'm declaring them at the top, outside.

And the other thing that I'm doing is, at the end of the `draw` function, adding `1` to `positionX`, so that every time the draw runs again, `positionX` will have increased by `1`. Here's the whole code so far:
```js
// Global variables
var positionX = 0;
var positionY = 225;

function setup() {
  createCanvas(800, 450);
  background(0);
}

function draw() {
  background(0);
  fill(255);
  ellipse(positionX, positionY, 20, 20);
  positionX += 1; // Here's where I add one to the positionX variable
}
```

You should see your ellipse start at the left end of the `canvas` and slowly move towards the right.

Now, let's make it go back and forth. We do this with a conditional: if the `positionX` equals the width of the `canvas`, then `positionX` should decrease by `1` after every `draw`. Same, if `positionX` is less than `0`, then `positionX` should increase by `1` after every draw. In order to make this easier, I'm also creating another *global* variable to hold the speed. Instead of just adding or subtracting `1` to the `positionX`, I'll add or subtract the `speedX`, and change the value of the speed when the ellipse hits both ends.

Here's the whole code again:
```js
var positionX = 0;
var positionY = 225;
var speedX = 5; // This is the new global variable

function setup() {
  createCanvas(800, 450);
  background(0);
}

function draw() {
  background(0);
  fill(255);
  ellipse(positionX, positionY, 20, 20);
  if (positionX > width) { // This is the conditional when it hits the right hand side
    speedX = speedX * -1;
  }
  if (positionX < 0) { // This is the conditional when it hits the left hand side
    speedX = speedX * -1;
  }
  positionX += speedX; // Here we add the speedX to the positionX
}
```

Also note that I use the system variable `width` in the first `if` statement. `width` and `height` are shorthand for the width and the height of the `canvas`, in this case `width` equals `800`.

Finally, I'll just replicate that behavior in the Y axis.

```js
var positionX = 0;
var positionY = 225;
var speedX = 5;
var speedY = 5; // New speedY global variable

function setup() {
  createCanvas(800, 450);
  background(0);
}

function draw() {
  background(0);
  fill(255);
  ellipse(positionX, positionY, 20, 20);
  if (positionX > width) {
    speedX = speedX * -1;
  }
  if (positionX < 0) {
    speedX = speedX * -1;
  }
  if (positionY > height) { // New if statement for the Y position
    speedY = speedY * -1;
  }
  if (positionY < 0) { // New if statement for the Y position
    speedY = speedY * -1;
  }
  positionX += speedX;
  positionY += speedY; // Add the speedY to the positionY
}
```

Now you should see your ellipse bouncing at the sides and at the bottom and top of the `canvas`. To make it a little more fun we could set the speeds to be random (with limits), so that every time you reload the page your ellipse moves differently.
```js
// Global variables
var positionX; // Declaring the variable but not assigning value
var positionY; // Declaring the variable but not assigning value
var speedX; // Declaring the variable but not assigning value
var speedY; // Declaring the variable but not assigning value

function setup() {
  createCanvas(800, 450);
  positionX = width/2; // Assigning the values here
  positionY = height/2; // Assigning the values here
  speedX = random(-5, 5); // Assigning the values here
  speedY = random(-5, 5); // Assigning the values here
  background(0);
}

function draw() {
  background(0);
  fill(255);
  ellipse(positionX, positionY, 20, 20);
  if (positionX > width) {
    speedX = speedX * -1;
  }
  if (positionX < 0) {
    speedX = speedX * -1;
  }
  if (positionY > height) {
    speedY = speedY * -1;
  }
  if (positionY < 0) {
    speedY = speedY * -1;
  }
  positionX += speedX;
  positionY += speedY;
}
```

Here, I'm changing a couple of things:
* I'm declaring the *global* variables, but I'm not actually assigning a value. That is because the `random()` function that I'm using to assign a value to the `speedX` and `speedY` variables needs to be used inside a function. So I'm declaring the values outside (so that they are *global*), and I'm assigning their value in the `setup` function.
* I'm doing sort of the same with the `positionX` and `positionY` variables: declaring them outside and assigning the values in the `setup` function, using the `width` and `height` system variables.

Finally, to have multiple, independent ellipses bouncing around we need to build them as objects, so that each ellipse, has it's own starting position and speed. First, I'm going to transform this one ellipse into an object and then I'll add multiple. Here's the code:
```js
// Declare the empty object variable
var bouncingEllipse;

// Define the class `bounce`
function bounce() {
  // Properties
  this.positionX = random(0, width);
  this.positionY = random(0, height);
  this.diameter = 20;
  this.speedX = random(-5, 5);
  this.speedY = random(-5, 5);

  // Functions
  // First function: draws the ellipse
  this.drawEllipse = function() {
    fill(255);
    ellipse(this.positionX, this.positionY, this.diameter, this.diameter);
  }
  // Second function: updates the positions
  this.updatePosition = function() {
    if (this.positionX > width) {
      this.speedX = this.speedX * -1;
    }
    if (this.positionX < 0) {
      this.speedX = this.speedX * -1;
    }
    if (this.positionY > height) {
      this.speedY = this.speedY * -1;
    }
    if (this.positionY < 0) {
      this.speedY = this.speedY * -1;
    }
    this.positionX += this.speedX;
    this.positionY += this.speedY;
  }
}

function setup() {
  createCanvas(800, 450);
  background(0);
  bouncingEllipse = new bounce(); // I'm making the empty variable into an object of the class `bounce`
}

function draw() {
  background(0);
  // Here I'm calling the two functions from the class
  bouncingEllipse.drawEllipse();
  bouncingEllipse.updatePosition();
}
```

So, there are multiple things happening here:
* First, I declare and empty variable to hold the single object: `var bouncingEllipse;`
* Next, I create the `class` of object, which holds all the properties and the functions: `function bounce()`
  * This class has all the properties of the ellipse we had before, `positionX`, `positionY`, `speedX`, and `speedY`, plus `diameter`. Here we are saying that every object of this class will have these characteristics. And when the object is actually created (further down in the code), these variables will get filled in by values.
  * The class also has two functions:
    * One to draw the ellipse, which includes the `fill` function and the actual `ellipse` function, using the properties declared above
    * And another one to update the positions, which holds the conditional `if` statements we had before in the `draw` function.
* Note also how in the `setup` I am saying that the `bouncingEllipse` is a `new bounce()`. This takes that empty variable that I declared at the beginning and actually makes it an object of the `bounce` class, assigning all the values.
* And finally, in the `draw` function, I'm calling the two functions from the object: `bouncingEllipse.drawEllipse();` and `bouncingEllipse.updatePosition();`.

Finally, to create multiple objects, we just need to modify the code a bit:
* First, instead of declaring one variable at the beginning, we make that variable an `array` to hold all the objects.
* Second, instead of creating just one object in the setup, we include a loop to create 25 objects and add them to the array.
* And finally in the draw function, for every object in the array we call the two functions, using a loop.

Here's the final code:
```js
// Declare the array to hold the ojects
var bouncingEllipse = [];

function bounce() {
  // Properties
  this.positionX = random(0, width);
  this.positionY = random(0, height);
  this.diameter = 20;
  this.speedX = random(-5, 5);
  this.speedY = random(-5, 5);

  // Functions
  this.drawEllipse = function() {
    fill(255);
    ellipse(this.positionX, this.positionY, this.diameter, this.diameter);
  }
  this.updatePosition = function() {
    if (this.positionX > width) {
      this.speedX = this.speedX * -1;
    }
    if (this.positionX < 0) {
      this.speedX = this.speedX * -1;
    }
    if (this.positionY > height) {
      this.speedY = this.speedY * -1;
    }
    if (this.positionY < 0) {
      this.speedY = this.speedY * -1;
    }
    this.positionX += this.speedX;
    this.positionY += this.speedY;
  }
}

function setup() {
  createCanvas(800, 450);
  background(0);
  for (var i = 0; i < 20; i++) {
    bouncingEllipse.push(new bounce()) // Create multiple objects and add them to the array
  }
}

function draw() {
  background(0);
  // For each object in the array, call the two functions
  for (var i = 0; i < bouncingEllipse.length; i++) {
    bouncingEllipse[i].drawEllipse();
    bouncingEllipse[i].updatePosition();
  }
}
```

With this code you should see 25 bouncing balls on your `canvas`. This is just a quick example to show you how to use p5.js. The next tutorials will have much more on how to work with data and add some interactivity.
