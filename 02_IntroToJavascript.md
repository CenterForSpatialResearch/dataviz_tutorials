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
    <meta charset="utf-8">
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
Variables are the bread and butter of programming. These are the elements that will hold your values and on which you will perform your operations. There are multiple types of variables: strings, numbers, booleans, arrays, and objects (though technically, an array is an object in JavaScript, but for the purposes of this tutorials we will treat them as different types of variables). Here is a description of these types of variables and a few examples:
* **Strings**: string variables hold text elements. These can also be numbers, but treated as text. For example:
  * `var name = "Juan";` - this line declares a variable `var` called `name` and assigns the value `Juan` to it.
  * Go ahead and type that line into your `sketch.js` file and then in the next line type `console.log(name);` which tells your browser to print in the `console` tab of the inspector the value of the variable `name`.
  * Note the `;` (semicolon) character at the end of each line. This is part of the JavaScript syntax.
  * Once you type those lines and save your `sketch.js` file, reload your browser page and you should see the result of the `console.log(name)` line printed there.
  * You can also use single quotes to assign a string value to a variable: `var lastName = 'Saldarriaga';`
  * And you can also use single quotes inside double quotes or vice versa: `var statement = "His name is 'Juan'";`
  * Give these lines a try to see how they work and how they print on the console.
* **Numbers**: these variables hold, of course, numbers, with or without decimals, positive and negative. For example:
  * `var x = 1;`
  * `var y = 3.14;`
  * `var z = -1.41;`
* **Booleans**: these types of variables only hold one of two values: `true` or `false`. For example:
  * `var juan = true;` or `var saldarriaga = false;`
* **Arrays**: these types of variables contain *multiple* values, of the same type or of mixed types. For example:
  * `var names = ["juan", "francisco", "jose", "felipe"];`
  * `var temperatures = [12, 53, 73, 32];`
  * `var myList = ["juan", 23, "44", 25, "saldarriaga"];`
  * And you can also have arrays, within arrays: `var doubleArray = ['Juan', 'Jose', [22, 'Saldarriaga']];`
  * The important thing about arrays is that you call a specific value based on its **position** in the array, and you count those positions starting with the number `0` for the first value:
    * For example, if you wanted to print the first value in that last array you would write `console.log(doubleArray[0]);`. This should print `juan`.
    * If you wanted to print the first value in the nested array you would write `console.log(doubleArray[2][0]);`. The number `2` calls the value in the third position, which is the other array, and the number `0` calls the first value in that other array. This should print `22`
    * Try to print different values so you get the hang of this.
* **Objects**: objects can also hold multiple values or arrays (called `properties`), but in addition to this they can also store functions. The classic example of an object is a car, which has properties - color, brand, number of doors, etc -, but also functions - start, stop, turn, etc. Objects in JavaScript work similarly:
  * For example: `var car = {brand: 'Volvo', year: 2010, color: "red", sedan: false, gears: ['R', '1', '2', '3', '4', '6']}`.
  * Note how objects use `{}` and not `[]` like arrays. Although they can hold arrays within them.
  * Note also how they contain labels (`brand`, `year`, etc). This is how you access the values, not by their position but by their label.
  * For example, if you wanted to get the `color` of the `car` you would type `car.color` or `car['color']` (both methods work).
  * Give this a try to get the hang of it.
  * Also, if you wanted to access a value within an array that's contained in an object you would use both the label and the position. For example if you wanted to get the first item in the list of gears you would do write `car.gears[0]` or `car['gear'][0]`.
* A couple of other things to note with variables:
  * You can reassign values to a variable, even if they are from a different type. For example:
  ```js
  var name = 'Juan';
  console.log(name); // This should print Juan
  var name = 123;
  console.log(name); // This should print 123
  ```
  * **Comments**:
    * As you can see in that last snippet you can use a double forward-slash (`//`) to create a comment. A comment is a piece of text that the program ignores and is extremely useful to document your code and annotate it. The more you comment your code, the easier it will be for someone else or even for you to understand it later.
    * You can also create a comment that spans multiple lines with an opening `/*` and a closing `*/`:
    ```js
    /*This is a comment
    that spans multiple lines*/
    ```
  * *Note that the names of the variables don't mean anything. It is useful to name variables in a way you can understand and recognize later on, but apart from some restricted keywords, it doesn't matter how you name variables*.

