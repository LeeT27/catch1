const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  background: '#191970',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};
var player;
const game = new Phaser.Game(config);
function preload() {
  // Load assets here (e.g., images, sounds)
  // this.load.image('sky', 'assets/sky.png');
  this.load.image('player', 'assets/player.png');
  this.load.spritesheet('rock', 'assets/rock.png', {
    frameWidth: 85,
    frameHeight: 100,
  });
}

function create() {
  // Add game objects here
  // this.add.image(400, 300, 'sky');
  player = this.physics.add.image(0, 500, 'player');
  player.setCollideWorldBounds(true);
  let rock = this.add.sprite(100, 100, 'rock');
  rock.play('loop');

  createFallingSprite(this, 400, 50, 'rock');
}

function update() {
  const mouseX = this.input.x;
  if (mouseX < player.width / 2) {
    player.x = player.width / 2;
  } else if (mouseX > game.config.width - player.width / 2) {
    player.x = game.config.width - player.width / 2;
  } else {
    player.x = mouseX;
  }
}

function createFallingSprite(scene, x, y, spriteSheetKey) {
  // Create the sprite from the spritesheet
  let sprite = scene.physics.add.sprite(x, y, spriteSheetKey);

  sprite.setDisplaySize(50, 50);
  sprite.body.setVelocityY(100);
  sprite.body.setCollideWorldBounds(true);

  this.anims.create({
    key: 'loop',
    frames: scene.anims.generateFrameNumbers('rock', { start: 0, end: 36 }), // Adjust start and end as per your spritesheet
    frameRate: 10,
    repeat: -1, // Loop forever
  });
  sprite.play('loop');

  return sprite;
}
