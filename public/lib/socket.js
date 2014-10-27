
function Socket() {

  var socket = io.connect('/')
  randomlySendJunkToKeepConnectionActive()

  return socket

  function randomlySendJunkToKeepConnectionActive() {
    setTimeout(function send() {
      socket.emit('junk', 'junk')
      setTimeout(send, 200 + Math.random() * 300)
    }, 1000)
  }

}
