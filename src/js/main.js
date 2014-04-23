/**
 * @module main
 * @description This is the main entry point used to build bundle.js
 *
 * @author Dan Flettre
 **/

var game = require('./core/game'),
  boot = require('./state/boot.js'),
  preloader = require('./state/preloader'),
  mainMenu = require('./state/mainMenu'),
  level1 = require('./state/level1'),
  splash = require('./state/splash');


/** add game states */
game.state.add('boot', boot, false);
game.state.add('splash', splash, false);
game.state.add('preloader', preloader, false);
game.state.add('mainMenu', mainMenu, false);
game.state.add('level1', level1, false);


//start the "boot" state
game.state.start('boot');
this.game.state.start('Splash');