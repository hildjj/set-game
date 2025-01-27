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

---
[![Tests](https://github.com/hildjj/set-game/actions/workflows/node.js.yml/badge.svg)](https://github.com/hildjj/set-game/actions/workflows/node.js.yml)
[![codecov](https://codecov.io/gh/hildjj/set-game/graph/badge.svg?token=X1vzE7gjJp)](https://codecov.io/gh/hildjj/set-game)
