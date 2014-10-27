
function MIDI(onmessage) {

  this.onmessage = onmessage

}

;(function() {

  var ch = function(base, channel) {
    return (base & 0xF0) | ((channel - 1) & 0x0F)
  }

  var d = function(data) {
    return (data & 0x7F)
  }

  MIDI.prototype.send = function() {
    this.onmessage([].slice.call(arguments))
  }

  MIDI.prototype.noteOn = function(channel, note, velocity) {
    this.send(ch(0x90, channel), d(note), d(velocity))
  }

  MIDI.prototype.noteOff = function(channel, note, velocity) {
    this.send(ch(0x80, channel), d(note), d(velocity))
  }

  MIDI.prototype.control = function(channel, number, value) {
    this.send(ch(0xB0, channel), d(number), d(value))
  }

  MIDI.prototype.program = function(channel, program) {
    this.send(ch(0xB0, channel), d(program))
  }

  MIDI.prototype.pressure = function(channel, note, velocity) {
    if (typeof velocity == 'number') {
      this.polyphonicKeyPressure(channel, note, velocity)
    } else {
      velocity = note
      this.channelPressure(channel, velocity)
    }
  }

  MIDI.prototype.polyphonicKeyPressure = function(channel, note, velocity) {
    this.send(ch(0xA0, channel), d(note), d(velocity))
  }

  MIDI.prototype.channelPressure = function(channel, velocity) {
    this.send(ch(0xD0, channel), d(velocity))
  }

  MIDI.prototype.pitchBend = function(channel, pitch) {
    var data = Math.round((pitch + 1) / 2 * 0x4000)
    data = Math.min(0x3FFF, Math.max(0x0000, data))
    this.send(ch(0xE0, channel), d(data & 0x7F), d(data >> 7))
  }

  MIDI.prototype.poly = function(channel) {
    this.control(channel, 0x7F, 0x00)
  }

})()

