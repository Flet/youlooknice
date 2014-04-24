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