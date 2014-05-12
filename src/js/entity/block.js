var Phaser = require('phaser');

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