class Loading extends Phaser.Scene {
  constructor() {
    super("Loading");
  }

  preload() {
    this.load.image("grinch", "img/grinch.png");
    this.load.image("squeaky_board", "img/squeaky_board.png");
    this.load.image("chimney", "img/chimney.png");
    this.load.image("tree", "img/tree.png");
    this.load.image("present", "img/present.png");
    this.load.image("bed", "img/bed.png");
    this.load.image("fox", "img/fox.png");
    this.load.image("who", "img/who.png");
    this.load.image("heart", "img/heart.png");
  }

  create() {
    this.scene.start("Title");
  }
}

export default Loading;
