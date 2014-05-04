var Phaser = require('phaser');

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