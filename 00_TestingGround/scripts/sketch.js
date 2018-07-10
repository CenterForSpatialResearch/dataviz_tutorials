// ***** Global variables ***** //
var baseURL = 'https://gbfs.citibikenyc.com/gbfs/en/station_status.json'
var stationData;
var maxCapacity;
var marginX = 50;
var marginY = 50;
var circleSpacingX = 100;
var circleSpacingY = 120;
var circleSize = 80;

// ***** Setup function ***** //
function setup(){
  createCanvas(1200, 800);
  textSize(12);
  textFont('Roboto');
  console.log('Setup complete...');
  queryAPI();
  noLoop();
}

// **** Query API Function *** //
function queryAPI(){
  loadJSON(baseURL, getStationData);
}

function getStationData(apiData){
  stationData = apiData;
  maxCapacity = 0;
  for (var i = 0; i < stationData.data.stations.length; i++) {
    var stationID = stationData.data.stations[i].station_id;
    var bikes = stationData.data.stations[i].num_bikes_available;
    var docks = stationData.data.stations[i].num_docks_available;
    var bikesDis = stationData.data.stations[i].num_bikes_disabled;
    var docksDis = stationData.data.stations[i].num_docks_disabled;
    var stationCapacity = bikes + docks + bikesDis + docksDis;
    maxCapacity = max(maxCapacity, stationCapacity);
  }
  print(maxCapacity);
  drawStations();
}

// ***** Draw stations function ***** //
function drawStations(){
  background(255);
  for (var i = 0; i < stationData.data.stations.length; i++) {
    var row = floor(i / 12);
    var column = i%12;
    fill(0);
    ellipse(marginX + circleSpacingX * column, marginY + circleSpacingY * row, circleSize, circleSize);
    // stationData.data.stations[i]
  }
}

// // ***** Get maximum values function ***** //
// function getMaxValues(){
//
// }
//
// function trip(duration, usertype, yearBirth, gender){
//
// }
//
// function drawButtons() {
//
// }
//

//
// function mousePressed(){
//
// }
//
// function drawLegend(){
//
// }
