class Title extends Phaser.Scene {
  constructor() {
    super("Title");
  }

  create() {
    // TODO: show title with play button
    this.scene.start("Main");
  }
}

export default Title;
