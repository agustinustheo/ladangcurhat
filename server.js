const express = require('express');
const app = express();
const server = require('http').Server(app);
const chatServer = require('./src/lib/chatServer');

const hostname = '127.0.0.1';
const port = 3000;

app.use('/stylesheet', express.static(__dirname + '/public/stylesheet/'));
app.use('/script', express.static(__dirname + '/public/script/'));
app.use('/images', express.static(__dirname + '/public/img/'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css/'));
app.use('/datatables', express.static(__dirname + '/node_modules/datatables.net/js/'));
app.use('/datatables_css', express.static(__dirname + '/node_modules/datatables.net-dt/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

server.listen(port, function(){
  console.log('Server on port 3000');
});

chatServer.listen(server);