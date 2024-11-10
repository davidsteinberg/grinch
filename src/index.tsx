import "./index.css";
import Phaser from "phaser";
import scenes from "./scenes";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      // debug: true,
    },
  },
  input: {
    keyboard: true,
  },
  scene: scenes,
  parent: "root",
};

const game = new Phaser.Game(config);

export default game;
