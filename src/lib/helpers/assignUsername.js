module.exports = function(socket, username, nickNames) {
  nickNames[socket.id] = username;
  socket.emit('nameResult', {
    success: true,
    name: username
  });
}