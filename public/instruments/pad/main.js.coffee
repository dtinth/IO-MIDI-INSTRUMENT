
$ ->

  buttons = { }

  for i in [1..4]
    for j in [1..4]
      button = buttons["#{i}#{j}"] = new ButtonController(i, j)
      view = new ButtonView(i, j, button.model)
      view.renderTo('#main')
  
  for key, config of Screens.screens.main
    buttons[key].configure(config)

