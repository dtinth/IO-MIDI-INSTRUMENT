
var touchedElements = touches.map(function(touchList) {
  
  var elements = _.map(touchList, function(touch) {
    return document.elementFromPoint(touch.clientX, touch.clientY)
  })

  return _.uniq(_.compact(elements))

})

