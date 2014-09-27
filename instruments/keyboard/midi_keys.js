
var MIDIKeys = { }

MIDIKeys.keys = LogicalKeys.keys
    .map(_.keys)
    .map(function(strings) {
      return strings.map(function(s) { return +s })
    })
    .combine(Options.octave, function(keys, octave) {
      var t = 12 * (1 + octave)
      return keys.map(function(c) { return c + t })
    })
    .combine(Options.transpose, function(keys, t) {
      return keys.map(function(c) { return c + t })
    })

differences(MIDIKeys.keys).onValue(function(info) {
  info.additions.forEach(function(note) {
    midi.noteOn(1, note, 127)
  })
  info.removals.forEach(function(note) {
    midi.noteOff(1, note, 127)
  })
})

