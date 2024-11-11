import c from "./constants";

class Title extends Phaser.Scene {
  constructor() {
    super("Title");
  }

  create() {
    const camera = this.cameras.main;
    camera.setBackgroundColor(c.floor.color);

    const grinch = this.add.image(910, 130, "grinch");
    grinch.scale = c.grinch.scale * 4;

    const tree = this.add.image(150, 525, "tree");
    tree.scale = c.tree.scale * 4;

    const present = this.add.image(300, 650, "present");
    present.scale = c.present.scale * 4;

    this.add.text(370, 160, "The\nSneaky\nGrinch", {
      fontFamily: "monospace",
      fontSize: "100px",
    });
    this.add.text(415, 490, "A Draper Brothers Game", {
      fontFamily: "monospace",
      fontSize: "20px",
    });

    const playBackground = this.add.rectangle(825, 660, 150, 60, 0x222222, 1);
    const playText = this.add.text(825, 660, "Play", {
      fontFamily: "monospace",
      fontSize: "35px",
    });

    playText.setOrigin(0.5, 0.5);

    playBackground.setInteractive();
    playBackground.on("pointerup", () => {
      const camera = this.cameras.main;

      camera.on("camerafadeoutcomplete", () => {
        setTimeout(() => {
          this.scene.start("Main");
        }, 200);
      });

      camera.fadeOut(1000, 0, 0, 0);
    });
  }
}

export default Title;
