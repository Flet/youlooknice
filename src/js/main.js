/**
 * This is the main entry point of the game. We `require` Phaser as
 * well as all of our states and add those states to the `game`.
 *
 * Finally, we start the `boot` state which kicks off the game.
 *
 */

// Get a handle to Phaser!
// Note that the phaser lib is not actually part of this project anywhere.
// Instead, we're using the CDN copy of phaser via `browserify-shim`.
// You'll see a reference to the CDN copy in  [index.html](../index.html.html)
var Phaser = require('phaser');

// Create a new instance of phaser
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', null);

// Bring in all of our states via `require` calls.
var boot = require('./state/boot.js');
var preloader = require('./state/preloader');
var mainMenu = require('./state/mainMenu');
var level1 = require('./state/level1');


//Add all of our states to the Phaser game instance.
game.state.add('boot', boot, false);
game.state.add('preloader', preloader, false);
game.state.add('mainMenu', mainMenu, false);
game.state.add('level1', level1, false);

// Kick off the game by starting up the `boot` state
game.state.start('boot');
// See [boot.js](state/boot.js.html) for the next step