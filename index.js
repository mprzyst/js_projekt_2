var config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 755,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
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
var breads;
var traps;
var platforms;
var cursors;
var enemies;
var score = 0;
var gameOver = false;
var scoreText;
var cityTile;
var enemyData = [
  { x: 75, y: 50 },
  { x: 150, y: 0 },
  { x: 250, y: 250 },
  { x: 275, y: 0 },
  { x: 350, y: 100 },
  { x: 450, y: 300 },
  { x: 475, y: 0 },
  { x: 525, y: 75 },
  { x: 650, y: 0 },
  { x: 700, y: 400 },
];
var game = new Phaser.Game(config);

function preload() {
  this.load.image("city", "assets/city.png");
  this.load.image("ground", "assets/platform.png");
  this.load.image("bread", "assets/bread.png");
  this.load.image("bomb", "assets/bomb.png");
  this.load.spritesheet("pigeon", "assets/pigeon.png", {
    frameWidth: 48,
    frameHeight: 48,
  });
  this.load.spritesheet("snake", "assets/snake.png", {
    frameWidth: 48,
    frameHeight: 48,
  });
  this.load.image("trap", "assets/trap.png");
  this.load.image("trap_upsidedown", "assets/trap_upsidedown.png");
}

function create() {
  let background = this.add.tileSprite(0, 0, 1920, 755, "city");
  background.setOrigin(0);
  platforms = this.physics.add.staticGroup();
  platforms.create(350, 830, "ground").setScale(6).refreshBody();
  platforms.create(600, 645, "ground");
  platforms.create(50, 550, "ground");
  platforms.create(630, 450, "ground");
  platforms.create(1950, 750, "ground");
  platforms.create(2500, 645, "ground");
  platforms.create(2800, 550, "ground").setScale(0.5, 1).refreshBody();
  platforms.create(2400, 450, "ground").setScale(0.75, 1).refreshBody();
  platforms.create(2170, 350, "ground").setScale(0.45, 1).refreshBody();
  platforms.create(3100, 750, "ground").setScale(1, 1);
  platforms.create(3500, 750, "ground").setScale(0.5, 1).refreshBody();
  platforms.create(4250, 750, "ground").setScale(2, 1).refreshBody();
  platforms.create(4250, 585, "ground").setScale(0.85, 1).refreshBody();
  platforms.create(4430, 700, "ground").setScale(0.5, 1).refreshBody();
  platforms.create(4000, 480, "ground");
  traps = this.physics.add.staticGroup();
  traps.create(2208, 733, "trap");
  traps.create(50, 517, "trap");
  traps.create(752, 615, "trap");
  traps.create(990, 715, "trap");
  traps.create(2298, 420, "trap");
  traps.create(3100, 715, "trap");
  traps.create(4230, 620, "trap_upsidedown");
  traps.create(2400, 485, "trap_upsidedown");

  player = this.physics.add.sprite(100, 650, "pigeon");
  player.setBounce(0.1);
  //player.setCollideWorldBounds(true);
  background.setScrollFactor(0);
  this.cameras.main.setBounds(0, 0, 5000, 755);
  this.cameras.main.startFollow(player);

  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("pigeon", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "turn",
    frames: [{ key: "pigeon", frame: 4 }],
    frameRate: 20,
  });
  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("pigeon", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });
  // enemies = this.physics.add.group({
  //     key: 'snake',
  //     repeat: 3,
  //     setXY: {x: Math.random() * 250+200, y: 650, stepX: Phaser.Math.random() * 250}
  // });
  enemies = this.physics.add.group();
  enemies.create(300, 650, "snake");
  for (var i = 0; i < enemyData.length; i++) {
    var enemy = enemies.create(enemyData[i].x, enemyData[i].y, "snake");
    enemy.body.velocity.x = Phaser.Math.Between(125, 175);
    this.anims.create({
      frames: this.anims.generateFrameNumbers("snake", { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      frames: [{ key: "snake", frame: 8 }],
      frameRate: 20,
    });
    this.anims.create({
      frames: this.anims.generateFrameNumbers("snake", { start: 9, end: 16 }),
      frameRate: 10,
      repeat: -1,
    });
    // enemyData[i].anchor.setTo(0.5, 0.5);
    // enemyData[i].animations.add('moving', [0, 1, 2], 10, true);
    // enemyData[i].animations.play('moving');
    // enemyData[i].body.velocity.y = 50;
  }
  // enemies.setBounce(0);
  // enemies.setCollideWorldBounds(true);
  //  Input Events
  cursors = this.input.keyboard.createCursorKeys();

  breads = this.physics.add.group();
  for (var i = 0; i < Phaser.Math.Between(3, 9); i++) {
    var bread = breads.create(
      Phaser.Math.Between(20, 1800),
      Phaser.Math.Between(50, 600),
      "bread"
    );
    // add code to set other properties of each member
  }
  breads.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.2));
  });

  bombs = this.physics.add.group();

  scoreText = this.add.text(16, 16, "score: 0", {
    fontSize: "32px",
    fill: "#000",
  });
  scoreText.setScrollFactor(0);

  this.physics.add.collider(player, platforms);
  this.physics.add.collider(enemies, platforms);
  this.physics.add.collider(breads, platforms);
  this.physics.add.collider(bombs, platforms);
  //this.physics.add.collider(player, traps);
  this.physics.add.collider(breads, traps);
  this.physics.add.collider(bombs, traps);

  this.physics.add.overlap(player, breads, collectbread, null, this);

  this.physics.add.collider(player, enemies, hitTrap, null, this);
  this.physics.add.collider(player, traps, hitTrap, null, this);
  this.physics.add.collider(bread, traps, hitTrapBread, null, this);
  //collider dla wrogow wchodzacych na pulapki
  this.physics.add.collider(enemies, traps, hitTrapEnemy, null, this);
  //cityTile = game.add.tilesprite(0, 0, 960, 375, 'city')
}

