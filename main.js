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
let clock;
let SPEED = 300;
let DELAY = 500;
let score = 0;
let scoreText;
let time = 0;
let timeText;

let lives = 5;
let heart1;
let heart2;
let heart3;
let heart4;
let heart5;

let damageOverlay;
let damageTween;

let bg;
let ding;
let damage;

let gameOverText;
let gameOverText2;
let gameOverText3;
let red;

let gameBool = true;
const game = new Phaser.Game(config);
function preload() {
  // Load assets here (e.g., images, sounds)
  // this.load.image('sky', 'assets/sky.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('heart', 'assets/heart.png');
  this.load.image('bg', 'assets/bg.jpg');
  this.load.spritesheet('rock', 'assets/rock.png', {
    frameWidth: 85,
    frameHeight: 100,
  });
  this.load.audio('ding', 'assets/ding.wav');
  this.load.audio('damage', 'assets/damage.wav');

  this.load.spritesheet('explosion', 'assets/explosion.png', {
    frameWidth: 100,
    frameHeight: 95,
  });
}

function create() {
  // Add game objects here
  // this.add.image(400, 300, 'sky');
  bg = this.add.image(0, 500, 'bg');
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
    .text(650, 100, `Score: ${score}`, {
      fontSize: '48px',
      font: '40px Comfortaa',
      color: '#ffffff',
    })
    .setOrigin(0.5, 0.5);
  timeText = this.add
    .text(400, 50, `${time / 60}:${time / 10}${time % 10}`, {
      fontSize: '48px',
      font: '32px Comfortaa',
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

  clock = this.time.addEvent({
    delay: 1000, // Time in milliseconds
    callback: tick, // Function to call
    callbackScope: this, // Scope for the callback
    loop: true, // Loop the timer
  });

  heart1 = this.add.image(50, 100, 'heart').setOrigin(0.5, 0.5);
  heart1.setScale(0.04);
  heart2 = this.add.image(100, 100, 'heart').setOrigin(0.5, 0.5);
  heart2.setScale(0.04);
  heart3 = this.add.image(150, 100, 'heart').setOrigin(0.5, 0.5);
  heart3.setScale(0.04);
  heart4 = this.add.image(200, 100, 'heart').setOrigin(0.5, 0.5);
  heart4.setScale(0.04);
  heart5 = this.add.image(250, 100, 'heart').setOrigin(0.5, 0.5);
  heart5.setScale(0.04);

  damageOverlay = this.add.graphics();
  damageOverlay.fillStyle(0xff0000, 0.5);
  damageOverlay.fillRect(
    0,
    0,
    this.cameras.main.width,
    this.cameras.main.height
  );

  // Initially set the overlay to be invisible
  damageOverlay.alpha = 0;
  damageOverlay.setDepth(10);

  ding = this.sound.add('ding');
  damage = this.sound.add('damage');

  this.anims.create({
    key: 'explode',
    frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 25 }), // Adjust frame numbers
    frameRate: 60,
    hideOnComplete: true, // Automatically hide when done
  });

  this.input.keyboard.on('keydown-R', function (event) {
    if (gameBool === false) {
      restart();
    }
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
  fallingSprites.children.iterate((sprite) => {
    sprite.setVelocityY(SPEED); // Apply constant falling speed
  });
  player.setVelocityY(0);
  player.y = 500;
  bar.setVelocityY(0);
}
function spawnRock() {
  if (gameBool) {
    let rock = fallingSprites.create(
      Phaser.Math.Between(32, config.width - 32),
      0,
      'rock'
    );
    rock.setScale(0.5, 0.5);
    rock.anims.play('spin');
    startTimer.call(this);
  }
}
function handleCollision(player, fallingSprites) {
  if (gameBool) {
    const explosion = this.physics.add
      .sprite(fallingSprites.x, fallingSprites.y + 25, 'explosion')
      .play('explode');
    explosion.on('animationcomplete', () => {
      explosion.destroy();
    });
    fallingSprites.destroy(); // Remove the rock
    score++;
    scoreText.setText(`Score: ${score}`);
    ding.play();
  }
}
function loseLife(bar, fallingSprites) {
  fallingSprites.destroy(); // Remove the rock
  lives -= 1;
  if (gameBool) {
    pulseRed(this);
    damage.play();
    if (lives === 4) {
      heart5.setAlpha(0);
    }
    if (lives === 3) {
      heart4.setAlpha(0);
    }
    if (lives === 2) {
      heart3.setAlpha(0);
    }
    if (lives === 1) {
      heart2.setAlpha(0);
    }
    if (lives === 0) {
      heart1.setAlpha(0);
      gameOver(this);
    }
  }
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
function tick() {
  time++;
  timeText.setText(
    `${Math.floor(time / 60)}:${Math.floor(time / 10) % 6}${time % 10}`
  );
  DELAY -= 7;
  SPEED += 7;
}

function pulseRed(scene) {
  // Set the overlay to visible
  if (damageTween) {
    damageTween.stop(); // Stop the current tween
  }

  // Reset the overlay's alpha to visible
  damageOverlay.alpha = 1;

  // Create a new tween to fade out the red overlay
  damageTween = scene.tweens.add({
    targets: damageOverlay,
    alpha: 0,
    duration: 500, // duration of the pulse
    ease: 'Sine.easeInOut',
    onComplete: () => {
      console.log('Overlay alpha after tween:', damageOverlay.alpha); // Debug log
      damageOverlay.alpha = 0; // Ensure it's completely invisible afterward
      damageTween = null; // Reset the tween variable when done
    },
  });
}
function gameOver(scene) {
  red = scene.add.graphics();
  red.fillStyle(0x931a00, 1); // Red color
  red.fillRect(0, 0, scene.scale.width, scene.scale.height);
  gameOverText = scene.add
    .text(400, 200, 'Game Over', {
      font: '76px Comfortaa',
      fill: '#ffffff',
    })
    .setOrigin(0.5);
  gameOverText2 = scene.add
    .text(400, 300, 'Press R to restart', {
      font: '40px Comfortaa',
      fill: '#ffffff',
    })
    .setOrigin(0.5);
  gameOverText2 = scene.add
    .text(400, 400, `Score: ${score}`, {
      font: '40px Comfortaa',
      fill: '#ffffff',
    })
    .setOrigin(0.5);
  gameBool = false;
}
function restart() {
  gameOverText.destroy();
  gameOverText2.destroy();
  red.destroy();
  gameBool = true;
  DELAY = 500;
  SPEED = 300;
  time = 0;
  timeText.setText(`0:00`);
  score = 0;
  lives = 5;
  heart5.setAlpha(1);
  heart4.setAlpha(1);
  heart3.setAlpha(1);
  heart2.setAlpha(1);
  heart1.setAlpha(1);
}
