
Screens.config (A) ->
  main: do ->

    KICK =
      text: 'Kick'
      action: A.drum(36)

    11: KICK
    12: KICK
    13:
      text: 'Rimshot'
      action: A.drum(37)
    14: KICK

    21:
      text: 'Snare 1'
      action: A.drum(38)
    22:
      text: 'Snare 2'
      action: A.drum(40)
    23:
      text: 'Hat Close'
      action: A.drum(42)
    24:
      text: 'Hat Open'
      action: A.drum(46)

    31:
      text: 'Tom 1'
      action: A.drum(48)
    32:
      text: 'Tom 2'
      action: A.drum(45)
    33:
      text: 'Tom 3'
      action: A.drum(41)
    34:
      text: 'Ride 1'
      action: A.drum(59)

    41:
      text: 'Cymbal 1'
      action: A.drum(52)
    42:
      text: 'Ride 2'
      action: A.drum(53)
    43:
      text: 'Cymbal 2'
      action: A.drum(49)
    44:
      text: 'Cymbal 3'
      action: A.drum(57)
