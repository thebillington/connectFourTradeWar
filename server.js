var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');var app = express();
var server = http.Server(app);

var io = socketIO(server);app.set('port', 5000);

var lobbies = [];
connections = {};

var fps = 20;

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
  // connection.on("fire", function(x,y, dx, dy) {
  //   objects.push(Circle(x,y,dx,dy,2,"red"));
  // });
});

function startGame(host, player, lobby) {
  lobby.objects = [
    Rectangle(10, 80, 0, 0, 10, 5, "grey", "turret"),
    Rectangle(80, 80, 0, 0, 10, 5, "grey", "turret")
  ];

  setInterval(function() {
      updateObjects(lobby.objects);
      host.emit('objects', lobby.objects);
      player.emit('objects', lobby.objects);
    }, 1000/fps);
}

function Lobby(connectionID, hostName) {
  return {hostID: connectionID, playerID: null, host: hostName, full: false, objects: []};
}

function Circle(_x, _y, _dx, _dy, _radius, _colour, _id) {
  return {x: _x, y: _y, dx: _dx, dy: _dy, r: _radius, c: _colour, type: "circle", id: _id};
}

function Rectangle(_x, _y, _dx, _dy, _width, _height, _colour, _id) {
  return {x: _x, y: _y, dx: _dx, dy: _dy, w: _width, h: _height, c: _colour, type: "rect", id: _id};
}

function updateObjects(objects) {
  for (var i = 0; i < objects.length; i++) {
    objects[i].x += objects[i].dx;
    objects[i].y += objects[i].dy;
  }
}