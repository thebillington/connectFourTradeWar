var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');var app = express();
var server = http.Server(app);

var io = socketIO(server);app.set('port', 5000);

var lobbies = [];
var connections = {};

var fps = 20;

var gravity = 0.2;

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

setInterval(function() {
    io.sockets.emit('lobbies', lobbies);
  }, 1000);

io.on("connection", function(connection) {
  connections[connection.id] = connection;
  connection.on("newLobby", function(username) {
    lobbies.push(Lobby(connection.id, username));
  });
  connection.on("joinLobby", function(_host) {
    var inLobby = false;
    var lobby;
    for (var i = 0; i < lobbies.length; i++) {
      if (lobbies[i]. host == _host) {
        lobby = lobbies[i];
        lobbies[i].full = true;
        lobbies[i].playerID = connection.id;
        inLobby = true;
        break;
      }
    }
    connection.emit("inLobby", inLobby);
    if (inLobby) {
      startGame(connections[lobby.hostID], connection, lobby);
    }
  });
  connection.on("fire", function(endX, endY, startX, startY) {
    dx = (startX - endX) * 0.5;
    dy = (startY - endY) * 0.5;
    for (var i = 0; i < lobbies.length; i++) {
      if (lobbies[i].hostID == connection.id && lobbies[i].full) {
        lobbies[i].objects.push(Circle(15,80,dx,dy,3.5,"red","projectile"));
        break;
      }
      if (lobbies[i].playerID == connection.id && lobbies[i].full) {
        lobbies[i].objects.push(Circle(85,80,dx,dy,3.5,"yellow", "projectile"));
        break;
      }
    }
  });
});

function startGame(host, player, lobby) {

  lobby.objects = [
    Rectangle(5, 80, 0, 0, 5, 5, "grey", "hostTurret"),
    Rectangle(85, 80, 0, 0, 5, 5, "grey", "playerTurret")
  ];

  lobby.gameBoard = [
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""]
  ];

  setInterval(function() {
      updateObjects(lobby.objects);
      host.emit('objects', lobby.objects);
      player.emit('objects', lobby.objects);
      host.emit('gameBoard', lobby.gameBoard);
      player.emit('gameBoard', lobby.gameBoard);
    }, 1000/fps);
}

function Lobby(connectionID, hostName) {
  return {hostID: connectionID, playerID: null, host: hostName, full: false, objects: [], gameBoard: []};
}

function Circle(_x, _y, _dx, _dy, _radius, _colour, _id) {
  return {x: _x, y: _y, dx: _dx, dy: _dy, r: _radius, c: _colour, type: "circle", id: _id};
}

function Rectangle(_x, _y, _dx, _dy, _width, _height, _colour, _id) {
  return {x: _x, y: _y, dx: _dx, dy: _dy, w: _width, h: _height, c: _colour, type: "rect", id: _id};
}

function updateObjects(objects) {
  for (var i = objects.length - 1; i > -1; i--) {
    if(objects[i].dy < 2.5 && objects[i].id == "projectile") objects[i].dy += gravity;
    objects[i].x += objects[i].dx;
    objects[i].y += objects[i].dy;
    if (objects[i].y < 10) {
      objects.splice(i, 1);
    }
  }
}