/* globals module, require*/

var Phaser = require('phaser');

var ARCADE = Phaser.Physics.ARCADE;

var Player = require('../entity/player');
var ScoreText = require('../entity/scoreText');


module.exports = {
  create: function () {
    var game = this.game;
    game.physics.startSystem(ARCADE);

    this.background = this.add.tileSprite(0, 0, 480, 320, 'menu_background');
    this.background.autoScroll(-100, 0);

    this.player = new Player(game);

    this.blocks = game.add.group();
    this.blocks.enableBody = true;
    this.blocks.physicsBodyType = ARCADE;

    this.blocks.createMultiple(10, 'game_sprites', 1);

    this.labelScore = new ScoreText(game);

    this.input.onDown.add(this.player.jump, this);

    this.blockTimer = game.time.events.loop(500, this.addBlock, this);
    this.scoreTimer = game.time.events.loop(Phaser.Timer.SECOND, this.labelScore.addScore, this.labelScore);


  },

  update: function () {
    var game = this.game;
    if (this.player.inWorld === false) {
      this.restartGame();
    }
    game.physics.arcade.overlap(this.player, this.blocks, this.restartGame, null, this);

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

  restartGame: function () {
    var game = this.game;

    this.labelScore.resetScore();

    game.time.events.remove(this.blockTimer);
    game.time.events.remove(this.scoreTimer);
    game.state.start('mainMenu');
  }

};