var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname + '/' })
})

var server = app.listen(13337, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

io = io.listen(server);
io.on('connection', function(socket){
  socket.on('boxClicked', function (boxCoords) {
	io.emit('boxClicked', boxCoords);
  });
});