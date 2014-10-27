
Actions = window.Actions = { }

Actions.drum = (note) ->
  ({ type, x, y }) ->
    velocity = Math.pow(1 - 2 * (Math.pow(x / 2, 2) + Math.pow(y / 2, 2)), 1.5)
    if type == 'glissando'
      velocity = (velocity / 2) + 0.5
    midi.noteOn(10, note, velocity * 127)
    midi.noteOff(10, note, velocity * 127)


