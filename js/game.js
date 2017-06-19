var game = new Phaser.Game(1200, 600, Phaser.AUTO, 'gamehere');


game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('win', menuState);

game.state.start('boot');
