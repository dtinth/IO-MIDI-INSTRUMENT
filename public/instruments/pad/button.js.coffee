

class window.ButtonController

  LOG = (options) ->
    console.log options
    ->

  constructor: (i, j) ->
    @model = new Bacon.Model(
      text: "#{i}#{j}"
      action: LOG)
    
  configure: (options) ->
    @model.modify (value) ->
      _.assign({ }, value, options)


class window.ButtonView

  TEMPLATE = '''
    <div class="button">
      <div class="button--text">-</div>
    </div>
  '''

  constructor: (i, j, @model) ->

    @$element = $(TEMPLATE)
      .addClass("row-#{i}").addClass("column-#{j}")
      .attr('data-touch-target', 'glissando')

    @$element.asEventStream('touch:on').map(1).merge(
        @$element.asEventStream('touch:off').map(-1))
      .scan(0, (count, n) -> count + n)
      .map((count) -> count > 0)
      .skipDuplicates()
      .onValue((active) => @$element.toggleClass 'is-active', active)

    @model.lens('text').skipDuplicates().onValue(@$element.find('.button--text'), 'html')

    @_handleTouches()

  renderTo: (container) -> @$element.appendTo(container)

  _handleTouches: ->
    handlers = { }
    @$element.on 'touch:on', (e, event, touch, id) =>
      rect = @$element[0].getBoundingClientRect()
      handlers[id] = @_handle(
        type: if event.type is 'touchstart' then 'touch' else 'glissando'
        x: (touch.clientX - (rect.left + rect.right) / 2) / (rect.width / 2)
        y: (touch.clientY - (rect.top + rect.bottom) / 2) / (rect.height / 2))
    @$element.on 'touch:off', (e, event, touch, id) =>
      handlers[id]?()

  _handle: (options) -> @model.get().action(options)


