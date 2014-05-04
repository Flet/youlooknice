var Phaser = require('phaser');

//  Here is a custom game object
function ScoreText(game) {
  console.debug("creating a ScoreText!", game);

  var style = {
    font: '30px Arial',
    fill: '#fff'
  };
  Phaser.Text.call(this, game, 20, 20, "0", style);

  game.add.existing(this);


  this.score = 0;

}

ScoreText.prototype = Object.create(Phaser.Text.prototype);
ScoreText.prototype.constructor = ScoreText;


ScoreText.prototype.update = function () {
  this.setText("" + this.score);
  this.content = this.score;
};


ScoreText.prototype.addScore = function () {
  this.score += 1;
};


ScoreText.prototype.resetScore = function () {
  var previousHighscore = localStorage.getItem("highscore");
  if (!previousHighscore || previousHighscore < this.score) {
    localStorage.setItem("highscore", this.score);
  }

  localStorage.setItem("lastscore", this.score);

};

module.exports = ScoreText;