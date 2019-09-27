var socket = io();

var objects = [];

socket.on('objects', function(_objects) {
  objects = _objects;
});

function setup() {
  createCanvas(400,400);
}

function draw() {
  clear();
  console.log(objects);
  for (var i = 0; i < objects.length; i++) {
    if (objects[i].type == "circle") {
      drawCircle(objects[i]);
    }
    if (objects[i].type == "rect") {

    }
  }
}

function drawCircle(circle) {
  console.log(circle);
  fill(circle.c);
  ellipse(circle.x, circle.y, circle.r, circle.r);
}

function mouseClicked() {
  socket.emit("click", [mouseX, mouseY]);
}