var Phaser = require('phaser');

module.exports = Splash;

function Splash() {
  console.debug("creating splash state!");
  this.logo = null;
}

Splash.prototype.create = function () {
  var midx = this.game.width / 2,
    midy = this.game.height / 2,
    logo, tween;

  logo = this.logo = this.add.sprite(midx, midy + 20, 'phaserLogo');
  logo.anchor.x = logo.anchor.y = 0.5;
  logo.alpha = 0;

  tween = this.add.tween(logo);

  tween.onComplete.add(function () {
    var self = this;
    setTimeout(function () {
      self.game.state.start('preloader');
    }, 1000);

  }, this);

  tween
    .to({
      y: midy,
      alpha: 1
    }, 1000, Phaser.Easing.Linear.None)
    .start();
};