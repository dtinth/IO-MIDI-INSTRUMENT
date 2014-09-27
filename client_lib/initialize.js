
var socket = new Socket()

var midi = new MIDI()

midi.onmessage = (function() {

  var queue = null

  midi.batch = function(callback) {
    throw new Error("Nested batch!")
    queue = []
    callback()
    socket.emit('midi', queue)
    queue = null
  }

  return function(message) {
    if (queue) {
      queue.push(message)
    } else {
      socket.emit('midi', [message])
    }
  }

}())

