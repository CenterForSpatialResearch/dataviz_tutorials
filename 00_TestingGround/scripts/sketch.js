// ***** Global variables ***** //
var tripTable;
var maxYears = 0;
var minYears = 2000;
var yearRange;
var maxDuration = 0;
var minDuration = 5000;
var durationRange;
var marginX = 50;
var marginY = 55;
var graphHeight;
var graphWidth;
var tripObjects = [];
var selectedButton = 0;
var buttonLength = 100;
var buttonSpacing = 5;

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
    if (selectedButton == 0){
      fill(0);
    }
    else if (selectedButton == 1) {
      if (this.gender == '0'){
        fill(200);
      }
      else if (this.gender == '1'){
        fill(255, 136, 0);
      }
      else if (this.gender == '2'){
        fill(0, 170, 255);
      }
    }
    else if (selectedButton == 2){
      if (this.usertype == 'Subscriber'){
        fill(255, 136, 0);
      }
      else if (this.usertype == 'Customer'){
        fill(0, 170, 255);
      }
    }
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

function drawButtons() {
  var buttonLabels = ['All trips', 'By gender', 'By user type'];
  for (var i = 0; i < buttonLabels.length; i++) {
    if (selectedButton == i) {
      fill(255, 233, 127);
    }
    else {
      fill(230);
    }
    noStroke();
    rect(440 + (buttonLength + buttonSpacing) * i, 20, buttonLength, 20);
    fill(100);
    textAlign(CENTER, CENTER);
    text(buttonLabels[i], 440 + buttonLength / 2 + (buttonLength + buttonSpacing) * i, 30)
  }
}

function draw(){
  background(255);
  drawButtons();
  drawLegend();
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

function mousePressed(){
  if (mouseX > 440 && mouseY > 20 && mouseX < (440 + buttonLength) && mouseY < 40){
    selectedButton = 0;
  }
  if (mouseX > (440 + buttonLength + buttonSpacing) && mouseY > 20 && mouseX < (440 + buttonLength * 2 + buttonSpacing) && mouseY < 40){
    selectedButton = 1;
  }
  if (mouseX > (440 + buttonLength * 2 + buttonSpacing * 2) && mouseY > 20 && mouseX < (440 + buttonLength * 3 + buttonSpacing * 2) && mouseY < 40){
    selectedButton = 2;
  }
}

function drawLegend(){
  if (selectedButton == 1){
    fill(0, 170, 255);
    ellipse(graphWidth - 15, marginY + 12, 4, 4);
    fill(255, 136, 0);
    ellipse(graphWidth - 15, marginY + 27, 4, 4);
    fill(100);
    textAlign(LEFT, CENTER);
    text('Female', graphWidth - 10, marginY + 12);
    text('Male', graphWidth - 10, marginY + 27);
  }
  if (selectedButton == 2){
    fill(0, 170, 255);
    ellipse(graphWidth - 15, marginY + 12, 4, 4);
    fill(255, 136, 0);
    ellipse(graphWidth - 15, marginY + 27, 4, 4);
    fill(100);
    textAlign(LEFT, CENTER);
    text('Customer', graphWidth - 10, marginY + 12);
    text('Subscriber', graphWidth - 10, marginY + 27);
  }
}
