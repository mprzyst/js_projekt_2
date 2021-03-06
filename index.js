var config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 755,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: false,
      width: 5000,
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
var platforms;
var cursors;
var enemies;
var traps;
var score = 0;
var gameOver = false;
var scoreText;
var gameOverText;
var artefact;
var cityTile;
var breadDrop = 600;
var enemyData = [
  { x: 550, y: 400 },
  { x: 500, y: 600 },
  { x: 600, y: 700 },
  { x: 1900, y: 600 },
  { x: 1300, y: 600 },
  { x: 2600, y: 500 },
  { x: 4100, y: 400 },
];
let stepLimit = 100;
var game = new Phaser.Game(config);

function preload() {
  this.load.image("city", "assets/city.png");
  this.load.image("ground", "assets/platform.png");
  this.load.image("bread", "assets/bread.png");
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
  this.load.image("artefact", "assets/portalofglory.png");
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
  platforms.create(2450, 645, "ground");
  platforms.create(2800, 550, "ground").setScale(0.5, 1).refreshBody();
  platforms.create(2400, 450, "ground").setScale(0.75, 1).refreshBody();
  platforms.create(2170, 350, "ground").setScale(0.45, 1).refreshBody();
  platforms.create(3100, 750, "ground").setScale(1, 1);
  platforms.create(3500, 750, "ground").setScale(0.5, 1).refreshBody();
  platforms.create(4350, 750, "ground").setScale(2.5, 1).refreshBody();
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
  artefacts = this.physics.add.staticGroup();
  artefacts.create(4700, 700, "artefact");
  traps.getChildren().forEach((trap) => {
    trap.setTint(0x414f5c);
  });

  player = this.physics.add.sprite(100, 650, "pigeon");
  player.setBounce(0.1);
  //player.body.onWorldBounds = true;
  player.setCollideWorldBounds(true);
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
  this.anims.create({
    key: "Sleft",
    frames: this.anims.generateFrameNumbers("snake", { start: 0, end: 7 }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "Sturn",
    frames: [{ key: "snake", frame: 8 }],
    frameRate: 20,
  });
  this.anims.create({
    key: "Sright",
    frames: this.anims.generateFrameNumbers("snake", { start: 9, end: 16 }),
    frameRate: 10,
    repeat: -1,
  });
  enemies = this.physics.add.group();
  for (var i = 0; i < enemyData.length; i++) {
    enemies.create(enemyData[i].x, enemyData[i].y, "snake");
  }

  enemies.getChildren().forEach(function (enemy) {
    enemy.body.velocity.x = Phaser.Math.Between(20, 70);
    enemy.stepCount = Phaser.Math.Between(10, 100);
    enemy.normalVelocity = enemy.body.velocity.x;
  }, this);

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

  scoreText = this.add.text(16, 16, "score: 0", {
    fontSize: "32px",
    fill: "#000",
  });
  scoreText.setScrollFactor(0);
  this.physics.world.wrap(player, 40);

  gameOverText = this.add.text(690, 150, "", {
    fontSize: "32px",
    fill: "#000",
  });
  gameOverText.setScrollFactor(0);

  this.physics.add.collider(player, platforms);
  this.physics.add.collider(enemies, platforms);
  this.physics.add.collider(breads, platforms);

  this.physics.add.overlap(player, breads, collectbread, null, this);

  this.physics.add.collider(player, enemies, hitTrap, null, this);
  this.physics.add.collider(player, traps, hitTrap, null, this);

  //collider dla wrogow, chlebkow wchodzacych na pulapki
  this.physics.add.collider(breads, traps, hitTrapBread, null, this);
  this.physics.add.collider(enemies, traps, hitTrapEnemy, null, this);

  //wygrywanie
  this.physics.add.overlap(player, artefacts, showGameWon, null, this);
}

function update() {
  if (gameOver) {
    showGameOver();
    this.physics.pause();
  }
  if (player.y > 800) {
    gameOver = true;
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
  if (player.y > 710) {
    gameOver = true;
  }
  enemies.getChildren().forEach(function (enemy) {
    snakeBehaviour(enemy);
  });
}

function collectbread(player, bread) {
  bread.disableBody(true, true);

  //  Add and update the score
  score += 10;
  scoreText.setText("score: " + score);

  //if (breads.countActive(true) === 0) {
  if (breads.countActive(true) < 3) {
    //  A new batch of breads to collect
    breads.children.iterate(function (child) {
      child.enableBody(
        true,
        player.x + Math.random() * 600 + 300,
        0,
        true,
        true
      );
    });

    generateEnemy();
  }
}
function hitTrap(player, traps) {
  this.physics.pause();
  player.setTint(0xff0000);
  player.anims.play("turn");
  gameOver = true;
}
function hitTrapEnemy(enemy, traps) {
  enemy.setTint(0xff0000);
  enemy.disableBody(true, true);
}

function hitTrapBread(bread, traps) {
  bread.disableBody(true, true);
}

function snakeBehaviour(enemy) {
  enemy.stepCount++;
  // check if enemy's step counter has reach limit
  if (enemy.stepCount > stepLimit) {
    // reverse enemy direction
    enemy.body.velocity.x *= -1;
    // reset enemy's step counter
    enemy.stepCount = 0;
    // can add other code - change enemy animation, etc.
  }
  if (enemy.body.velocity.x < 0) enemy.anims.play("Sleft", true);
  if (enemy.body.velocity.x > 0) enemy.anims.play("Sright", true);
  if (enemy.body.velocity.x == 0) enemy.anims.play("Sstop", true);
  // see if enemy and player within 400px of each other
  if (Math.abs(player.x - enemy.x) < 300 && player.y === enemy.y) {
    // if player to left of enemy AND enemy moving to right (or not moving)
    if (player.x < enemy.x && enemy.body.velocity.x >= 0) {
      // move enemy to left
      enemy.body.velocity.x *= -1;
    }
    // if player to right of enemy AND enemy moving to left (or not moving)
    else if (player.x > enemy.x && enemy.body.velocity.x <= 0) {
      // move enemy to right
      enemy.body.velocity.x *= -1;
    }
    if (enemy.body.velocity.x <= 50 && enemy.body.velocity.x >= 0) {
      enemy.body.velocity.x *= 3;
    } else if (enemy.body.velocity.x >= -50 && enemy.body.velocity.x <= 0) {
      enemy.body.velocity.x *= 3;
    }
  }
  if (Math.abs(player.x - enemy.x) > 300) {
    // if player to left of enemy AND enemy moving to right (or not moving)
    if (enemy.body.velocity.x > 0) {
      // move enemy to left
      enemy.body.velocity.x = enemy.normalVelocity;
    }
    // if player to right of enemy AND enemy moving to left (or not moving)
    else if (enemy.body.velocity.x < 0) {
      // move enemy to right
      enemy.body.velocity.x = -enemy.normalVelocity;
    }
  }
}
function generateEnemy() {
  enemies.create(
    player.x + Math.random() * 4000 + 300,
    Phaser.Math.Between(200, 600),
    "snake"
  );
  enemies.getChildren()[enemies.getChildren().length - 1].body.velocity.x =
    Phaser.Math.Between(20, 70);
  enemies.getChildren()[enemies.getChildren().length - 1].stepCount =
    Phaser.Math.Between(10, 100);
  enemies.getChildren()[enemies.getChildren().length - 1].normalVelocity =
    enemies.getChildren()[enemies.getChildren().length - 1].body.velocity.x;
}

function showGameOver() {
  player.setTint(0xff0000);
  gameOverText.setText(
    "GAME OVER \n\nYour score: " + score + "\n\nPress F5 to play again."
  );
}

function showGameWon(player, artefact) {
  this.physics.pause();
  player.setTint(0xd9a836);
  gameOverText.setText(
    "CONGRATS! PIGEONS RULE! \n\nYour score: " +
      score +
      "\n\nPress F5 to play again."
  );
}
