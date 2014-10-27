
var touchedTargets = touchedElements.map(function(elements) {
  return elements.filter(function(element) {
    return !!element.dataset.touchTarget
  })
})

var touchedTargetsOf = function(type) {
  return touchedTargets.map(function(elements) {
    return elements.filter(function(element) {
      return element.dataset.touchTarget == type
    })
  })
}

