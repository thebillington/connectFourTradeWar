var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');var app = express();
var server = http.Server(app);

var io = socketIO(server);app.set('port', 5000);

var objects = [];

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

io.on("connection", function(connection) {
  connection.on("click", function(data) {
    objects.push(Circle(data[0],data[1],0,0,5,"red"));
  });
});

function Circle(_x, _y, _dx, _dy, _radius, _colour) {
  return {x: _x, y: _y, dx: _dx, dy: _dy, r: _radius, c: _colour, type: "circle"};
}

function Rectangle(_x, _y, _dx, _dy, _width, _height, _colour) {
  return {x: _x, y: _y, dx: _dx, dy: _dy, w: _width, h: _height, c: _colour, type: "rect"};
}