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
  // Plotting the dots
  // fill(0);
  // for (var i = 0; i < tripTable.getRowCount(); i++) {
  //   var thisYear = float(tripTable.getString(i, 'birth year'));
  //   var thisDuration = float(tripTable.getString(i, 'tripduration'));
  //   var thisX = map(thisYear, minYears, maxYears, marginX, marginX + graphWidth);
  //   var thisY = map(thisDuration, minDuration, maxDuration, marginY + graphHeight, marginY);
  //   ellipse(thisX, thisY, 3, 3);
  // }
}

// ***** Draw function ***** //
// function draw(){
// }

// // ***** Create new table function ******* //
// function createNewTable(){
//   topRevenue.addColumn('release_date');
//   topRevenue.addColumn('vote_average');
//   for (var i = 0; i < moviesTable.getRowCount(); i++) {
//     var totalRevenue = moviesTable.getNum(i, 'revenue');
//     if (totalRevenue >= 100000000) {
//       var newRow = topRevenue.addRow();
//       newRow.setString('release_date', moviesTable.getString(i, 'release_date'));
//       newRow.setNum('vote_average', moviesTable.getNum(i, 'vote_average'));
//     }
//   }
//   print('New top revenue table created...');
// }
//
// function drawMovies(table){
//   background(255);
//   fill(0);
//   for (var i = 0; i < 11; i++) {
//     noStroke();
//     textAlign(RIGHT, CENTER);
//     text(i, textLeft, map(i, 0, 10, bottomY, topY));
//     stroke(200);
//     line(textLeft + 10, map(i, 0, 10, bottomY, topY), rightX + 10, map(i, 0, 10, bottomY, topY));
//   }
//   noStroke();
//   for (var i = 0; i < 10; i++) {
//     textAlign(CENTER, TOP);
//     text(round(map(i, 0, 9, 1916, 2017)), map(i, 0, 9, leftX, rightX), bottomY + 5);
//   }
//   for (var i = 0; i < table.getRowCount(); i++) {
//     var date = table.getString(i, 'release_date').split('-')[0];
//     var year = parseInt(date);
//     var yearPosition = map(year, 1916, 2017, leftX, rightX);
//     var scorePosition = map(table.getNum(i, 'vote_average'), 0, 10, bottomY, topY);
//     ellipse(yearPosition, scorePosition, 3, 3);
//   }
// }
//
// // ***** Draw function ***** //
// function draw(){
//   drawMovies(topRevenue);
// }
