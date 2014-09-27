
function differences(stream) {

  var last = { }

  return stream.map(function(array) {

    var current = { }
    var additions = [ ]
    var removals = [ ]

    array.forEach(function(value) {
      current[value] = { value: value }
    })

    _.forOwn(current, function(object, key) {
      if (!last[key]) additions.push(object.value)
    })

    _.forOwn(last, function(object, key) {
      if (!current[key]) removals.push(object.value)
    })

    last = current

    return { additions: additions, removals: removals }

  })

}

