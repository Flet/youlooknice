/* globals module, require*/

var Phaser = require('phaser');

var ARCADE = Phaser.Physics.ARCADE;

var Player = require('../entity/player');
var ScoreText = require('../entity/scoreText');
var BlockGroup = require('../entity/blockGroup');

module.exports = {
  create: function () {
    var game = this.game;
    game.physics.startSystem(ARCADE);

    this.background = this.add.tileSprite(0, 0, 480, 320, 'menu_background');
    this.background.autoScroll(-100, 0);

    this.player = new Player(game);
    this.blockz = new BlockGroup(game);
    this.labelScore = new ScoreText(game);

    this.input.onDown.add(this.player.jump, this);

    this.blockTimer = game.time.events.loop(500, this.blockz.addBlock, this.blockz);
    this.scoreTimer = game.time.events.loop(Phaser.Timer.SECOND, this.labelScore.addScore, this.labelScore);

  },

  update: function () {
    var game = this.game;
    if (this.player.inWorld === false) {
      this.restartGame();
    }
    game.physics.arcade.overlap(this.player, this.blockz, this.restartGame, null, this);

  },

  restartGame: function () {
    var game = this.game;

    this.labelScore.resetScore();

    game.time.events.remove(this.blockTimer);
    game.time.events.remove(this.scoreTimer);
    game.state.start('mainMenu');
  }

};