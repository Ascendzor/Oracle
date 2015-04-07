var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var gridWidth = 16;
var grid = new Array(gridWidth);
for(x=0; x<gridWidth; x++) {
	grid[x] = new Array(gridWidth);
	for(y=0; y<gridWidth; y++) {
		grid[x][y] = new Array(3);
		for(z=0; z<3; z++) {
			grid[x][y][z] = 0;
		}
	}
}

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname + '/' })
})

app.get('/style.css', function (req, res) {
	res.sendFile('style.css', { root: __dirname + '/' });
});

var server = app.listen(13337, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

io = io.listen(server);
io.on('connection', function(socket){
	socket.on('boxClicked', function (boxCoords) {
		var a = boxCoords.x;
		var b = boxCoords.y;
		for(var y =0;y<3;y++) {
			grid[a][b][y] -=15;
			if(grid[a][b][y] <0) grid[a][b][y] =0;
		}
		
		grid[a][b][boxCoords.faction] += 30;
		
		if(grid[a][b][boxCoords.faction] > 255) grid[a][b][boxCoords.faction] = 255;
		
		io.emit('boxClicked', boxCoords);
	});
	
	socket.on('join', function (data) {
		io.emit('join', grid);
	});
});