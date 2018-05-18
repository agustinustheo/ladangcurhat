module.exports = function(socket, username) {
  socket.emit('nameResult', {
    success: true,
    name: username
  })
}