function update() {
  if (gameOver) {
    return;
  }
  if (cursors.left.isDown) {
    player.setVelocityX(-200);

    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(200);

    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);

    player.anims.play("turn");
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-350);
  }
  //snakeBehaviour()
}

function collectbread(player, bread) {
  bread.disableBody(true, true);

  //  Add and update the score
  score += 10;
  scoreText.setText("Score: " + score);

  if (breads.countActive(true) === 0) {
    //  A new batch of breads to collect
    breads.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true);
    });

    var x =
      player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, "bomb");
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
  }
}

function hitTrap(player, traps) {
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play("turn");

  gameOver = true;
}

//zabijanie wrogów na trapach
function hitTrapEnemy(enemy, traps) {
  this.physics.pause();

  enemy.setTint(0xff0000);

  enemy.anims.play("turn");
}

function hitTrapBread(bread, traps) {
  this.physics.pause();

  bread.setTint(0xff0000);

  bread.anims.play("turn");
}

// let stepLimit = 100;
// function snakeBehaviour()
// {
//     // see if enemy and player within 400px of each other
// if (game.physics.arcade.distanceBetween(enemy, player) < 400) {

//     // if player to left of enemy AND enemy moving to right (or not moving)
//     if (player.x < enemy.x && enemy.body.velocity.x >= 0) {
//         // move enemy to left
//         enemy.body.velocity.x = -150;
//     }
//     // if player to right of enemy AND enemy moving to left (or not moving)
//     else if (player.x > enemy.x && enemy.body.velocity.x <= 0) {
//         // move enemy to right
//         enemy.body.velocity.x = 150;
//     }
// }
// function patrolPlatform(enemy, platform) {
//     // if enemy moving to right and has started to move over right edge of platform
//     if (enemy.body.velocity.x > 0 && enemy.right > platform.right) {
//         enemy.body.velocity.x *= -1; // reverse direction
//     }
//     // else if enemy moving to left and has started to move over left edge of platform
//     else if (enemy.body.velocity.x < 0 && enemy.left < platform.left) {
//         enemy.body.velocity.x *= -1; // reverse direction
//     }
// }
// function generateEnemy () {
//     const xCoordinate = Math.random() * 250+200;
//     enemies.create(xCoordinate, 650, 'enemy');
//   }
// }
