
var socket = io.connect('/');

/**
 * A utility function to create an element.
 */
function C(className, innerHTML) {
  var d = document.createElement('div')
  if (className) d.className = className
  if (innerHTML) d.innerHTML = innerHTML
  return d
}

/**
 * Sets up the toolbar.
 */
function toolbar() {

  var el = document.getElementById('head'), i

  text('Transpose')
  for (i = -6; i <= 6; i ++) button((i > 0 ? '+' : '') + i)

  text('Octave')
  for (i = 0; i <= 3; i ++) button(i)

  function text(t) {
    el.appendChild(C('text', t))
  }

  function button(t) {
    el.appendChild(C('button', t))
  }

}

function percent(value) {
  return (value * 100).toFixed(2) + '%'
}

/**
 * Sets up the keys.
 */
function keys() {

  var container = document.getElementById('main')

  row(0)
  row(1)
  row(2)

  function row(octave) {

    var el = C('row')
    assign(el.style, {
      top:    percent(octave / 3 + 0.02),
      bottom: percent((2 - octave) / 3 + 0.02)
    })

    var white = [-3, -1, 0, 2, 4, 5, 7, 9, 11, 12, 14, 16]
          .map(function(x) { return x + (2 - octave) * 12 })
    var black = [true, false, true, true, false, true, true, true, false, true, true]
    white.forEach(make)
    container.appendChild(el)

    function make(note, index) {
      var noteEl = C('white')
      noteEl.setAttribute('data-note', note)
      assign(noteEl.style, {
        left:   percent(index / white.length),
        right:  percent((white.length - 1 - index) / white.length)
      })
      el.appendChild(noteEl)
      if (black[index]) {
        makeBlack(note + 1, index)
      }
    }
    
    function makeBlack(note, index) {
      var noteEl = C('black')
      noteEl.setAttribute('data-note', note)
      assign(noteEl.style, {
        left:   percent((index + 1) / white.length)
      })
      el.appendChild(noteEl)
    }

  }

}

function forOwn(src, fn) {
  for (var i in src) {
    if (Object.prototype.hasOwnProperty.call(src, i)) {
      if (fn.call(src, i, src[i]) === false) return false
    }
  }
}

function assign(dest, src) {
  forOwn(src, function(i) {
    dest[i] = src[i]
  })
}

window.onload = function() {
  toolbar()
  keys()
}

window.ontouchstart = window.ontouchmove = window.ontouchend = function(e) {
  updateTouches(e.touches)
  return false
}

function updateTouches(touches) {
  var keys = { }
  for (var i = 0; i < touches.length; i ++) {
    var c = touches[i]
    var el = document.elementFromPoint(c.clientX, c.clientY)
    keys[el.getAttribute('data-note')] = true
  }
  updateMidi(keys)
}

var lkeys = { }
function toNote(key) {
  return +key + 48
}

function updateMidi(keys) {
  forOwn(lkeys, function(key) {
    if (!keys[key]) {
      var note = toNote(key)
      socket.emit('midi', 1, note, 0)
    }
  })
  forOwn(keys, function(key) {
    if (!lkeys[key]) {
      var note = toNote(key)
      socket.emit('midi', 1, note, 127)
    }
  })
  lkeys = keys
}

function log(text) {
  document.getElementById('debug').innerHTML = text
}


