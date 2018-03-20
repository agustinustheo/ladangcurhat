const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const hostname = '127.0.0.1';
const port = 4500;

app.use(express.static('public'));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
  });
  
  io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('chat message', function(msg) {
      io.emit('chat message', msg);
    });
  });
  
  http.listen(port, function(){
    console.log('Server on port 4500');
  });