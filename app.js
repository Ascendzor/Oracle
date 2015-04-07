var express = require('express');
var app = express();
  
app.get('/', function (req, res) {
  res.sendfile('index.html', { root: __dirname + '/' })
})

app.get('/derp', function (req, res) {
	res.send('derp')
	console.log('harrow')
})

var server = app.listen(1337, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});