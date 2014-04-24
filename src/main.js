/**
 * @module main
 * @description This is the main entry point used to build bundle.js
 *
 * @author Dan Flettre
 **/

var game = require('./core/game'),
  boot = require('./scenes/boot.js'),
  preloader = require('./scenes/preloader'),
  mainMenu = require('./scenes/mainMenu'),
  level1 = require('./scenes/level1');


/** add game states */
game.state.add('boot', boot, false);
game.state.add('preloader', preloader, false);
game.state.add('mainMenu', mainMenu, false);
game.state.add('level1', level1, false);

//start the "boot" state
game.state.start('boot');