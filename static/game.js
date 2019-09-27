var socket = io();
var objects = [];

socket.on('objects', function(_objects) {
  objects = _objects;
});

function setup() {
  createCanvas(windowHeight,windowHeight);
  document.getElementById('lobby').style.width = windowWidth - windowHeight - 4;
  document.getElementById('lobby').style.height = windowHeight - 4;
}

function draw() {
  clear();
  background(220);
  for (var i = 0; i < objects.length; i++) {
    if (objects[i].type == "circle") {
      drawCircle(objects[i]);
    }
    if (objects[i].type == "rect") {

    }
  }
}

function drawCircle(circle) {
  fill(circle.c);
  ellipse(circle.x, circle.y, (circle.r / 100) * windowHeight, (circle.r / 100) * windowHeight);
}

function mouseClicked() {
  socket.emit("click", [mouseX, mouseY]);
}