## Operations between variables
Obviously you can combine, add, subtract and merge variables. Some of these operations apply generally to numbers and others to strings. However, because of JavaScript's flexibility it is possible to mix and match, sometimes creating unexpected results. Here are some very common operations:
* **Math**:
  * `+`, `-`, `*`, and `/`. For example:
  ```js
  var x = 24;
  var y = 6;
  var z = x / y;
  console.log(z); // This should print 4
  ```
  * Modulus `%`: this operation returns the remainder of the division between two numbers. Like this:
  ```js
  var x = 24;
  var y = 5;
  var z = x % y;
  console.log(z); // This should print 4
  ```
  * `+=`: this is just a shorthand way of adding to a variable. For example:
  ```js
  var x = 2;
  x += 2; // This means the same as 'x = x + 2'
  console.log(x); // This should print 4
  ```
  * And, for other operations you can use the `Math` library that comes preloaded with JavaScript. For example:
    * `var x = Math.PI;` - this assigns the value of the constant PI to `x`
    * `var y = Math.sqrt(2);` = this assigns the value of the square root of 2 to y.
    * [Here](https://www.w3schools.com/jsref/jsref_obj_math.asp) is a list of other operations included in the `Math` object.
* **String**: here are some operations you can do using string variables.
  * You can add string variables like this:
  ```js
  var name = 'Juan';
  var lastName = 'Saldarriaga';
  var fullName = name + ' ' + lastName;
  ```
  * If you want to get a specific character from a string you can do it like this:
  ```js
  var name = 'Juan';
  var initial = name.charAt(0);
  ```
  * You can also concatenate or join string variables:
  ```js
  var firstName = 'Juan';
  var completeName = firstName.concat(" Francisco", " Saldarriaga"); // Note the spaces before the first letters
  console.log(completeName);
  var myNames = ['Juan', 'Francisco', 'Saldarriaga'];
  var fullName = myNames.join(' '); // The ' ' is telling the code to join using a space
  console.log(fullName);
  ```
  * If you want to make a string upper or lower case you can do it with the `toUpperCase()` or `toLowerCase()` functions:
  ```js
  var firstName = 'juan';
  console.log(firstName.toUpperCase());
  var lastName = 'saldarriaga';
  console.log(lastName.toLowerCase());
  ```
  * Finally, you can 'cast' (transform) a number variable into a string with the `toString()` function: `var myString = myNumber.toString()`
* There are some interesting behaviors when you are operating between variables of different types. For example take a look at this snippet:
```js
var x = 25 + "Juan"; // This one transforms the '25' into a string and then joins it with the 'Juan'
console.log(x);
var x = 25 + 5 + "Juan"; // This one adds the two numbers before joining them to the string 'Juan'
console.log(x);
var x = "Juan" + 25 + 5; // This one just joins the two numbers (without adding them) to the string 'Juan'
console.log(x);
```

* **Equality operators**: equality operators ask wether one value is equal, greater or less than another. They also verify is something exists, or if something is not equal to something else. They are crucial when you want your code to verify if a specific condition is met. And they respond with `true` or `false`.
  * `==` - this one is the most common. It verifies if a value is equal to another. It is very important to note that there are **two** equal signs. One equal sign `=` *assigns* a value to a variable. Two equal signs `==` ask the question: 'is this equal to that?'. For example:
  ```js
  var x = 1;
  var y = 2;
  console.log(x == y); // This should print 'false'
  ```
  * `!=` - not equal:
  ```js
  var x = 1;
  var y = 2;
  console.log(x != y); // This should print 'true'
  ```
  * `>` greater than, `<` less than, `>=` greater or equal than, and `<=` less or equal than.
* **Logical operators**: These ones allow you to join multiple conditions:
  * `&&` (and) - for example, if this **AND** that is true, do something else...
  * `||` (or) - if this **OR** that is true, do something else...
  * Here's a snippet using logical operators:
  ```js
  var x = 1;
  var y = 3;
  console.log(x == y && y > 2); // This should print 'false'
  console.log(x == y || y > 2); // This should print 'true'
  ```


* And [here](https://www.w3schools.com/jsref/jsref_operators.asp) is a more comprehensive list of JavaScript operators.

* loops (for and while)
* conditionals

## Functions

* Function within an object
