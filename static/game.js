var socket = io();
var objects = [];
var lobbies = [];
var username;

var inLobby = false;

socket.on('lobbies', function(_lobbies) {
  lobbies = _lobbies;
  updateLobbies();
});

socket.on('objects', function(_objects) {
  objects = _objects;
});

socket.on('inLobby', function(_inLobby) {
  inLobby = inLobby;
  if (inLobby) {
    document.getElementById('createLobby').style.display = "none";
  }
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

    }
  }
}

function drawCircle(circle) {
  fill(circle.c);
  ellipse(circle.x, circle.y, (circle.r / 100) * windowHeight, (circle.r / 100) * windowHeight);
}

function mouseClicked() {
  socket.emit("fire", mouseX, mouseY, 0, 0);
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
  }
}

function joinLobby(host) {
  socket.emit('joinLobby', host);
}

function newID() {
  return '_' + Math.random().toString(36).substr(2, 9);
};