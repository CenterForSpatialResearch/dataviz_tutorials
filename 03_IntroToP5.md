# Introduction to p5.js

*This tutorial introduces the p5.js library and helps you create a basic sketch. p5.js will be the library of choice for these data visualization tutorials. This tutorial was written on July 2018.*

## What is p5.js
[p5.js](https://p5js.org/) is a great library for creative coding in JavaScript. It is built with the same aim as [Processing](http://processing.org/), which is "to make coding accessible to for artist, designers, educators, and beginners." There are other, more robust and complex data visualization libraries, like [d3.js](https://d3js.org/), and you could say that p5 is not a strict data visualization library, but we have chosen it here because of its flexibility and ease of use. Additionally, since p5.js is not strictly a data visualization library and doesn't come with all the pre-built functions, it invites students to learn and understand the basics before they can move on to more advanced visualizations.

p5.js is just a JavaScript library, meaning that it adds functions to the language. Ultimately, this means that we will write in JavaScript, but we will also be able to access all the functions included in the p5.js library. To learn much more about p5.js head over to their [site](https://p5js.org/), where you will find a longer introduction, as well as tutorials and documentation. In addition, check out Daniel Shiffman's great [video tutorial series](https://www.youtube.com/user/shiffman/playlists?shelf_id=14&view=50&sort=dd) on p5.js.

This tutorial will show you how to load the p5.js library and how to setup a basic sketch. It will also guide you through the main components of that sketch and will show you how to code a very simple 'bouncing balls' drawing. Something like this:

**Add gif** ***************************

## Basic setup
Before starting to code our sketch, you need to [download](https://p5js.org/download/) the p5.js library. I recommend downloading the *complete* p5.js library. For this sketch we only need the main `p5.js` file, but for future tutorials you'll need the other components, so you might as well download everything now.

Next, setup your website folder and create your basic files. Mine is setup like this:
* `TestingGround` (folder):
  * `index.html`
  * `scripts` (folder):
    * `sketch.js`
    * `p5` (folder):
      * Unzipped p5 library

*Make sure you put your p5.js library in the `p5` folder (in the `scripts`) folder, and you unzip it there.*

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

* Loop







**end**
