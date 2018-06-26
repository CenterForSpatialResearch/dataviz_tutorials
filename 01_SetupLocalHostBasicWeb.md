# Setting up a localhost and creating a basic webpage

*This tutorial describes the basic steps to run a localhost on your computer and create a basic webpage. It also provides a very brief introduction to HTML and CSS and describes the basic configuration of a website. This tutorial was written on June 26, 2018.*

### Running a localhost
A **localhost** is the equivalent of running a server on your own computer. However, as it name implies, it only runs locally and thus is only available to the computer where it is running. That being said, localhosts are an essential part of the workflow to create any website. They are constantly used to develop, preview and test web applications before deploying them. In building static or interactive data visualizations on the web, you will certainly develop and test most of your site through a localhost.

There are multiple ways of running a localhost. Here are some of the most common:

#### Atom package
Maybe the easiest way to run a localhost is through the **atom-live-server** package for the popular **Atom** text editor. [Atom](https://atom.io/) is a text editor developed by Github which is widely used in the development of websites and programs.
* To install the `atom-live-server` package, open Atom and go to `Preferences`. There, go to the `+ Install` tab and search for `atom-live-server`. Install it.
* Once it is installed, use Atom to open the **Folder** where you have your website files (`File/Open`) and then click on `Packages/atom-live-server/Start server`. This will automatically start a localhost based on the folder you have opened on Atom and open a window in your default browser where you can see your website.
* To stop the localhost click on `Packages/atom-live-server/Stop path/to/website/folder`.

#### Python on a Mac computer
Running a Python web server is probably the most common way of creating a localhost. On a Mac you do this through the **Terminal**. If you have never used the Terminal, it is basically a program that allows you to navigate your computer and manage files and folders (it can do much much more, but that's outside the scope of this tutorial).
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
You can also run a localhost using Python on a Windows computer. However, because Windows computers don't include Python out of the box you will first need to install.
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
