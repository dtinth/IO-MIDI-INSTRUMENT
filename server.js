
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
  socket.on('raw_midi', function() {
    var args = Array.prototype.slice.call(arguments)
    console.log('raw_midi', args)
    output.sendMessage(args)
  })
  socket.on('midi', function(channel, note, volume) {
    output.sendMessage([(volume == 0 ? 128 : 144) + channel, note, volume])
  })
  socket.on('note_on', function(channel, note, volume) {
    console.log('note_on', channel, note, volume)
    output.sendMessage([144 + channel, note, volume])
  })
  socket.on('note_off', function(channel, note, volume) {
    console.log('note_off', channel, note, volume)
    output.sendMessage([128 + channel, note, volume])
  })
})


