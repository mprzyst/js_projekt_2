var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 755,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var breads;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('city', 'assets/city.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('bread', 'assets/bread.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('pigeon', 'assets/pigeon.png', { frameWidth: 48, frameHeight: 48 });
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

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Some breads to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    breads = this.physics.add.group({
        key: 'bread',
        repeat: 11,
        setXY: { x: 20, y: 0, stepX: Phaser.Math.Between(70, 300) }
    });

    breads.children.iterate(function (child) {

        //  Give each bread a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));

    });

    bombs = this.physics.add.group();

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(breads, platforms);
    this.physics.add.collider(bombs, platforms);

    this.physics.add.overlap(player, breads, collectbread, null, this);

    this.physics.add.collider(player, bombs, hitBomb, null, this);
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
}

function collectbread (player, bread)
{
    bread.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    if (breads.countActive(true) === 0)
    {
        //  A new batch of breads to collect
        breads.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}

function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}
