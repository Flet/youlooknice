var Phaser = require('phaser');

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