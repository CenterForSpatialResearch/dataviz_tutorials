// Declare the array to hold the ojects
var bouncingEllipse = [];

function bounce() {
  // Properties
  this.positionX = random(0, width);
  this.positionY = random(0, height);
  this.diameter = 20;
  this.speedX = random(-5, 5);
  this.speedY = random(-5, 5);

  // Functions
  this.drawEllipse = function() {
    fill(255);
    ellipse(this.positionX, this.positionY, this.diameter, this.diameter);
  }
  this.updatePosition = function() {
    if (this.positionX > width) {
      this.speedX = this.speedX * -1;
    }
    if (this.positionX < 0) {
      this.speedX = this.speedX * -1;
    }
    if (this.positionY > height) {
      this.speedY = this.speedY * -1;
    }
    if (this.positionY < 0) {
      this.speedY = this.speedY * -1;
    }
    this.positionX += this.speedX;
    this.positionY += this.speedY;
  }
}

function setup() {
  createCanvas(800, 450);
  background(0);
  for (var i = 0; i < 20; i++) {
    bouncingEllipse.push(new bounce()) // Create multiple objects and add them to the array
  }
}

function draw() {
  background(0);
  // For each object in the array, call the two functions
  for (var i = 0; i < bouncingEllipse.length; i++) {
    bouncingEllipse[i].drawEllipse();
    bouncingEllipse[i].updatePosition();
  }
}
