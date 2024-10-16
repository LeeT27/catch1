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
let fallingSprites;
let SPEED = 400;
let counter = 0;
let counterText;

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
    key: 'spin',
    frames: this.anims.generateFrameNumbers('rock', { start: 0, end: 36 }), // Adjust start and end as per your spritesheet
    frameRate: 10,
    repeat: -1, // Loop forever
  });
  this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

  // Set up an event listener for the key press
  this.wKey.on('down', spawnRock, this);
  fallingSprites = this.physics.add.group();
  counterText = this.add
    .text(600, 100, `Score: ${counter}`, {
      fontSize: '48px',
      color: '#ffffff',
    })
    .setOrigin(0.5, 0.5);
  this.physics.add.collider(
    player,
    fallingSprites,
    handleCollision,
    null,
    this
  );
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
  fallingSprites.children.iterate((sprite) => {
    sprite.setVelocityY(SPEED); // Apply constant falling speed
  });
  player.setVelocityY(0);

  if (fallingSprites.y > 300) {
    loseLife();
  }
}
function spawnRock() {
  let rock = fallingSprites.create(
    Phaser.Math.Between(0, config.width - 32),
    0,
    'rock'
  );
  rock.setCollideWorldBounds(true);
  rock.setScale(0.5, 0.5);
  rock.anims.play('spin');
  rock.body.onWorldBounds = true;
  rock.body.world.on('worldbounds', loseLife, this);
}
function handleCollision(player, fallingSprites) {
  fallingSprites.destroy(); // Remove the rock
  counter++;
  counterText.setText(`Score: ${counter}`);
}
function loseLife(body, up, down, left, right) {
  // Only trigger the function if the collision is with the bottom boundary
  if (down) {
    fallingSprites.destroy();
  }
}
