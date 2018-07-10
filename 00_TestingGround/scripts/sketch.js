// ***** Global variables ***** //
var baseURL = 'https://gbfs.citibikenyc.com/gbfs/en/station_status.json'
var stationData;
var maxCapacity;
var marginX = 50;
var marginY = 50;
var circleSpacingX = 90;
var circleSpacingY = 90;
var circleSize = 60;
var button;

// ***** Setup function ***** //
function setup(){
  createCanvas(1200, 6500);
  textSize(12);
  textFont('Roboto');
  console.log('Setup complete...');
  queryAPI();
  button = select('#refresh');
  button.mousePressed(queryAPI)
  noLoop();
}

// **** Query API Function *** //
function queryAPI(){
  loadJSON(baseURL, getStationData);
}

function getStationData(apiData){
  stationData = apiData;
  print(stationData);
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
  drawStations();
  print('Queried the API...');
}

// ***** Draw stations function ***** //
function drawStations(){
  background(255);
  for (var i = 0; i < stationData.data.stations.length; i++) {
    var row = floor(i / 12);
    var column = i%12;
    var startAngle = 0;
    var endAngle = 0;
    var bikes = stationData.data.stations[i].num_bikes_available;
    var docks = stationData.data.stations[i].num_docks_available;
    var bikesDis = stationData.data.stations[i].num_bikes_disabled;
    var docksDis = stationData.data.stations[i].num_docks_disabled;
    var stationCapacity = bikes + docks + bikesDis + docksDis;
    var stationMaxAngle = map(stationCapacity, 0, maxCapacity, 0, 360);
    noStroke();
    // Broken bikes
    fill(255, 148, 0, 50);
    endAngle = map(bikesDis, 0, stationCapacity, 0, stationMaxAngle);
    if (startAngle != endAngle){
      arc(marginX + circleSpacingX * column, marginY + circleSpacingY * row, circleSize, circleSize, radians(startAngle -90), radians(endAngle -90));
    }
    // Available bikes
    fill(255, 148, 0, 200);
    startAngle = endAngle;
    endAngle = endAngle + map(bikes, 0, stationCapacity, 0, stationMaxAngle);
    if (startAngle != endAngle){
      arc(marginX + circleSpacingX * column, marginY + circleSpacingY * row, circleSize, circleSize, radians(startAngle -90), radians(endAngle -90));
    }
    // Available docks
    fill(0, 126, 178, 150);
    startAngle = endAngle;
    endAngle = endAngle + map(docks, 0, stationCapacity, 0, stationMaxAngle);
    if (startAngle != endAngle){
      arc(marginX + circleSpacingX * column, marginY + circleSpacingY * row, circleSize, circleSize, radians(startAngle -90), radians(endAngle -90));
    }
    // Broken docks
    fill(0, 126, 178, 20);
    startAngle = endAngle;
    endAngle = endAngle + map(docksDis, 0, stationCapacity, 0, stationMaxAngle);
    if (startAngle != endAngle){
      arc(marginX + circleSpacingX * column, marginY + circleSpacingY * row, circleSize, circleSize, radians(startAngle -90), radians(endAngle -90));
    }
    stroke(230);
    fill(255);
    ellipse(marginX + circleSpacingX * column, marginY + circleSpacingY * row, circleSize/2, circleSize/2);
    noFill();
    ellipse(marginX + circleSpacingX * column, marginY + circleSpacingY * row, circleSize, circleSize);
  }
}
