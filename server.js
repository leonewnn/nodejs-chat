var express = require('express');
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , { Server } = require('socket.io'); // Destructure and import the Server class

var io = new Server(server);  // Instantiate the Server class with the HTTP server instance

var PORT = process.env.PORT || 8080;

server.listen(PORT, function() {
    console.log("Listening on " + PORT)
});

app.set('view options', {
    layout: false
});

app.use(express.static(__dirname + '/static'));

app.get('/', function(request, response) {
    response.render('main.pug');
});

require('./io')(io);
