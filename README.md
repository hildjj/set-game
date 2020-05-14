# install
`npm install -g set-game`

# play a game:
`set-game play --html`

TODO: output HTML with enough JS to play the game for real in the browser,
rather than just auto-solving each board.

# check a board
`set-game solve`

type cards in number, fill, color, shape order, separated by spaces or newlines,
so for 1 open red diamond:
```
1ord
^D
```

Send an EOF (`^D` or `^Z` on Windows) when done

[![Build Status](https://travis-ci.org/hildjj/set-game.svg?branch=master)](https://travis-ci.org/hildjj/set-game)

[![Coverage Status](https://coveralls.io/repos/github/hildjj/set-game/badge.svg?branch=master)](https://coveralls.io/github/hildjj/set-game?branch=master)
