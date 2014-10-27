
var LogicalKeys = { }

LogicalKeys.elements = touchedTargetsOf('key').map(function(elements) {
  return _.groupBy(elements, function(element) {
    return element.dataset.key
  })
})

LogicalKeys.keys = LogicalKeys.elements.map(function(groups) {
  return _.mapValues(groups, function(elements) {
    return elements.length > 0
  })
}).skipDuplicates(_.isEqual)

LogicalKeys.pressed = function(number) {
  return LogicalKeys.elements.map(function(groups) {
    return !!groups[number]
  }).skipDuplicates()
}
