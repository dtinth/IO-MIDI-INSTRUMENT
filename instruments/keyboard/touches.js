
var touches = (function() {

  var bus = new Bacon.Bus()

  document.addEventListener('touchstart', check)
  document.addEventListener('touchmove', check)
  document.addEventListener('touchend', check)

  return bus.toProperty([])

  function check(e) {
    midi.batch.start()
    bus.push(e.touches)
    midi.batch.end()
    e.preventDefault()
    e.stopPropagation()
  }

})()

