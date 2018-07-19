module.exports = function(io, socket, nickNames) {
  socket.on('chat message', function(msg) {
    io.emit('chat message', {
      message: msg,
      clientName: nickNames[socket.id],
      clientID: socket.id
    })
  })
}