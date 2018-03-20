const express = require('express');
const app = express();
const server = require('http').Server(app);
const chatServer = require('./src/lib/chatServer');

const hostname = '127.0.0.1';
const port = 4500;

app.use(express.static('public'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

server.listen(port, function(){
  console.log('Server on port 4500');
});

chatServer.listen(server);