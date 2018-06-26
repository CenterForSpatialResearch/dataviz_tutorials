# Setting up a localhost and creating a basic webpage

*This tutorial describes the basic steps to run a localhost on your computer and create a basic webpage. It also provides a very brief introduction to HTML and CSS and describes the basic configuration of a website. This tutorial was written on June 26, 2018.*

### Running a localhost
A **localhost** is the equivalent of running a server on your own computer. However, as it name implies, it only runs locally and thus is only available to the computer where it is running. That being said, localhosts are an essential part of the workflow to create any website. They are constantly used to develop and test web applications before deploying them online. In building data visualization, you will certainly develop and test most of your site through a localhost.

There are multiple ways of running a localhost. Here are some of the most common:
* Atom package:
  * Maybe the easiest way to run a localhost is through the **atom-live-server** package for the popular **Atom** text editor. [Atom](https://atom.io/) is a text editor developed by Github which is widely used in the development of websites and programs.
  * To install the `atom-live-server` package, open Atom and go to `Preferences`. There, go to the `+ Install` tab and search for `atom-live-server`. Install it.
  * Once it is installed, use Atom to open the **Folder** where you have your website files (`File/Open`) and then click on `Packages/atom-live-server/Start server`. This will automatically start a localhost based on the folder you have opened on Atom, and open a window in your default browser where you can see your website.
  * To stop the localhost click on `Packages/atom-live-server/Stop path/to/website/folder`.
* On a Mac computer:
  * One of the most common ways of running a localhost on a Mac is through the **Terminal**. If you have never used the Terminal, it is basically a program that allows you to navigate your computer and manage files and folders (it can do much much more, but that's outside the scope of this tutorial).
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
* Through a Chrome plugin:
