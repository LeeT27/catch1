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
var bar;
let fallingSprites;
let timerEvent;
let SPEED = 300;
let DELAY = 500;
let score = 0;
let scoreText;
let life = 5;
let lifeText;

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
  bar = this.physics.add.image(400, 650, 'player');
  bar.setScale(8, 1);
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
  scoreText = this.add
    .text(600, 100, `Score: ${score}`, {
      fontSize: '48px',
      color: '#ffffff',
    })
    .setOrigin(0.5, 0.5);
  lifeText = this.add
    .text(150, 100, `Lives: ${life}`, {
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
  this.physics.add.collider(bar, fallingSprites, loseLife, null, this);
  startTimer.call(this);
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
  player.y = 500;
  bar.setVelocityY(0);
}
function spawnRock() {
  let rock = fallingSprites.create(
    Phaser.Math.Between(32, config.width - 32),
    0,
    'rock'
  );
  rock.setScale(0.5, 0.5);
  rock.anims.play('spin');
  DELAY -= 7;
  SPEED += 2;
  startTimer.call(this);
}
function handleCollision(player, fallingSprites) {
  fallingSprites.destroy(); // Remove the rock
  score++;
  scoreText.setText(`Score: ${score}`);
}
function loseLife(bar, fallingSprites) {
  fallingSprites.destroy(); // Remove the rock
  life--;
  lifeText.setText(`Lives: ${life}`);
}

function startTimer() {
  // Stop any existing timer before starting a new one
  if (timerEvent) {
    timerEvent.remove();
  }

  // Create a new timer event
  timerEvent = this.time.addEvent({
    delay: DELAY, // Time in milliseconds
    callback: spawnRock, // Function to call
    callbackScope: this, // Scope for the callback
    loop: true, // Loop the timer
  });
}
