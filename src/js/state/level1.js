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