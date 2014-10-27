
$(function() {
  
  function C(className, innerHTML) {
    var d = document.createElement('div')
    if (className) d.className = className
    if (innerHTML) d.innerHTML = innerHTML
    return d
  }

  function percent(value) {
    return (value * 100).toFixed(2) + '%'
  }

  var container = document.getElementById('main')

  row(0)
  row(1)
  row(2)

  function row(octave) {

    var el = C('row')
    _.assign(el.style, {
      top:    percent(octave / 3 + 0.02),
      height: percent(1 / 3 - 0.05)
    })

    var white = [-3, -1, 0, 2, 4, 5, 7, 9, 11, 12, 14, 16]
          .map(function(x) { return x + (2 - octave) * 12 })
    var black = [true, false, true, true, false, true, true, true, false, true, true]
    white.forEach(make)
    container.appendChild(el)

    function Note(className, key) {
      var noteEl = C(className)
      noteEl.setAttribute('data-touch-target', 'key')
      noteEl.setAttribute('data-key', key)
      LogicalKeys.pressed(key).onValue(UIData.pressed(noteEl))
      return noteEl
    }

    function make(key, index) {
      var noteEl = Note('white', key)
      _.assign(noteEl.style, {
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
      _.assign(noteEl.style, {
        left:   percent((index + 1) / white.length)
      })
      el.appendChild(noteEl)
    }

  }

})
