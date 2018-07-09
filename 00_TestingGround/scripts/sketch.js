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
