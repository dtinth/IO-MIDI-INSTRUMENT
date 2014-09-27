
var http = require('http')
var Application = require('./app')

exports.create = function createServer() {

  var app = Application.create()
    , server = http.createServer(app)
    , io = require('socket.io').listen(server)

  io.sockets.on('connection', function(socket) {
    socket.on('midi', function(messages) {
      messages.forEach(function(message) {
        server.emit('midi', message)
      })
    })
  })

  server.io = io

  return server

}

