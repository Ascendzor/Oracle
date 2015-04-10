var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var gridWidth = 16;
var grid = new Array(gridWidth);
var colorCount = new Array(3);
var maxCount = gridWidth * gridWidth;

function StartBoard() {
	for(x=0; x<gridWidth; x++) {
		grid[x] = new Array(gridWidth);
		for(y=0; y<gridWidth; y++) {
			grid[x][y] = new Array(3);
			for(z=0; z<3; z++) {
				grid[x][y][z] = 0;
			}
		}
		
	}
	for(var x = 0; x<3;x++){
		colorCount[x] = 1;
	}
	grid[0][0][0] = 255;
	grid[0][gridWidth -1][1] = 255;
	grid[gridWidth -1 ][Math.floor(gridWidth/2)][2] = 255;
}

StartBoard();

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
			if(grid[a][b][y] == 150) colorCount[y] --;
			grid[a][b][y] -=15;
			if(grid[a][b][y] <0) grid[a][b][y] =0;
		}
		grid[a][b][boxCoords.faction] += 30;
		if(grid[a][b][boxCoords.faction] > 255) grid[a][b][boxCoords.faction] = 255;
		if(grid[a][b][boxCoords.faction] == 165) colorCount[boxCoords.faction] +=2;
		
		var EndGameTest = false;
		for(var x =0;x<3;x++)
		{
			if(colorCount[x] == maxCount)
			{
				EndGameTest = true;
				break;
			}
		}
		if(EndGameTest){
			StartBoard();
			io.emit('join', grid , true);
		}
		else io.emit('boxClicked', boxCoords);
	});
	
	socket.on('join', function (data) {
		io.emit('join', grid ,false);
	});
});