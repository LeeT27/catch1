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
  this.anims.create({
    key: 'fall',
    frames: this.anims.generateFrameNumbers('rock', { start: 0, end: 36 }), // Adjust start and end as per your spritesheet
    frameRate: 10,
    repeat: -1, // Loop forever
  });
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
  if (this.time.now % 1000 < 50) {
    // Roughly every second
    spawnFallingSprite(Phaser.Math.Between(0, this.scale.width), 200, 200); // X, Y, velocity
  }
}

function spawnFallingSprite(x, y, velocity) {
  const sprite = this.physics.add.sprite(x, y, 'rock');
  sprite.anims.play('fall');
  sprite.setVelocityY(velocity); // Set the Y velocity

  // Optional: Add collision detection or boundaries
  sprite.setCollideWorldBounds(true); // Prevent the sprite from falling out of the world

  return sprite;
}
