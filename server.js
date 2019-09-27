var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');var app = express();
var server = http.Server(app);

var io = socketIO(server);app.set('port', 5000);

var lobbies = [];

var objects = [
  Rectangle(10, 80, 0, 0, 15, 15, "grey", "turret"),
  Rectangle(10, 80, 0, 0, 15, 15, "grey", "turret")
];

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

setInterval(function() {
    io.sockets.emit('objects', objects);
  }, 1000/20);

  setInterval(function() {
      io.sockets.emit('lobbies', lobbies);
    }, 1000);

io.on("connection", function(connection) {
  connection.on("newLobby", function(username) {
    lobbies.push(Lobby(connection.id, username));
  });
  connection.on("joinLobby", function(_host) {
    var inLobby = false;
    for (var i = 0; i < lobbies.length; i++) {
      if (lobbies[i]. host == _host) {
        lobbies[i].full = true;
        lobbies[i].playerID = connection.id;
        inLobby = true;
      }
      break;
    }
    connection.emit("inLobby", inLobby);
  });
  connection.on("fire", function(x,y, dx, dy) {
    objects.push(Circle(x,y,dx,dy,2,"red"));
  });
});

function Lobby(connectionID, hostName) {
  return {hostID: connectionID, playerID: null, host: hostName, full: false};
}

function Circle(_x, _y, _dx, _dy, _radius, _colour, _id) {
  return {x: _x, y: _y, dx: _dx, dy: _dy, r: _radius, c: _colour, type: "circle", id: _id};
}

function Rectangle(_x, _y, _dx, _dy, _width, _height, _colour, _id) {
  return {x: _x, y: _y, dx: _dx, dy: _dy, w: _width, h: _height, c: _colour, type: "rect", id: _id};
}