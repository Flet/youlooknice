/* globals module, require, localStorage*/

var Phaser = require('phaser');

var ARCADE = Phaser.Physics.ARCADE;

var Player = require('../entity/player');


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


    this.input.onDown.add(this.player.jump, this);

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