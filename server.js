
var midi = require('midi')
  , output = new midi.output()
  , server = require('./lib/server').create()

output.openVirtualPort('IO MIDI INSTRUMENT')

server.on('midi', function(message) {
  output.sendMessage(message)
})

var port = Number(process.env.PORT) || 9998
server.listen(port)

console.log("Listening on port", port)
