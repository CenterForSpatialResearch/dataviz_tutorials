# Setting up a localhost and creating a basic webpage

*This tutorial describes the basic steps to run a localhost on your computer and create a basic webpage. It also provides a very brief introduction to HTML and CSS and describes the basic configuration of a website. This tutorial was written on June 2018.*

## Running a localhost
A **localhost** is the equivalent of running a server on your own computer. However, as it name implies, it only runs locally and thus is only available to the computer where it is running. That being said, localhosts are an essential part of the workflow to create any website. They are constantly used to develop, preview and test web applications before deploying them. In building static or interactive data visualizations on the web, you will certainly develop and test most of your site through a localhost.

There are multiple ways of running a localhost. Here are some of the most common:

#### Atom package
Maybe the easiest way to run a localhost is through the **atom-live-server** package for the popular **Atom** text editor. [Atom](https://atom.io/) is a text editor developed by Github which is widely used in the development of websites and programs.
* To install the `atom-live-server` package, open Atom and go to `Preferences`. There, go to the `+ Install` tab and search for `atom-live-server`. Install it.
* Once it is installed, use Atom to open the **Folder** where you have your website files (`File/Open`) and then click on `Packages/atom-live-server/Start server`. This will automatically start a localhost based on the folder you have opened on Atom and open a window in your default browser where you can see your website.
* To stop the localhost click on `Packages/atom-live-server/Stop path/to/website/folder`.

#### Python localhost on a Mac computer
Running a **Python** web server is probably the most common way of creating a localhost. On a Mac you do this through the **Terminal**. If you have never used the Terminal, it is basically a program that allows you to navigate your computer and manage files and folders (it can do much much more, but that's outside the scope of this tutorial).
* On your computer open the Terminal and navigate to the folder where you have (or will have) your website files:
  * To navigate in the terminal you can use the command `cd path/to/folder`. For example, if I wanted to go to a folder named "myWebsite", located inside "Documents" I would do `cd Documents/myWebsite`.
  * Remember, commands in the Terminal are case sensitive. If a folder or a file are written with caps, the path to them needs to have those same caps.
  * You can also go to your home folder by typing `cd ~`. The `~` character represents your home folder.
  * To know where you are in your computer, type `pwd` which stands for "path working directory". This will show you exactly where you are.
  * Finally, if you want to go back one level you can do `cd ..`. The two points represent one level back.
* Once you've reached the folder where you have (or will have) your website files, the command to run a localhost is `python -m SimpleHTTPServer`:
  * Note that this command presupposes that your computer is running Python version 2.x (usually 2.7). Python comes pre-installed with all Mac OS.
  * If you are running Python 3.x, the command to run a localhost will be `python3 -m http.server`.
  * To know exactly what version of Python your computer is running you can type `python --version`.
  * Also, if you want to specify the port on which the localhost will run you can modify the command by doing `python -m SimpleHTTPServer 4000` or `python3 -m http.server 4000`. This will run the localhost on the 4000 port, instead of the 8000 port which is the default.
* Once the localhost is running, you can open your web browser (Chrome, Firefox or Safari) and go to the following URL to see your website: `http://localhost:4000/`.
* To stop the local host go back to your Terminal window and press `ctrl+c` (the "control" key and the letter "c" key). This will stop whatever process is running on your Terminal window.

#### Python localhost on a Windows computer
You can also run a localhost using **Python** on a Windows computer. However, because Windows computers don't include Python out of the box you will first need to install.
* Downloading and installing Python:
  * There are multiple ways of installing Python on a Windows machine. The most simple is probably to go to [Python.org](https://www.python.org/downloads/windows/) and download the latest version for your machine. You can choose between downloading Python version 2.7 or 3.6, both of them work. Just note that depending on what version you install, some of the commands will change.
  * After downloading the installer, double-click to open it and follow the installation prompts, selecting the default settings until you get to the page that reads "Customize Python 2.7.XX":
    * Scroll to the bottom of options, and click the drop-down selection that reads "Add python.exe to Path" (it should have a red "X" by default)
    * Select the option that reads "Entire feature will be installed on local hard drive"
  * Follow the prompts on the rest of the setup allowing the installation to finish.
  * To test that python was installed, open the Command Prompt application, and enter python --version. It should read "Python 2.7.XX" (or whatever version you installed).
* Once Python is installed, you can basically follow the same instructions as for Mac, with the difference that you will be using the **Command Prompt** instead of the Terminal:
  * To navigate in the Command Prompt you can use the command `cd path\to\folder` (note that the `\` are back-slash and not forward-slash as for Macs).
  * Remember, commands in the Command Prompt are case sensitive. If a folder or a file are written with caps, the path to them needs to have those same caps.
  * If you want to go back one level you can do `cd ..`. The two points represent one level back.
* Once you've reached the folder where you have (or will have) your website files, the command to run a localhost is `python -m SimpleHTTPServer`:
  * Note that this command presupposes that your computer is running Python version 2.x.
  * If you are running Python 3.x, the command to run a localhost will be `python3 -m http.server`.
  * To know exactly what version of Python your computer is running you can type `python -V`.
  * Also, if you want to specify the port on which the localhost will run you can modify the command by doing `python -m SimpleHTTPServer 4000` or `python3 -m http.server 4000`. This will run the localhost on the 4000 port, instead of the 8000 port which is the default.
* Once the localhost is running, you can open your web browser (Chrome, Firefox or Safari) and go to the following URL to see your website: `http://localhost:4000/`.
* To stop the local host go back to your Command Prompt window and press `ctrl+c` (the "control" key and the letter "c" key). This will stop whatever process is running on your Command Prompt window.

#### Chrome plugin
A third way of running a localhost on your computer is through the **Web Server for Chrome** plugin. Note that this plugin **only** works with Google Chrome.
* To install Web Server for Chrome, simply go to the [plugin's site](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb?hl=en) and add it to Chrome.
* Once the plugin is installed and you launch the app, you will be prompted to select the folder that holds your site's files. Choose your folder and note the `Web Server URL(s)` displayed in the window. On Chrome go to that URL. You can also click on the URL.

## HTML
HTML or Hypertext Markup Language is the main language of the web. This is the language that your browser will interpret in order to correctly display the content of a website.

HTML works through different elements, identified with opening and closing tags, that let your browser know how to display them. For example, if you want to display a heading with the text "Data Visualization Website" you will write it like this in HTML: `<h1>Data Visualization Website</h1>`. Note the `<h1>` tag, which tells the browser display the following content as a heading, and the `</h1>` tag, which tells the browser where the heading ends.

Similarly, if you were going to display a simple paragraph with the text "Lorem ipsum dolor sit amet, consectetur adipiscing elit." you would write it like this: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>`. Just like in the title example, there is an opening `<p>` tag and a closing `</p>` tag.

In addition, HTML also allows you to nest elements within others. For example, if you have a paragraph which contains a link you would write it in the following way: `<p>This is my paragraph that contains a <a href='https://url.to.link'>link</a> to another site.</p>` Note the `<p></p>` tags that open and close the paragraph and the `<a></a>` tags that open and close the link.

Finally, HTML can also hold some elements which will not be displayed on the browser but which contain metadata about the site. These elements will be used by search engines to find and index your site. They will be located within a `<head></head>` element at the beginning of the file and contain things like the description of the page, the name of the author, a title for the tab on your browser, and keywords.

Here's a very basic example of an HTML file:
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Page Title</title>
  </head>
  <body>
    <h1>My First Heading</h1>
    <p>My first paragraph.</p>
  </body>
</html>
```

Note that there is one tag at the beginning that tells the browser this is an html document and one overall `<html></html>` element that holds everything else. There is also the `<head></head>` element that holds all the metadata and the `<body></body>` element that holds the content.

Here's a more detailed explanation of some of the most common elements:
* `<!DOCTYPE html>`: this defines the document as HTML
* `<html>`: marks the start or end (`</html>`) of the HTML document
* `<head></head>`: contains the "meta" information about the document. Some of the information that can go here is:
    * `<title>`: Title of the page, also what you see in the tab in your browser.
    * Meta elements: Don't really do much to the content but are used by search engines to catalogue information about the page.
        * `<meta charset="utf-8">`: specifies the character encoding for the page, in this case "utf-8".
        * `<meta name="description" content="description of the site">`: contains a description of the site.
        * `<meta name="keywords" content="keywords for the site">`: contains the keywords for the site.
        * `<meta name="author" content="author name">`: contains the name(s) of the author(s) of the site.
    * Link elements: Here you will specify the location of the files that you will be referencing, for example, the .css files that contain the styling for the site.
        * `<link rel="stylesheet" type="text/css" href="css/style.css">`: contains a link to the style.css file.
    * Style elements: contains style information for the document or for a part of the document.
    * Script elements: here you specify other files, sites or actual code that contain scripts that you will be using in this page. For example, if you are using Google fonts or Adobe Typekit fonts, you will specify this here. Or if you are using Google Analytics you will also add the script here.
* `<body></body>`: In between these two elements you will find all the content of the page. In the `<body>` you will find some or all of the following elements:
    * `<div></div>`: a generic container. It is useful for styling purposes (using the class or id attributes).
    * `<nav></nav>`: contains the navigation information for the page. This can be a "nav-bar" at the top of the page that links the different pages of the website.
    * `<h1></h1>`, `<h2></h2>`, `<h3></h3>`, etc: Headings, sub-headings and sub-sub-headings.
    * `<p></p>`: paragraph elements.
    * `<hr>`: represents a break, between sections or topics. Can be styled as a horizontal line.
    * `<ul></ul>`: represents an unordered list.
    * `<li></li>`: represents an element in a list. Usually found inside `<ul>` elements.
    * `<a href="linkLocation.html"></a>`: defines a hyperlink. This can be a link on the same page or on another page or website. It can be applied to a word, a heading or an image or to other elements on the page.
    * `<b></b>`: represents bold text.
    * `<br>`: represents a break, for example, between paragraphs in the same `<p></p>` element.
    * `<i></i>`: represent an italic text.
    * `<u></u>`: represents underlined text.
    * `<img src="locationOfImageFile.extension">`: contains an image element.
    * `<footer></footer>`: contains the footer information for the page.

There are many more elements. For a full list see the [HTML element reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) guide by Mozilla Developer Network.

## CSS
CSS or Cascading Style Sheets is the other main language of the web. This one, though, doesn't really hold any of the content but tells the browser how to **style** the content located in the html file. By style we mean color, font family, font size, background color, letter spacing, etc.

For example, if you want to style all `<p></p>` elements you should add the following lines to your css file:
```css
p{
    color: #000000;
    font-family: "futura-pt", helvetica, sans-serif;
    font-size: 1.35em;
    font-weight: 300;
    max-width: 900px;
}
```
Here, we are setting the color of the text, the font family, the font weight, and the maximum width of the paragraphs.

In addition to modifying the style of all elements of a specific type, css can also affect a subset of elements or even individual ones through the use of classes or ids:
* A `class` is a custom designation for a group of elements. For example, if you have a series of paragraphs that require special formatting, but you don't want to affect all paragraphs, you can add a `class` to those paragraphs in your html file and style them in the css file.
* An `id` is usually reserved for one single element. Again, you add the `id` in the html file and then style it in the css.

Here's an example with three different paragraphs, each one of them style differently:
* Here's the html code:
```html
<p>This is the generic text element with the default styling.</p>
<p class="boldText">This is one element we will style with BOLD text.</p>
<p id="italicsText">This is the other element we will style with ITALICS text.</p>
```
* And here's the css code:
```css
p{
  color: #000000;
  font-family: "futura-pt", helvetica, sans-serif;
  font-size: 1.35em;
  font-weight: 300;
  max-width: 900px;
}
p.boldText {
  font-weight: bold;
}
p#italicsText {
  font-style: italic;
}
```
Note that both the `class` and the `id` designations happen inside the opening `<p>` tag. Also note how you signal a `class` or an `id` in the css: the `class` is called with a `.` and the `id` is called with a `#` mark.

## Putting it all together
#### Website structure and organization
There is no perfect way to structure your website files but it's always good to keep things organized. The following is how I usually structure my projects:
* **`index.html`** - this is the main html file, the first one that a browser will read automatically. Usually, this is the main landing page on a site.
* **`styles`** (folder)
  * **`style.css`** - this is the main css file that will style the site
* **`scripts`** (folder) - here is where you put your javascript files and libraries
* **`images`** (folder) - here is where you can put your image files

More information about this can be found at the Mozilla Developer Network [web docs](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/Dealing_with_files).

#### index.html
The following is a short example of an `index.html` file for the landing page of a data visualization website. It contains a title, a brief intro, and the links to the projects. I've tried to comment it as much as possible. Below that you will find the `style.css` file that styles the html.
```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Tab title -->
    <title>C4SR Projects</title>
    <!-- Metadata -->
    <meta name="author" content="Juan Saldarriaga">
    <meta name="keywords" content="data visualization, new york, urban planning">
    <!-- Link to the style css file -->
    <link rel="stylesheet" type="text/css" href="styles/style.css">
    <!-- Link to Google Fonts to load the appropriate font -->
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400" rel="stylesheet">
  </head>
  <body>
    <!-- Div container for the title and subtitle -->
    <div class="titles">
      <h1>Center for Spatial Research - Projects</h1>
      <!-- Subtitle -->
      <h3>Creating data visualization for architecture, urbanism and the humanities.</h3>
      <!-- Line element -->
      <hr>
    </div>
    <!-- Div container for the intro and list of projects -->
    <div class="content">
      <!-- Paragraph with a specific id to apply custom style -->
      <p id="intro">The following is a list of data visualization projects we have developed in the past. They all relate urban humanities, under the theme of Conflict Urbanism. Supported by the Andrew W. Mellon Foundation this set of projects interrogates the role of conflict in structuring urban space and experiences.</p>
      <!-- List of projects with their links -->
      <ul>
        <li><p class="project-description"><a href="http://c4sr.columbia.edu/conflict-urbanism-colombia">Conflict Urbanism: Colombia</a> - Over the course of the last thirty years, almost seven million Colombians have been forced to leave their homes and towns and move to safer locations. Thousands more have been victims of sexual violence, threats, land-mine explosions, homicides and massacres. Conflict Urbanism: Colombia maps and visualizes these crimes in hopes of better understanding the patterns and ramifications of the Colombian conflict.</p></li>
        <li><p class="project-description"><a href="http://c4sr.columbia.edu/urban-language-ecologies/">Conflict Urbanism: Language Ecologies</a> - Conflict Urbanism: Language Ecologies explores the role that language plays in shaping urban space. Language interacts with its environment at multiple scales and with diverse media. As an ecology, language either dominates, or is vulnerable to its host environments. In this way it often makes conflict visible in urban settings.</p></li>
        <li><p class="project-description"><a href="http://c4sr.columbia.edu/conflict-urbanism-aleppo/">Conflict Urbanism: Aleppo</a> - Conflict Urbanism: Aleppo is a call for inquiry and a call to action. It is an open-source, interactive, data-rich map of the city of Aleppo, at the neighborhood scale. Users can navigate the city, with the aid of high resolution satellite imagery from before and during the current civil war. It is also an invitation to students and other collaborators to record and narrate urban damage in Aleppo — at the cultural, infrastructural, or neighborhood scale — and to present that research in case studies which will be added to the website over time.</p></li>
      </ul>
    </div>
  </body>
</html>
```

#### style.css
Finally, bellow is the `style.css` file that will style the `index.html` file above.
```css
body {
  font-family: 'Roboto', sans-serif;
}
.titles {
  margin: auto;
  max-width: 800px;
}
.content {
  max-width: 800px;
  margin: auto;
}
h1 {
  font-weight: 300;
  text-align: center;
  margin-bottom: 5px;
}
h3 {
  font-weight: 300;
  text-align: center;
  margin-top: 5px;
}
hr {
  width: 50%;
  border-top-color: #7F7F7F;
  border-top-style: solid;
  border-top-width: 1px;
  border-bottom-color: #ffffff;
  border-bottom-style: solid;
  border-bottom-width: 1px;
}
#intro{
  font-weight: 300;
}
.project-description {
  font-weight: 300;
}
.project-description a {
  color: black;
  font-weight: 400;
}
.project-description a:hover {
  background-color: #FFFF7F;
}
```
