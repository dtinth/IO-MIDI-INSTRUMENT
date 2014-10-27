$(function toolbar() {

  var el = document.getElementById('head'), i
  var footerEl = document.getElementById('foot')

  text('Transpose')
  for (i = -6; i <= 6; i ++) {
    button((i > 0 ? '+' : '') + i, setTranspose(i), eq(Options.transpose, i))
  }

  text('Octave')
  for (i = 0; i <= 5; i ++) {
    button(i + '', setOctave(i), eq(Options.octave, i))
  }

  foot('CC80', 'cc').changes().onValue(cc(80))
  foot('CC81', 'cc').changes().onValue(cc(81))
  foot('CC82', 'cc').changes().onValue(cc(82))
  foot('CC83', 'cc').changes().onValue(cc(83))

  function eq(stream, value) {
    return stream.map(function(streamValue) {
      return streamValue == value
    })
  }

  function cc(number) {
    return function(value) {
      midi.control(1, number, value ? 0x7F : 0x00)
    }
  }

  function setTranspose(transpose) {
    return function() {
      Options.transpose.set(transpose)
    }
  }

  function setOctave(octave) {
    return function() {
      Options.octave.set(octave)
    }
  }

  function text(t) {
    $('<div class="text"></div>').html(t).appendTo(el)
  }

  function foot(t, attribute) {
    var $button = $('<div class="button"></div>').html(t).appendTo(footerEl)
    var buttonEl = $button[0]
    buttonEl.dataset.touchTarget = attribute
    footerEl.appendChild(buttonEl)

    var active = touchedTargets.map(function(elements) {
      return _.contains(elements, buttonEl)
    }).skipDuplicates()

    active.onValue(UIData.active(buttonEl))
    return active
  }

  function button(t, actionFn, active) {
    var buttonEl = $('<div class="button"></div>').html(t).appendTo(el)[0]
    var registered = false
    buttonEl.addEventListener('touchstart', function() {
      if (registered) return
      registered = true
    })
    buttonEl.addEventListener('touchend', function() {
      if (!registered) return
      registered = false
      actionFn()
    })
    active.onValue(UIData.active(buttonEl))
  }

})

