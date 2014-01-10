
var connect = require('connect')
var midi = require('midi')

var app = connect.createServer()
app.use(connect.static(__dirname + '/static'))

var http = require('http')
  , server = http.createServer(app)

var io = require('socket.io').listen(server)
var output = new midi.output()
output.openVirtualPort('IO MIDI INSTRUMENT')

var port = Number(process.env.PORT) || 9998

server.listen(port)
console.log("Listening on port", port)

io.sockets.on('connection', function(socket) {
  socket.on('midi', function(channel, note, volume) {
    output.sendMessage([144 + channel, note, volume])
  })
})


