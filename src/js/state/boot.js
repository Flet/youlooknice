var Phaser = require('phaser');

module.exports = Boot;

function Boot(game) {
  console.info("creating Boot state!", game);
}

Boot.prototype.preload = function () {
  // the preloader images
  this.load.image('loadingBar', 'assets/preloader_loading.png');
  this.load.image('phaserLogo', 'assets/phaser-logo.png');
};

Boot.prototype.create = function () {
  var game = this.game;

  // max number of fingers to detect
  // unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
  this.input.maxPointers = 1;

  // auto pause if window loses focus
  // Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
  this.game.stage.disableVisibilityChange = true;

  if (this.game.device.desktop) {
    // If you have any desktop specific settings, they can go in here
    this.game.stage.scale.pageAlignHorizontally = true;
  } else {
    // Same goes for mobile settings.
    // In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
    this.game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
    this.game.stage.scale.minWidth = 480;
    this.game.stage.scale.minHeight = 260;
    this.game.stage.scale.maxWidth = 1024;
    this.game.stage.scale.maxHeight = 768;
    this.game.stage.scale.forceLandscape = true;
    this.game.stage.scale.pageAlignHorizontally = true;
    this.game.stage.scale.setScreenSize(true);
  }

  // By this point the preloader assets have loaded to the cache, we've set the game settings
  // So now let's start the real preloader going
  this.game.state.start('splash');
};