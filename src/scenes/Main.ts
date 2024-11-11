import c from "./constants";
import events from "./events";

class Main extends Phaser.Scene {
  present!: Phaser.Physics.Arcade.Sprite;
  tree!: Phaser.Physics.Arcade.Sprite;
  grinch!: Phaser.Physics.Arcade.Sprite;
  bed!: Phaser.Physics.Arcade.Sprite;
  squeaky_board!: Phaser.Physics.Arcade.Sprite;
  chimney!: Phaser.Physics.Arcade.Sprite;
  fox!: Phaser.Physics.Arcade.Sprite;
  who!: Phaser.Physics.Arcade.Sprite;
  whoZone!: Phaser.GameObjects.Rectangle;
  foxZone!: Phaser.GameObjects.Rectangle;
  treeZone!: Phaser.GameObjects.Rectangle;
  treeZoneCollider!: Phaser.Physics.Arcade.Collider;

  fading = true;
  grinchHasPresent = false;
  caught = false;
  won = false;
  whoIsMoving = false;
  foxIsMoving = false;
  treeIsDown = false;
  lives = c.lives;

  movementX = 0.0;
  movementY = 0.0;

  constructor() {
    super("Main");
  }

  create() {
    // Walls
    const wallTop = this.add.rectangle(
      c.walls.top.x,
      c.walls.top.y,
      c.walls.top.width,
      c.walls.top.height,
      c.walls.color,
      1
    );
    this.physics.add.existing(wallTop, true);

    const wallRight = this.add.rectangle(
      c.walls.right.x,
      c.walls.right.y,
      c.walls.right.width,
      c.walls.right.height,
      c.walls.color,
      1
    );
    this.physics.add.existing(wallRight, true);

    const wallBottom = this.add.rectangle(
      c.walls.bottom.x,
      c.walls.bottom.y,
      c.walls.bottom.width,
      c.walls.bottom.height,
      c.walls.color,
      1
    );
    this.physics.add.existing(wallBottom, true);

    const wallLeft = this.add.rectangle(
      c.walls.left.x,
      c.walls.left.y,
      c.walls.left.width,
      c.walls.left.height,
      c.walls.color,
      1
    );
    this.physics.add.existing(wallLeft, true);

    for (const line of c.walls.line.lines) {
      this.add.line(
        line.x,
        line.y,
        line.x1,
        line.y1,
        line.x2,
        line.y2,
        c.walls.line.color,
        1
      );
    }

    // Board
    this.squeaky_board = this.physics.add.sprite(
      c.board.x,
      c.board.y,
      "squeaky_board"
    );
    this.squeaky_board.setScale(c.board.scale);

    // Chimney
    this.chimney = this.physics.add.sprite(c.chimney.x, c.chimney.y, "chimney");
    this.chimney.setImmovable(true);
    this.chimney.setScale(c.chimney.scale);

    // Bed
    this.bed = this.physics.add.sprite(c.npc.who.x, c.npc.who.y, "bed");
    this.bed.setImmovable(true);
    this.bed.setScale(c.bed.scale);

    // Fox
    this.fox = this.physics.add.sprite(c.npc.fox.x, c.npc.fox.y, "fox");
    this.fox.setScale(c.npc.fox.scale);
    this.fox.setSize(c.npc.fox.innerZone.width, c.npc.fox.innerZone.height);
    this.fox.setOffset(c.npc.fox.innerZone.x, c.npc.fox.innerZone.y);

    // Who
    this.who = this.physics.add.sprite(c.npc.who.x, c.npc.who.y, "who");
    this.who.setScale(c.npc.who.scale);
    this.who.setSize(c.npc.who.innerZone.width, c.npc.who.innerZone.height);
    this.who.setOffset(c.npc.who.innerZone.x, c.npc.who.innerZone.y);

    // Present
    this.present = this.physics.add.sprite(c.present.x, c.present.y, "present");
    this.present.setScale(c.present.scale);

    // Grinch
    this.grinch = this.physics.add.sprite(c.grinch.x, c.grinch.y, "grinch");

    this.grinch.setScale(c.grinch.scale);
    this.grinch.setSize(c.grinch.zone.width, c.grinch.zone.height);
    this.grinch.setOffset(c.grinch.zone.x, c.grinch.zone.y);

    // Tree comes after things, so it goes in front of them
    this.tree = this.physics.add.sprite(c.tree.x, c.tree.y, "tree");
    this.tree.setImmovable(true);
    this.tree.setScale(c.tree.scale);
    this.tree.setSize(c.tree.innerZone.width, c.tree.innerZone.height);
    this.tree.setOffset(c.tree.innerZone.x, c.tree.innerZone.y);

    // Tree zone
    this.treeZone = this.add.rectangle(
      c.tree.zone.x,
      c.tree.zone.y,
      c.tree.zone.width,
      c.tree.zone.height,
      0x000000,
      0
    );
    this.physics.add.existing(this.treeZone, true);

    // Who zone
    this.whoZone = this.add.rectangle(
      c.npc.who.x,
      c.npc.who.y,
      c.npc.who.zone.size,
      c.npc.who.zone.size,
      0x000000,
      0
    );
    this.physics.add.existing(this.whoZone);

    // Fox zone
    this.foxZone = this.add.rectangle(
      c.npc.fox.x,
      c.npc.fox.y,
      c.npc.fox.zone.size,
      c.npc.fox.zone.size,
      0x000000,
      0
    );
    this.physics.add.existing(this.foxZone);

    // Camera
    const camera = this.cameras.main;
    camera.setZoom(c.zoom);
    camera.setBackgroundColor(c.floor.color);
    camera.startFollow(this.grinch);

    // Movement
    const keyboard = this.input.keyboard!;

    keyboard.on("keydown-UP", () => (this.movementY = -1));
    keyboard.on("keyup-UP", () =>
      this.movementY === -1 ? (this.movementY = 0) : null
    );

    keyboard.on("keydown-DOWN", () => (this.movementY = 1));
    keyboard.on("keyup-DOWN", () =>
      this.movementY === 1 ? (this.movementY = 0) : null
    );

    keyboard.on("keydown-LEFT", () => (this.movementX = -1));
    keyboard.on("keyup-LEFT", () =>
      this.movementX === -1 ? (this.movementX = 0) : null
    );

    keyboard.on("keydown-RIGHT", () => (this.movementX = 1));
    keyboard.on("keyup-RIGHT", () =>
      this.movementX === 1 ? (this.movementX = 0) : null
    );

    events.on("Movement Change", (p: { x: number; y: number }) => {
      this.movementX = p.x;
      this.movementY = p.y;
    });

    // Collision detection
    this.physics.add.collider(this.grinch, wallTop);
    this.physics.add.collider(this.grinch, wallRight);
    this.physics.add.collider(this.grinch, wallBottom);
    this.physics.add.collider(this.grinch, wallLeft);

    this.physics.add.collider(this.grinch, this.chimney, () => {
      if (!this.won && this.grinchHasPresent) {
        this.won = true;
        this.scene.pause();
        events.emit("Alert", {
          message: "You won! Level 2 coming soon!",
          button1: {
            text: "Replay",
            action: () => {
              this.lives = c.lives;
              this.cleanUp();
              this.resetTree();
              events.emit("Reset Lives");
            },
          },
        });
        return;
      }
    });

    this.physics.add.overlap(this.grinch, this.present, () => {
      this.grinchHasPresent = true;
      this.children.bringToTop(this.present);
      this.children.bringToTop(this.tree);
    });

    this.physics.add.overlap(this.grinch, this.whoZone, () => {
      this.whoIsMoving = true;
    });

    this.physics.add.overlap(this.grinch, this.foxZone, () => {
      this.foxIsMoving = true;
    });

    this.physics.add.overlap(this.grinch, this.squeaky_board, () => {
      this.whoIsMoving = true;
      this.foxIsMoving = true;
    });

    const getCaught = (): void => {
      if (this.caught) {
        return;
      }

      this.caught = true;
      this.scene.pause();

      this.grinch.setTint(0x000000);
      if (this.grinchHasPresent) {
        this.present.setTint(0x000000);
        this.children.sendToBack(this.present);
      }

      this.lives -= 1;

      events.emit("Lost Life", () => {
        if (this.lives === 0) {
          events.emit("Alert", {
            message: "You lost the present!",
            button1: {
              text: "Retry",
              action: () => {
                this.lives = c.lives;
                this.cleanUp();
                this.resetTree();
                events.emit("Reset Lives");
              },
            },
          });
        } else {
          this.cleanUp();
        }
      });
    };

    this.physics.add.overlap(this.grinch, this.who, getCaught);
    this.physics.add.overlap(this.grinch, this.fox, getCaught);

    this.physics.add.collider(this.grinch, this.tree);

    this.treeZoneCollider = this.physics.add.collider(
      this.grinch,
      this.treeZone,
      () => {
        if (this.grinch.x < this.tree.x) {
          return true;
        }

        if (!this.treeIsDown) {
          this.treeIsDown = true;

          this.tweens.add({
            targets: this.tree,
            x: `-=${-c.tree.fall.x}`,
            y: `+=${c.tree.fall.y}`,
            rotation: c.tree.fall.rotation,
            duration: c.tree.fall.duration,
            onCompleteHandler: () => {
              this.whoIsMoving = true;
              this.foxIsMoving = true;
              this.tree.setSize(
                c.tree.fallenZone.width,
                c.tree.fallenZone.height
              );
              this.tree.setOffset(c.tree.fallenZone.x, c.tree.fallenZone.y);
              setTimeout(() => {
                this.treeZoneCollider.active = false;
              }, 100);
            },
          });
        }
      }
    );

    this.physics.add.collider(this.grinch, this.bed);
    this.physics.add.collider(this.who, this.tree);

    // HUD
    camera.on("camerafadeincomplete", () => {
      this.fading = false;
      this.scene.run("HUD");
    });

    camera.fadeIn(1200, 0, 0, 0);
  }

