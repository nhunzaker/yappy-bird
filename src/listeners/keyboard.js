var PlayerActions = require('../actions/player');
var GameActions = require('../actions/game');
var Keys = require('../constants/keys');

var { UP, ESCAPE } = Keys;

window.addEventListener('keyup', (e) => {
	switch (e.which) {
		case UP:
			PlayerActions.jump();
			break;
		case ESCAPE:
			GameActions.toggle();
			break;
	}
});
