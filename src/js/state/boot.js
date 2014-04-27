var Phaser = require('phaser');

module.exports = Boot;

function Boot(game) {
  console.debug("creating Boot state!", game);
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
  game.stage.disableVisibilityChange = true;

  if (game.device.desktop) {
    // If you have any desktop specific settings, they can go in here
    game.stage.scale.pageAlignHorizontally = true;
  } else {
    // Same goes for mobile settings.
    // In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
    game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
    game.stage.scale.minWidth = 480;
    game.stage.scale.minHeight = 260;
    game.stage.scale.maxWidth = 1024;
    game.stage.scale.maxHeight = 768;
    game.stage.scale.forceLandscape = true;
    game.stage.scale.pageAlignHorizontally = true;
    game.stage.scale.setScreenSize(true);
  }

  // By this point the preloader assets have loaded to the cache, we've set the game settings
  // So now let's start the real preloader going
  game.state.start('splash');
};