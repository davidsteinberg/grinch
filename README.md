import Phaser from "phaser";

class Main extends Phaser.Scene {
slime!: Phaser.Physics.Arcade.Sprite;
npc!: Phaser.Physics.Arcade.Sprite;
keys!: Phaser.Types.Input.Keyboard.CursorKeys;

constructor() {
super("Main");
}

create() {
this.slime = this.physics.add.sprite(500, 400, "slime.blue");
this.slime.setScale(0.5);

    this.npc = this.physics.add.sprite(600, 400, "slime.blue");
    this.npc.setScale(0.5);
    this.npc.setTint(0x2fde4c);

    this.keys = this.input.keyboard!.createCursorKeys();

    this.physics.add.collider(this.slime, this.npc, () => {
      window.location.href = window.location.href;
      alert("Game Over!");
    });

    const camera = this.cameras.main;
    camera.setZoom(4);
    camera.startFollow(this.slime);

    this.scene.launch("HUD");

}

update(): void {
if (this.keys.up.isDown) {
this.slime.y -= 1;
}

    if (this.keys.down.isDown) {
      this.slime.y += 1;
    }

    if (this.keys.left.isDown) {
      this.slime.x -= 1;
    }

    if (this.keys.right.isDown) {
      this.slime.x += 1;
    }

    // this.physics.moveToObject(this.npc, this.slime, 20);

}
}

export default Main;

    // this.anims.create({
    //   key: `idle.${color}`,
    //   defaultTextureKey: `slime.${color}`,
    //   frameRate: 2,
    //   frames: [{ frame: 0 }, { frame: 1 }],
    //   repeat: -1,
    // });
