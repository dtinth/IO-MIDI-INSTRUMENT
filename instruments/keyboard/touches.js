
var touches = (function() {

  var bus = new Bacon.Bus()

  document.addEventListener('touchstart', check)
  document.addEventListener('touchmove', check)
  document.addEventListener('touchend', check)

  return bus

  function check(e) {
    bus.push(e.touches)
  }

})()
