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
var bombs;
var platforms;
var cursors;
var enemies;
var score = 0;
var gameOver = false;
var scoreText;

var city;
var arrowKey;

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
}

function create() {
  this.add.image(960, 375, "city");

  platforms = this.physics.add.staticGroup();
  platforms.create(960, 830, "ground").setScale(6).refreshBody();
  platforms.create(600, 400, "ground");
  platforms.create(50, 250, "ground");
  platforms.create(750, 220, "ground");

  player = this.physics.add.sprite(100, 650, "pigeon");
  player.setBounce(0.1);
  player.setCollideWorldBounds(true);

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

  //  Input Events
  arrowKey.cursors = this.input.keyboard.createCursorKeys();

  //  Some breads to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
  breads = this.physics.add.group({
    key: "bread",
    repeat: 11,
    setXY: { x: 20, y: 0, stepX: Phaser.Math.Between(70, 300) },
  });

  breads.children.iterate(function (child) {
    //  Give each bread a slightly different bounce
    child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
  });

  bombs = this.physics.add.group();

  scoreText = this.add.text(16, 16, "score: 0", {
    fontSize: "32px",
    fill: "#000",
  });

  this.physics.add.collider(player, platforms);
  this.physics.add.collider(breads, platforms);
  this.physics.add.collider(bombs, platforms);

  this.physics.add.overlap(player, breads, collectbread, null, this);

  this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update() {
  if (gameOver) {
    return;
  }
  if (cursors.right.isDown) {
    player.setVelocityX(200);

var cityTile;
var enemyData = [
    { x:75, y:50 },
    { x:150, y:0 },
    { x:250, y:250 },
    { x:275, y:0 },
    { x:350, y:100 },
    { x:450, y:300 },
    { x:475, y:0 },
    { x:525, y:75 },
    { x:650, y:0 },
    { x:700, y:400 }
];
var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('city', 'assets/city.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('bread', 'assets/bread.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('pigeon', 'assets/pigeon.png', { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet('snake', 'assets/snake.png', { frameWidth: 48, frameHeight: 48 });
}

function create ()
{
    this.add.image(960, 375, 'city');
    platforms = this.physics.add.staticGroup();
    platforms.create(960, 830, 'ground').setScale(6).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 650, 'pigeon');
    player.setBounce(0.1);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('pigeon', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'pigeon', frame: 4 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('pigeon', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    // enemies = this.physics.add.group({
    //     key: 'snake',
    //     repeat: 3,
    //     setXY: {x: Math.random() * 250+200, y: 650, stepX: Phaser.Math.random() * 250}
    // });
    enemies =this.physics.add.group();
     enemies.create(300, 650, 'snake')
     for (var i = 0; i < enemyData.length; i++) {
        var enemy = enemies.create(enemyData[i].x, enemyData[i].y, 'snake');  
        enemy.body.velocity.x = Phaser.Math.Between(125, 175);
        this.anims.create({
        frames: this.anims.generateFrameNumbers('snake', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        frames: [ { key: 'snake', frame: 8 } ],
        frameRate: 20
    });
    this.anims.create({
        frames: this.anims.generateFrameNumbers('snake', { start: 9, end: 16 }),
        frameRate: 10,
        repeat: -1
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
    for (var i = 0; i < Phaser.Math.Between(3,9); i++) {
        var bread = breads.create(Phaser.Math.Between(20,1800), Phaser.Math.Between(50,600), 'bread');
        // add code to set other properties of each member
    
    }
    breads.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.2));
    });

    bombs = this.physics.add.group();

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(enemies, platforms);
    this.physics.add.collider(breads, platforms);
    this.physics.add.collider(bombs, platforms);

    this.physics.add.overlap(player, breads, collectbread, null, this);

    this.physics.add.collider(player, enemies, hitBomb, null, this);
    //cityTile = game.add.tilesprite(0, 0, 960, 375, 'city')

}

function update ()
{
    if (gameOver)
    {
        return;
    }
    if (cursors.left.isDown)
    {
        player.setVelocityX(-200);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(200);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-350);
    }
    //snakeBehaviour()
}


    player.anims.play("right", true);
  } else if (cursors.left.isDown) {
    player.setVelocityX(-200);

    player.anims.play("left", true);
  } else {
    player.setVelocityX(0);

    player.anims.play("turn");
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-350);
  }
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

function hitBomb(player, bomb) {
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play("turn");

  gameOver = true;
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
