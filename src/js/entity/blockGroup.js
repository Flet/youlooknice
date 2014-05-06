var Phaser = require('phaser');
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