  cleanUp() {
    this.grinch.setTint(0xffffff);
    this.grinch.x = c.grinch.x;
    this.grinch.y = c.grinch.y;
    this.grinch.setVelocity(0);

    this.present.x = c.present.x;
    this.present.y = c.present.y;
    this.present.setTint(0xffffff);

    this.who.x = c.npc.who.x;
    this.who.y = c.npc.who.y;
    this.who.setVelocity(0);

    this.fox.x = c.npc.fox.x;
    this.fox.y = c.npc.fox.y;
    this.fox.setVelocity(0);

    this.grinchHasPresent = false;
    this.won = false;
    this.whoIsMoving = false;
    this.foxIsMoving = false;
    this.movementX = 0;
    this.movementY = 0;

    this.caught = false;
    this.scene.resume();
  }

  resetTree() {
    this.tree.x = c.tree.x;
    this.tree.y = c.tree.y;
    this.tree.setSize(c.tree.innerZone.width, c.tree.innerZone.height);
    this.tree.setOffset(c.tree.innerZone.x, c.tree.innerZone.y);
    this.tree.setRotation(0);
    this.treeIsDown = false;
    this.treeZoneCollider.active = true;
  }

  update(): void {
    if (this.fading) {
      return;
    }

    this.grinch.setVelocityX(c.grinch.velocity * this.movementX);
    this.grinch.setVelocityY(c.grinch.velocity * this.movementY);

    if (this.grinchHasPresent) {
      this.present.x = this.grinch.x;
      this.present.y = this.grinch.y + c.grinch.presentYOffset;
    }

    if (this.whoIsMoving) {
      this.physics.moveToObject(this.who, this.grinch, c.npc.who.velocity);
    } else {
      this.who.setVelocity(0);
    }

    if (this.foxIsMoving) {
      this.physics.moveToObject(this.fox, this.grinch, c.npc.fox.velocity);
    } else {
      this.fox.setVelocity(0);
    }
  }
}

export default Main;
