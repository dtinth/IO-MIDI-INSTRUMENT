
var UIData = {
  attr: function(attribute) {
    return function(element) {
      return function(val) {
        element.dataset[attribute] = val ? 1 : 0
      }
    }
  }
}

UIData.pressed = UIData.attr('pressed')
UIData.active  = UIData.attr('active')
