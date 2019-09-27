var socket = io();
var objects = [];
var lobbies = [];
var username;

var inLobby = false;
var host = false;

var mouseDownX;
var mouseDownY;

socket.on('lobbies', function(_lobbies) {
  lobbies = _lobbies;
  updateLobbies();
});

socket.on('objects', function(_objects) {
  objects = _objects;
});

socket.on('inLobby', function(_inLobby) {
  inLobby = _inLobby;
  document.getElementById('createLobby').style.display = "none";
});

function setup() {
  createCanvas(windowHeight,windowHeight);
  document.getElementById('lobby').style.width = windowWidth - windowHeight - 4;
  document.getElementById('lobby').style.height = windowHeight - 4;
  document.getElementById('username').value = newID();
}

function draw() {
  clear();
  background(220);
  for (var i = 0; i < objects.length; i++) {
    if (objects[i].type == "circle") {
      drawCircle(objects[i]);
    }
    if (objects[i].type == "rect") {
      drawRect(objects[i]);
    }
  }
}

function drawCircle(circle) {
  fill(circle.c);
  ellipse((circle.x/100) * windowHeight, (circle.y/100) * windowHeight, (circle.r / 100) * windowHeight, (circle.r / 100) * windowHeight);
}

function drawRect(rectangle) {
  fill(rectangle.c);
  rect((rectangle.x/100) * windowHeight, (rectangle.y/100) * windowHeight, (rectangle.w/100) * windowHeight, (rectangle.h/100) * windowHeight);
}

function mousePressed() {
  if(inLobby) {
    checkClickedTurret(mouseX, mouseY);
  }
}

function mouseReleased() {
  if(inLobby) {
    var point = translatePointToPercentage(mouseX, mouseY);
    socket.emit("fire", point.x, point.y, mouseDownX, mouseDownY);
  }
}

function updateLobbies() {
  var lobbyText = "<ul>";
  for (var i = 0; i < lobbies.length; i++) {
    lobbyText += "<li>" + lobbies[i].host;
    if (!lobbies[i].full && !inLobby) {
      lobbyText += ": <button onclick=joinLobby('" + lobbies[i].host + "')>Join</button>";
    }
    lobbyText += "</li>";
  }
  lobbyText += "</ul>";
  document.getElementById('lobbies').innerHTML = lobbyText;
}

function createLobby() {
  if (!inLobby) {
    username = document.getElementById('username').value;
    socket.emit("newLobby", username);
    inLobby = true;
    document.getElementById('createLobby').style.display = "none";
    host = true;
  }
}

function joinLobby(host) {
  socket.emit('joinLobby', host);
}

function newID() {
  return '_' + Math.random().toString(36).substr(2, 9);
};

function checkClickedTurret(x, y) {
  if (host) {
    var turret = objects[0];
  } else {
    turret = objects[1];
  }
  var point = translatePointToPercentage(x,y);
  if (pointCollidesRect(point, turret)) {
    mouseDownX = point.x;
    mouseDownY = point.y;
  }
}

function pointCollidesRect(point, rect) {
  return point.x > rect.x && point.x < rect.x + rect.w && point.y > rect.y && point.y < rect.y + rect.h;
}

function translatePointToPercentage(x, y) {
  return {x: (x / windowHeight) * 100, y: (y / windowHeight) * 100};
}