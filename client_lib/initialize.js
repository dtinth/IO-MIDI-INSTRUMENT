
var socket = new Socket()

var midi = new MIDI()

midi.onmessage = (function() {

  var queue = null

  midi.batch = function(callback) {
    midi.batch.begin()
    callback()
    midi.batch.end()
  }

  midi.batch.start = function() {
    if (queue) throw new Error("Nested batch!")
    queue = []
  }

  midi.batch.end = function() {
    if (!queue) throw new Error("No batch started!")
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

