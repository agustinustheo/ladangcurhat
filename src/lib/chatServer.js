const socketio = require('socket.io');
const assignGuestNumber = require('./helpers/assignGuestNumber');
const assignUsername = require('./helpers/assignUsername')
const handleMessageBroadcasting = require('./helpers/handleMessageBroadcasting');
let guestNumber = 1;
let nickNames = {};
let namesUsed = [];

exports.listen = function(server) {
  io = socketio.listen(server);

  io.on('connection', function(socket){
    console.log('a user connected');
    // When client connects, send it its socket id
    socket.emit('connected', {
      clientID: socket.id
    });
    //receive authentication data from client
    socket.on('authentication', function(authData) {
      console.log(authData)
      // if user is authenticated
      if(authData.authenticated) {
        assignUsername(socket, authData.username);
      } else {
        // Assign it a guest name
        guestNumber = assignGuestNumber(socket, guestNumber, nickNames, namesUsed);
      }
    });

    handleMessageBroadcasting(io, socket, nickNames);

    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  });
}