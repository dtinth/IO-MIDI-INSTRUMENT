
/*global io */
var socket = io.connect('/');

/**
 * UI Binding
 */
var Bindings = (function() {

  var bindings = { }
  var fns = [ ]

  bindings.check = function() {
    fns.forEach(function(fn) {
      fn()
    })
  }

  bindings.add = function(fn) {
    fns.push(fn)
  }

  bindings.watch = function(val, change) {
    var changer = Changer(change)
    return bindings.add(function() {
      changer(val())
    })
  }

  function Changer(fn) {
    var old = { }
    return function(val) {
      if (val === old) return
      try {
        fn(val, old)
      } finally {
        old = val
      }
    }
  }

  return bindings
  
})()

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
  var footerEl = document.getElementById('foot')

  text('Transpose')
  for (i = -6; i <= 6; i ++) {
    button((i > 0 ? '+' : '') + i, setTranspose(i), State.watch.transpose(i))
  }

  text('Octave')
  for (i = 0; i <= 5; i ++) {
    button(i + '', setOctave(i), State.watch.octave(i))
  }

  foot('2', 'addition', 2)
  foot('m', 'addition', 3)
  foot('M', 'addition', 4)
  foot('4', 'addition', 5)
  foot('5', 'addition', 7)
  foot('6', 'addition', 9)
  foot('7', 'addition', 10)
  foot('7M', 'addition', 11)

  function setTranspose(transpose) {
    return function() {
      State.transpose = transpose
      Bindings.check()
    }
  }

  function setOctave(octave) {
    return function() {
      State.octave = octave
      Bindings.check()
    }
  }

  function text(t) {
    el.appendChild(C('text', t))
  }

  function foot(t, attribute, value) {
    var buttonEl = C('button', t)
    buttonEl.setAttribute('data-' + attribute, value)
    footerEl.appendChild(buttonEl)
  }

  function button(t, actionFn, watchFn) {
    var buttonEl = C('button', t)
    var registered = false
    buttonEl.ontouchstart = function() {
      if (registered) return
      registered = true
    }
    buttonEl.ontouchend = function() {
      if (!registered) return
      registered = false
      actionFn()
    }
    Bindings.watch(watchFn, UI.active(buttonEl))
    el.appendChild(buttonEl)
  }

}

function percent(value) {
  return (value * 100).toFixed(2) + '%'
}

/**
 * The state of the application.
 */
var State = {
      notes: { },
      octave: 2,
      transpose: 0,
      watch: {
        key: function(key) {
          return function() {
            return !!State.notes[toNote(key)]
          }
        },
        octave: function(value) {
          return function() {
            return State.octave == value
          }
        },
        transpose: function(value) {
          return function() {
            return State.transpose == value
          }
        }
      }
    }

var UI = {
      attr: function(attribute) {
        return function(element) {
          return function(val) {
            element.setAttribute('data-' + attribute, val ? 1 : 0)
          }
        }
      }
    }

UI.pressed = UI.attr('pressed')
UI.active  = UI.attr('active')

/**
 * Sets up the keys.
 */
function keyboard() {

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

    function Note(className, key) {
      var noteEl = C(className)
      noteEl.setAttribute('data-key', key)
      Bindings.watch(State.watch.key(key), UI.pressed(noteEl))
      return noteEl
    }

    function make(key, index) {
      var noteEl = Note('white', key)
      assign(noteEl.style, {
        left:   percent(index / white.length),
        right:  percent((white.length - 1 - index) / white.length)
      })
      el.appendChild(noteEl)
      if (black[index]) {
        makeBlack(key + 1, index)
      }
    }
    
    function makeBlack(key, index) {
      var noteEl = Note('black', key)
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

function keys(object) {
  var out = [ ]
  forOwn(object, function(key) {
    out.push(key)
  })
  return out
}

function assign(dest, src) {
  forOwn(src, function(i) {
    dest[i] = src[i]
  })
}

window.onload = function() {
  toolbar()
  keyboard()
  Bindings.check()
}

window.ontouchstart = window.ontouchmove = window.ontouchend = function(e) {
  updateTouches(e.touches)
  return false
}

function toNote(key) {
  return +key + (1 + State.octave) * 12 + State.transpose
}


function updateTouches(touches) {

  var notes = { }
  var additions = [ ]

  for (var i = 0; i < touches.length; i ++) {
    var c = touches[i]
    var el = document.elementFromPoint(c.clientX, c.clientY)
    if (el && el.getAttribute('data-key')) {
      notes[toNote(el.getAttribute('data-key'))] = true
    }
    if (el && el.getAttribute('data-addition')) {
      additions.push(adder(+el.getAttribute('data-addition')))
    }
  }

  var originalNotes = keys(notes).map(function(x) { return +x })

  try {
    additions.forEach(function(fn) {
      fn(originalNotes, notes)
    })
  } catch (e) {
    log('' + e)
  }

  function adder(offset) {
    return function(orig, notes) {
      orig.forEach(function(note) {
        note -= State.transpose
        var target = note + offset
        notes[State.transpose + target % 12 + (note - note % 12)] = true
      })
    }
  }

  updateMidi(notes)
  Bindings.check()

}

function updateMidi(notes) {
  forOwn(State.notes, function(note) {
    if (!notes[note]) {
      socket.emit('midi', 1, +note, 0)
    }
  })
  forOwn(notes, function(note) {
    if (!State.notes[note]) {
      socket.emit('midi', 1, +note, 127)
    }
  })
  State.notes = notes
}

function log(text) {
  document.getElementById('debug').innerHTML = text
}


