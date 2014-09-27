
var touches = (function() {

  var bus = new Bacon.Bus()

  document.addEventListener('touchstart', check)
  document.addEventListener('touchmove', check)
  document.addEventListener('touchend', check)

  return bus.toProperty([])

  function check(e) {
    bus.push(e.touches)
    e.preventDefault()
    e.stopPropagation()
  }

})()

