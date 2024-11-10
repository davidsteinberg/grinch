import Phaser from "phaser";

const positions = {
  present: { x: 460, y: 460 },
  grinch: { x: 620, y: 360 },
  who: { x: 600, y: 450 },
};

const velocity = 70;

class Main extends Phaser.Scene {
  present!: Phaser.Physics.Arcade.Sprite;
  tree!: Phaser.Physics.Arcade.Sprite;
  grinch!: Phaser.Physics.Arcade.Sprite;
  bed!: Phaser.Physics.Arcade.Sprite;
  squeaky_board!: Phaser.Physics.Arcade.Sprite;
  chimney!: Phaser.Physics.Arcade.Sprite;
  fox!: Phaser.Physics.Arcade.Sprite;
  who!: Phaser.Physics.Arcade.Sprite;
  keys!: Phaser.Types.Input.Keyboard.CursorKeys;
  whoZone!: Phaser.GameObjects.Rectangle;

  hearts: Phaser.GameObjects.Image[] = [];

  grinchHasPresent = false;
  won = false;
  whoIsMoving = false;
  lives = 4;

  constructor() {
    super("Main");
  }

  create() {
    this.squeaky_board = this.physics.add.sprite(515, 430, "squeaky_board");
    this.squeaky_board.setScale(0.04);

    this.chimney = this.physics.add.sprite(620, 320, "chimney");
    this.chimney.setImmovable(true);
    this.chimney.setScale(0.06);

    this.tree = this.physics.add.sprite(420, 420, "tree");
    this.tree.setImmovable(true);
    this.tree.setScale(0.04);

    this.bed = this.physics.add.sprite(600, 450, "bed");
    this.bed.setImmovable(true);
    this.bed.setScale(0.07);

    this.who = this.physics.add.sprite(positions.who.x, positions.who.y, "who");
    this.who.setScale(0.07);

    this.fox = this.physics.add.sprite(560, 465, "fox");
    this.fox.setScale(0.04);

    this.grinch = this.physics.add.sprite(
      positions.grinch.x,
      positions.grinch.y,
      "grinch"
    );

    this.grinch.setScale(0.02);

    this.present = this.physics.add.sprite(
      positions.present.x,
      positions.present.y,
      "present"
    );

    this.present.setScale(0.05);

    this.whoZone = this.add.rectangle(600, 450, 100, 100, 0x000000, 0);
    this.physics.add.existing(this.whoZone);

    const camera = this.cameras.main;
    camera.setZoom(4);
    camera.setBackgroundColor("#6495ED");
    camera.startFollow(this.grinch);

    this.keys = this.input.keyboard!.createCursorKeys();

    for (let i = 0; i < 4; i++) {
      const heart = this.add.image(400 + i * 20, 305, "heart");
      heart.setScrollFactor(0);
      heart.setScale(0.01);
      this.hearts.push(heart);
    }

    // this.scene.launch("HUD");

    // Collision detection
    this.physics.add.collider(this.grinch, this.chimney, () => {
      if (!this.won && this.grinchHasPresent) {
        this.won = true;
        alert("YOU WIN!");
        window.location.reload();
      }
    });

    this.physics.add.overlap(this.grinch, this.present, () => {
      this.grinchHasPresent = true;
    });

    this.physics.add.overlap(this.grinch, this.whoZone, () => {
      this.whoIsMoving = true;
    });

    this.physics.add.overlap(this.grinch, this.who, () => {
      this.grinchHasPresent = false;
      this.whoIsMoving = false;

      this.lives -= 1;

      if (this.lives === 0) {
        alert("YOU LOST TO THE WHO!");
        window.location.reload();
      }

      const lastHeart = this.hearts.splice(-1)[0];
      lastHeart.destroy();

      this.grinch.x = positions.grinch.x;
      this.grinch.y = positions.grinch.y;

      this.present.x = positions.present.x;
      this.present.y = positions.present.y;

      this.who.x = positions.who.x;
      this.who.y = positions.who.y;
      this.who.setVelocity(0);
    });

    this.physics.add.collider(this.grinch, this.tree);
    this.physics.add.collider(this.grinch, this.bed);
    this.physics.add.collider(this.who, this.tree);
  }

  update(): void {
    if (this.keys.up.isDown) {
      this.grinch.setVelocityY(-velocity);
    } else if (this.keys.down.isDown) {
      this.grinch.setVelocityY(velocity);
    } else {
      this.grinch.setVelocityY(0);
    }

    if (this.keys.left.isDown) {
      this.grinch.setVelocityX(-velocity);
    } else if (this.keys.right.isDown) {
      this.grinch.setVelocityX(velocity);
    } else {
      this.grinch.setVelocityX(0);
    }

    if (this.grinchHasPresent) {
      this.present.x = this.grinch.x;
      this.present.y = this.grinch.y + 10;
    }

    if (this.whoIsMoving) {
      this.physics.moveToObject(this.who, this.grinch, 20);
    }
  }
}

export default Main;
