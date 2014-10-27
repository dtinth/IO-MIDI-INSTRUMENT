
handlers = { }


$(window).on 'touchstart touchmove touchend', (event) ->

  event.stopPropagation()
  event.preventDefault()

  ids = { }

  for touch in event.touches
    ids[touch.identifier] = true
    (handlers[touch.identifier] or= new TouchHandler()).handle(event, touch)

  toRemove = [ ]

  for id, handler of handlers
    if not (id of ids)
      handler.off(event)
      toRemove.push id

  for id in toRemove
    delete handlers[id]


class TouchHandler

  handle: (event, touch) ->
    if @current
      if not @current.willHandle(event, touch)
        @current.off(event, touch)
        @current = null
      else
        @current.handle(event, touch)
    if not @current
      element = document.elementFromPoint(touch.clientX, touch.clientY)
      target = $(element).closest('[data-touch-target]')[0]
      if target
        handler = new TouchElementHandler(target)
        if handler.willHandle(event, touch)
          @current = handler
          @current.handle(event, touch)

  off: (event) ->
    if @current
      @current.off(event, null)

  _clearTarget: (event, touch) ->
    try
      @target.off(event, touch) if @target
    finally
      @target = null


class TouchElementHandler

  nextId = 1

  constructor: (@element) ->
    @$element = $(@element)
    @id = nextId++

  willHandle: (event, touch) ->
    @_isTouchingElement(touch)

  handle: (event, touch) ->
    if @_isOn
      @$element.trigger('touch:move', [event, touch, @id])
    else
      @_isOn = true
      @$element.trigger('touch:on', [event, touch, @id])

  off: (event, touch) ->
    @$element.trigger('touch:off', [event, touch, @id])

  _isTouchingElement: (touch) ->
    element = document.elementFromPoint(touch.clientX, touch.clientY)
    element is @element or $.contains(@element, element)
    

