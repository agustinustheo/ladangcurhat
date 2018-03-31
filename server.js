const express = require('express');
const app = express();
const server = require('http').Server(app);
const chatServer = require('./src/lib/chatServer');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const port = process.env.PORT || 4500;

app.use('/stylesheet', express.static(__dirname + '/public/stylesheet/'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css/'));
app.use('/js', express.static(__dirname + '/public/js/'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/signup', function(req, res) {
  res.sendFile(__dirname + '/public/signup.html');
});
app.post('/signup', jsonParser, function(req, res) {
  res.send({ message: 'got your request', request: req.body });
});

server.listen(port, function(){
  console.log('Server on port ' + port);
});

chatServer.listen(server);