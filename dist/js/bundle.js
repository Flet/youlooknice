(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Phaser = (window.Phaser);

//  Here is a custom game object
function Block(game) {
  console.debug("creating a Block!", game);

  Phaser.Sprite.call(this, game, 50, 50, 'game_sprites', 1);

  game.add.existing(this);
  game.physics.enable(this, Phaser.Physics.ARCADE);

}

Block.prototype = Object.create(Phaser.Sprite.prototype);
Block.prototype.constructor = Block;


Block.prototype.revive = function () {
  var max = this.game.height-30;
  var min = 30;
  console.debug("Reviving block");

  var x = this.game.width;
  console.log(Math.random() * 5);
  var y = Math.random() * (max - min) + min;

  this.reset(x, y);
  this.body.velocity.x = -200;
  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
};

module.exports = Block;
},{}],2:[function(require,module,exports){
var Phaser = (window.Phaser);
var Block = require('./block.js');

//  Here is a custom game object
function BlockGroup(game) {
  console.debug("creating a BlockGroup!", game);

  Phaser.Group.call(this, game, null, 'blockgroup', false, true, Phaser.Physics.ARCADE);

  game.add.existing(this);

  this.classType = Block;
  this.createMultiple(10);

}

BlockGroup.prototype = Object.create(Phaser.Group.prototype);
BlockGroup.prototype.constructor = BlockGroup;


BlockGroup.prototype.addBlock = function () {
  var block = this.getFirstDead();
  block.revive();
};

module.exports = BlockGroup;
},{"./block.js":1}],3:[function(require,module,exports){
var Phaser = (window.Phaser);

//  Here is a custom game object
function Player(game) {
  console.debug("creating a Player!", game);

  Phaser.Sprite.call(this, game, 50, 50, 'game_sprites');

  game.add.existing(this);

  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.gravity.y = 1000;

}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;


Player.prototype.jump = function () {
  console.log("FLAP!");
  this.player.body.velocity.y = -350;
};

module.exports = Player;
},{}],4:[function(require,module,exports){
var Phaser = (window.Phaser);

//  Here is a custom game object
function ScoreText(game) {
  console.debug("creating a ScoreText!", game);

  var style = {
    font: '30px Arial',
    fill: '#fff'
  };
  Phaser.Text.call(this, game, 20, 20, "0", style);

  game.add.existing(this);


  this.score = 0;

}

ScoreText.prototype = Object.create(Phaser.Text.prototype);
ScoreText.prototype.constructor = ScoreText;


ScoreText.prototype.update = function () {
  this.setText("" + this.score);
  this.content = this.score;
};


ScoreText.prototype.addScore = function () {
  this.score += 1;
};


ScoreText.prototype.resetScore = function () {
  var previousHighscore = localStorage.getItem("highscore");
  if (!previousHighscore || previousHighscore < this.score) {
    localStorage.setItem("highscore", this.score);
  }

  localStorage.setItem("lastscore", this.score);

};

module.exports = ScoreText;
},{}],5:[function(require,module,exports){
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
var Phaser = (window.Phaser);

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
},{"./state/boot.js":6,"./state/level1":7,"./state/mainMenu":8,"./state/preloader":9}],6:[function(require,module,exports){
var Phaser = (window.Phaser);

function Boot(game) {
  console.debug("creating Boot state!", game);
}

Boot.prototype.preload = function () {
  // the preloader images
  this.load.image('loadingBar', 'assets/preloader_loading.png');
  this.load.image('phaserLogo', 'assets/phaser-logo.png');
};

Boot.prototype.create = function () {
  var game = this.game;

  // max number of fingers to detect
  // unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
  this.input.maxPointers = 1;

  // auto pause if window loses focus
  // Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
  game.stage.disableVisibilityChange = true;

  // If you have any desktop specific settings, they can go in here
  if (game.device.desktop) {
    game.stage.scale.pageAlignHorizontally = true;
  } else {
    // Any mobile-specific settiings go here.
    // In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
    game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
    game.stage.scale.minWidth = 480;
    game.stage.scale.minHeight = 260;
    game.stage.scale.maxWidth = 1024;
    game.stage.scale.maxHeight = 768;
    game.stage.scale.forceLandscape = true;
    game.stage.scale.pageAlignHorizontally = true;
    game.stage.scale.setScreenSize(true);
  }

  // By this point the preloader assets have loaded to the cache, we've set the game settings
  // So now let's start the real preloader going
  game.state.start('preloader');
};

module.exports = Boot;
},{}],7:[function(require,module,exports){
/* globals module, require*/

var Phaser = (window.Phaser);

var ARCADE = Phaser.Physics.ARCADE;

var Player = require('../entity/player');
var ScoreText = require('../entity/scoreText');
var BlockGroup = require('../entity/blockGroup');

module.exports = {
  create: function () {
    var game = this.game;
    game.physics.startSystem(ARCADE);

    this.background = this.add.tileSprite(0, 0, game.width, game.height, 'menu_background');
    this.background.autoScroll(-100, 0);

    this.player = new Player(game);
    this.blockz = new BlockGroup(game);
    this.labelScore = new ScoreText(game);

    game.camera.follow(this.player);


    this.input.onDown.add(this.player.jump, this);

    this.blockTimer = game.time.events.loop(500, this.blockz.addBlock, this.blockz);
    this.scoreTimer = game.time.events.loop(Phaser.Timer.SECOND, this.labelScore.addScore, this.labelScore);


    // Add the tilemap 'map' to the game
    this.map = game.add.tilemap('map');

    // Add the tileset image 'level' to the map
    // (The name must match both an image in Phaser's cache
    //  and the name of an image withi the 'map.json'
    //  list of tilesets too.)
    this.map.addTilesetImage('level');

    // Create a layer from the 'map.json' file
    // based on 'Tile Layer 1' from the available tiles.
    this.layer = this.map.createLayer('Tile Layer 1');

          // Set the collision range 
          //  Here, the range is from 1 (the first tile) to the fifth (last tile).
    this.map.setCollisionBetween(1, 5);

    // Tell the layer to resize the game 'world' to match its size
          this.layer.resizeWorld();

  },

  update: function () {
    var game = this.game;
    if (this.player.inWorld === false) {
      this.restartGame();
    }
    game.physics.arcade.overlap(this.player, this.blockz, this.restartGame, null, this);
    game.physics.arcade.collide(this.player, this.layer);
  },

  restartGame: function () {
    var game = this.game;

    this.labelScore.resetScore();

    game.time.events.remove(this.blockTimer);
    game.time.events.remove(this.scoreTimer);
    game.state.start('mainMenu');
  }

};
},{"../entity/blockGroup":2,"../entity/player":3,"../entity/scoreText":4}],8:[function(require,module,exports){
/*globals module, require, localStorage*/

var Phaser = (window.Phaser);

module.exports = MainMenu;

function MainMenu(game) {
  console.info("Starting Main Menu", game);
}

MainMenu.prototype.create = function () {
  var game = this.game;
  var tween, highscore = localStorage.getItem("highscore"),
    lastscore = localStorage.getItem("lastscore"),
    style = {
      font: '30px Arial',
      fill: '#fff'
    };

  if (highscore) {
    this.highscore = highscore;
  } else {
    this.highscore = 0;
  }

  this.background = this.add.sprite(0, 0, 'menu_background');
  this.background.alpha = 0;
  this.background.width = game.width;
  this.background.height = game.height;
  
  this.labelTitle = game.add.text(20, 20, "Tap to start", style);
  this.labelTitle.alpha = 0;

  this.highscoreLabel = game.add.text(20, 280, "High Score: " + this.highscore, style);

  if (lastscore) {
    this.lastscoreLabel = game.add.text(20, 240, "Last Score: " + lastscore, style);
  }

  tween = this.add.tween(this.background).to({
    alpha: 1
  }, 500, Phaser.Easing.Linear.None, true);
  this.add.tween(this.labelTitle).to({
    alpha: 1
  }, 500, Phaser.Easing.Linear.None, true);

  tween.onComplete.add(this.addPointerEvents, this);
};



MainMenu.prototype.addPointerEvents = function () {
  this.input.onDown.addOnce(this.startGame, this);
};

/**
 * ## startGame
 * Starts up the game!
 * @return {Phaser.Game}  returns a new instance of Phaser.Game
 */
MainMenu.prototype.startGame = function () {
  this.game.state.start('level1', true, false);
};
},{}],9:[function(require,module,exports){
var Phaser = (window.Phaser);

function Preloader() {
  this.logo = null;
  this.splashgroup = null;
}

Preloader.prototype.preload = function () {
  this.showLoadingBarAndLogo();

  // convenience
  var game = this.game;


  // load ALL assets
  game.load.image('menu_background', 'assets/menu_background.png');
  game.load.spritesheet('game_sprites', 'assets/game_sprites.png', 32, 32);


  // Load the 'map.json' file using the TILDED_JSON special flag
  game.load.tilemap('map', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);

  // Load the image 'level.png' and associate it in the cache as 'level'
  game.load.image('level', 'assets/mytiles.png');

};

Preloader.prototype.create = function () {

  //on create, fade everything out
  var tween = this.add.tween(this.splashgroup).to({
    alpha: 0
  }, 1000, Phaser.Easing.Linear.None, true);

  tween.onComplete.add(function () {
    this.game.state.start('mainMenu', true, false);
  }, this);
};

Preloader.prototype.showLoadingBarAndLogo = function () {

  var midx = this.game.world.centerX;
  var midy = this.game.world.centerY;

  // This group is used to conveniently fade out all items in the create function.
  this.splashgroup = this.game.add.group();

  // build loading bar and hook it to phaser
  // Note that the loading bar was already loaded in the previous "boot" state
  var loadingBar = this.add.sprite(midx, midy * 1.8, 'loadingBar');
  loadingBar.anchor.x = 0.5;
  loadingBar.anchor.y = 0.5;
  this.load.setPreloadSprite(loadingBar);
  this.splashgroup.add(loadingBar);

  // Create a sprite for the logo and fade it in while we load up assets
  var logo = this.add.sprite(midx, midy + 20, 'phaserLogo');
  logo.anchor.setTo(0.5, 0.5);
  logo.alpha = 0;
  this.splashgroup.add(logo);
  //tween the phaser logo
  var fadeIn = this.game.add.tween(logo);
  // fade in
  fadeIn.to({
    alpha: 1,
    y: midy
  }, 1000).start();

};


module.exports = Preloader;
},{}]},{},[5])