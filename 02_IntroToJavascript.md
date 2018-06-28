# Basic JavaScript Syntax

*This tutorial describes the basic elements and syntax of JavaScript, the main scripting language of the web. Through JavaScript, and its visualization libraries, you will be able to create dynamic data visualizations. This tutorial was written on June 2018.*

## Basic setup
Before diving into what JavaScript is and its different components, we should build a very basic webpage and run a localhost, so that we can test and understand everything better. For this purpose you should create a folder on your computer to hold this temporary testing site. I'll call mine `TestingGround`, and inside I will create an `index.html` file, a `scripts` folder, and in the `scripts` folder I'll create a file called `sketch.js` (this is going to be my main JavaScript file). I'll create these files in [Atom](https://atom.io/), my current text editor. Here's the overall structure:
* `TestingGround` (folder):
  * `index.html`
  * `scripts` (folder):
    * `sketch.js`

In the `index.html` you should add the following code:
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Intro to JavaScript</title>
    <!-- Link to sketch file -->
    <script language="javascript" type="text/javascript" src="scripts/sketch.js"></script>
  </head>
  <body>
    <div>
      <h1>Intro to JavaScript</h1>
    </div>
  </body>
</html>
```

It is just a bare bones site so you can test JavaScript's different elements and syntax, and apart from the line that links the script file (`<script language="javascript" type="text/javascript" src="scripts/sketch.js"></script>`), the content of the `index.html` file doesn't really matter for this tutorial. This line, though, is crucial: it tells the `index.html` file, to run the `sketch.js` file located in the `scripts` folder.

Once you've setup your folder this way, go ahead and run a localhost and navigate to the appropriate URL on your browser. If you need more information on how to run a localhost you can check out our [previous tutorial](https://github.com/CenterForSpatialResearch/dataviz_tutorials/blob/master/01_SetupLocalHostBasicWeb.md).

## Inspector
The last element in this setup is the **Inspector**, a tool available on Chrome, Firefox, and Safari, that allows you to see the structure of a webpage, its different elements, its styling, its errors, and the printout from any scripts, amongst other things. As you can tell from that list of functions, the **Inspector** is an invaluable element in developing a webpage and should be one of your mostly widely used tools.

To open the **Inspector** tool on Chrome or Firefox, right-click on the page and select `Inspect element` (in Firefox) or `Inspect` (in Chrome). On Safari, you need to first show the `Develop menu in menu bar` in Safari's `Preferences/Advanced`. Once this is enabled, you can right-click on a page and select `Inspect Element`.

The window that comes up, on the side of the page or on the bottom, will have different tabs: the `Inspector` or `Elements` tab will display the different `html` elements on the site. The `Console` tab will display the printouts from your code (and this is the one we will use in this tutorial). And the `Network` tab will allow you to disable the cache, so that every change you perform in your code gets reflected on the page once it's reloaded (if you have the inspector open, go ahead and disable the cache).

## What is JavaScript
**JavaScript** is the most common scripting language for the web and it will allow you to create dynamic websites suited for data visualization. JavaScript, as a language, has the following characteristics:
* **High-level**: JavaScript employs strong abstraction, similar to Python, making it a 'high-level' language. This means that JavaScript is easier to understand and write than other low-level languages which sit closer to the binary code of the computer. At the same time, because of this high level of abstraction, JavaScript is also not the most efficient language.
* **Dynamic**: JavaScript is executed at runtime, without previous compilation. This means that some of the processes other languages go through at compilation, like checking types, will be performed at runtime. In the end, this means that if there are any errors in your code, they will only be flagged when the code runs, not before.
* **Weakly typed**: JavaScript allows operations to be performed on any type of data. Other languages, 'hard-typed', have strict rules in regards to what operations can be applied to specific types of data. JavaScript is much more flexible, which, at the same time, opens up possibilities for mistakes or unexpected behaviors.
* **Object-oriented**: This is one of the key characteristics of JavaScript (and other object oriented languages). It allows you to define 'objects' which may contain data (attributes) and instructions (functions or methods). Most of the most interesting programming will happen through these types of variables and they will become an essential part of your more advanced designs.

## Variables
Variables are the bread and butter of programming. These are the entities that will hold your values, and on which you will perform your operations. There are multiple types of variables
