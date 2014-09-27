
var socket = new Socket()

var midi = new MIDI((function() {

  var queue = null

  return function(message) {
    socket.emit('midi', [message])
  }

}()))

