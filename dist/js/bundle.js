(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @module main
 * @description This is the main entry point used to build bundle.js
 *
 * @author Dan Flettre
 **/
var Phaser = (window.Phaser);

var game = new Phaser.Game(480, 320, Phaser.AUTO, 'content', null),
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
},{"./state/boot.js":2,"./state/level1":3,"./state/mainMenu":4,"./state/preloader":5,"./state/splash":6}],2:[function(require,module,exports){
var Phaser = (window.Phaser);

module.exports = Boot;

function Boot(game) {
  console.info("creating Boot state!", game);
}

Boot.prototype.preload = function () {
  // the preloader images
  this.load.image('loadingBar', 'assets/preloader_loading.png');
  this.load.image('phaserLogo', 'assets/phaser-logo.png');
};

Boot.prototype.create = function () {

  // max number of fingers to detect
  // unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
  this.input.maxPointers = 1;

  // auto pause if window loses focus
  // Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
  this.game.stage.disableVisibilityChange = true;

  if (this.game.device.desktop) {
    // If you have any desktop specific settings, they can go in here
    this.game.stage.scale.pageAlignHorizontally = true;
  } else {
    // Same goes for mobile settings.
    // In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
    this.game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
    this.game.stage.scale.minWidth = 480;
    this.game.stage.scale.minHeight = 260;
    this.game.stage.scale.maxWidth = 1024;
    this.game.stage.scale.maxHeight = 768;
    this.game.stage.scale.forceLandscape = true;
    this.game.stage.scale.pageAlignHorizontally = true;
    this.game.stage.scale.setScreenSize(true);
  }

  // By this point the preloader assets have loaded to the cache, we've set the game settings
  // So now let's start the real preloader going
  this.game.state.start('splash');
};
},{}],3:[function(require,module,exports){
/* globals module, require, localStorage*/

var Phaser = (window.Phaser);


module.exports = {
  create: function () {
    var game = this.game;
    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.background = this.add.sprite(0, 0, 'menu_background');

    this.player = this.add.sprite(50, 50, 'game_sprites');

    game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.body.gravity.y = 1000;

    this.blocks = game.add.group();
    this.blocks.enableBody = true;
    this.blocks.physicsBodyType = Phaser.Physics.ARCADE;

    this.blocks.createMultiple(10, 'game_sprites', 1);


    this.input.onDown.add(this.jump, this);

    this.blockTimer = game.time.events.loop(500, this.addBlock, this);
    this.scoreTimer = game.time.events.loop(Phaser.Timer.SECOND, this.addScore, this);

    this.score = 0;
    var style = {
      font: '30px Arial',
      fill: '#fff'
    };
    this.labelScore = game.add.text(20, 20, "0", style);
  },

  update: function () {
    var game = this.game;
    if (this.player.inWorld === false) {
      this.restartGame();
    }
    game.physics.arcade.overlap(this.player, this.blocks, this.restartGame, null, this);

    this.labelScore.setText("" + this.score);
  },

  jump: function () {
    this.player.body.velocity.y = -350;
  },

  addBlock: function () {
    var x = 480,
      y = ((Math.floor(Math.random() * 5) + 1) * 60) - 30;

    var block = this.blocks.getFirstDead();
    block.reset(x, y);
    block.body.velocity.x = -200;
    block.checkWorldBounds = true;
    block.outOfBoundsKill = true;
  },

  addScore: function () {
    this.score += 1;
    this.labelScore.content = this.score;
  },

  restartGame: function () {
    var game = this.game;
    var previousHighscore = localStorage.getItem("highscore");
    if (!previousHighscore || previousHighscore < this.score) {
      localStorage.setItem("highscore", this.score);
    }

    localStorage.setItem("lastscore", this.score);

    game.time.events.remove(this.blockTimer);
    game.time.events.remove(this.scoreTimer);
    game.state.start('mainMenu');
  }

};
},{}],4:[function(require,module,exports){
/*globals module, require, localStorage*/

var Phaser = (window.Phaser);

module.exports = {

  create: function () {
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
  },

  addPointerEvents: function () {
    this.input.onDown.addOnce(this.startGame, this);
  },

  startGame: function () {
    this.game.state.start('level1', true, false);
  }

};
},{}],5:[function(require,module,exports){
var Phaser = (window.Phaser);

module.exports = {

    preload: function () {

        this.loadingBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loadingBar');
        this.loadingBar.anchor.x = 0.5;
        this.loadingBar.anchor.y = 0.5;
        this.load.setPreloadSprite(this.loadingBar);

        this.game.load.image('menu_background', 'assets/menu_background.png');
        this.game.load.spritesheet('game_sprites', 'assets/game_sprites.png', 32, 32);

    },

    create: function () {
        var tween = this.add.tween(this.loadingBar).to({
            alpha: 0
        }, 1000, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.startMainMenu, this);
    },

    startMainMenu: function () {
        this.game.state.start('mainMenu', true, false);
    }

};
},{}],6:[function(require,module,exports){
module.exports = Splash;

function Splash() {
  this.logo = null;
}

Splash.prototype.create = function () {
  var midx = this.game.world.centerX,
    midy = this.game.world.centerY;

  var logo = this.logo = this.add.sprite(midx, midy + 20, 'phaserLogo');
  logo.anchor.setTo(0.5, 0.5);
  logo.alpha = 0;

  var fadeIn = this.game.add.tween(logo);
  var hold = this.game.add.tween(logo);
  var fadeOut = this.game.add.tween(logo);

  // fade in and slightly move up, hold for a half sec, then fade out
  fadeIn.to({
    alpha: 1,
    y: midy
  }, 1000, null, false);

  hold.to({
    alpha: 1
  }, 500, null, false);

  fadeOut.to({
    alpha: 0
  }, 500, null, false);

  fadeIn.chain(hold);
  hold.chain(fadeOut);
  fadeIn.start();

  fadeOut.onComplete.add(function () {
    this.game.state.start('preloader');
  }, this);

};
},{}]},{},[1])