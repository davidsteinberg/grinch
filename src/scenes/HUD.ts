import c from "./constants";
import events from "./events";

type ButtonProperties = {
  text: string;
  action(): void;
};

type AlertProperties = {
  message: string;
  button1?: ButtonProperties;
  button2?: ButtonProperties;
};

const joystickXTotal = c.hud.joystick.move.x.max - c.hud.joystick.move.x.min;
const joystickYTotal = c.hud.joystick.move.y.max - c.hud.joystick.move.y.min;

class HUD extends Phaser.Scene {
  hearts: Phaser.GameObjects.Image[] = [];

  constructor() {
    super("HUD");
  }

  addHearts() {
    for (let i = 0; i < c.lives; i++) {
      const heart = this.add.image(
        c.hud.heart.x + i * c.hud.heart.xOffset,
        c.hud.heart.y,
        "heart"
      );
      heart.setScrollFactor(0);
      heart.setScale(c.hud.heart.scale);
      this.hearts.push(heart);
    }
  }

  create() {
    this.add.rectangle(
      c.hud.background.x,
      c.hud.background.y,
      c.hud.background.width,
      c.hud.background.height,
      0x000000,
      0.1
    );

    this.addHearts();

    const levelName = this.add.text(
      c.hud.levelName.x,
      c.hud.levelName.y,
      "Level 1",
      {
        fontFamily: "monospace",
        fontSize: `${c.hud.levelName.size}px`,
        color: c.hud.levelName.color,
      }
    );

    levelName.setScrollFactor(0);

    events.on("Lost Life", (callback: () => void) => {
      const lastHeart = this.hearts.splice(-1)[0];

      this.tweens.add({
        targets: [lastHeart],
        scale: 0,
        duration: c.hud.heart.fadeDuration,
        onComplete: () => {
          lastHeart.destroy();
          callback();
        },
      });
    });

    events.on("Reset Lives", () => {
      for (const heart of this.hearts) {
        heart.destroy();
      }

      this.hearts = [];
      this.addHearts();
    });

    // Joystick
    this.add.circle(
      c.hud.joystick.background.x,
      c.hud.joystick.background.y,
      c.hud.joystick.background.radius,
      c.hud.joystick.background.color,
      c.hud.joystick.background.alpha
    );

    const joystick = this.add.circle(
      c.hud.joystick.x,
      c.hud.joystick.y,
      c.hud.joystick.radius,
      c.hud.joystick.color,
      c.hud.joystick.alpha
    );

    let moving = false;

    joystick.setInteractive();

    joystick.on("pointerdown", () => {
      moving = true;
    });

    joystick.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (moving) {
        let { x, y } = pointer;

        if (x >= c.hud.joystick.move.x.min && x <= c.hud.joystick.move.x.max) {
          joystick.x = x;
        } else if (x < c.hud.joystick.move.x.min) {
          x = c.hud.joystick.move.x.min;
        } else if (x > c.hud.joystick.move.x.max) {
          x = c.hud.joystick.move.x.max;
        }

        if (y >= c.hud.joystick.move.y.min && y <= c.hud.joystick.move.y.max) {
          joystick.y = y;
        } else if (y < c.hud.joystick.move.y.min) {
          y = c.hud.joystick.move.y.min;
        } else if (y > c.hud.joystick.move.y.max) {
          y = c.hud.joystick.move.y.max;
        }

        const deltaX = ((x - c.hud.joystick.x) / joystickXTotal) * 2;
        const deltaY = ((y - c.hud.joystick.y) / joystickYTotal) * 2;

        events.emit("Movement Change", { x: deltaX, y: deltaY });
      }
    });

    joystick.on("pointerup", () => {
      moving = false;

      this.tweens.add({
        targets: [joystick],
        x: c.hud.joystick.x,
        y: c.hud.joystick.y,
        duration: c.hud.joystick.snapDuration,
      });

      events.emit("Movement Change", { x: 0, y: 0 });
    });

    // Alert
    const alert = this.add.group();

    const alertData = {
      background: this.add.rectangle(
        c.hud.alert.x,
        c.hud.alert.y,
        c.hud.alert.width,
        c.hud.alert.height,
        c.hud.alert.color,
        c.hud.alert.alpha
      ),
      text: this.add.text(
        c.hud.alert.text.x,
        c.hud.alert.text.y,
        "You lost the present!",
        {
          fontSize: `${c.hud.alert.text.size}px`,
          color: c.hud.alert.text.color,
        }
      ),
      button1: {
        background: this.add.rectangle(
          c.hud.alert.button1.x,
          c.hud.alert.button1.y,
          c.hud.alert.button1.width,
          c.hud.alert.button1.height,
          c.hud.alert.button1.color,
          c.hud.alert.button1.alpha
        ),
        text: this.add.text(
          c.hud.alert.button1.x,
          c.hud.alert.button1.y,
          "Retry",
          {
            fontSize: `${c.hud.alert.button1.text.size}px`,
            color: c.hud.alert.button1.text.color,
          }
        ),
      },
      // button2: {
      //   background: this.add.rectangle(
      //     c.hud.alert.button2.x,
      //     c.hud.alert.button2.y,
      //     c.hud.alert.button2.width,
      //     c.hud.alert.button2.height,
      //     c.hud.alert.button2.color,
      //     c.hud.alert.button2.alpha
      //   ),
      //   text: this.add.text(
      //     c.hud.alert.button2.x,
      //     c.hud.alert.button2.y,
      //     "Main Menu",
      //     {
      //       fontSize: `${c.hud.alert.button2.text.size}px`,
      //       color: c.hud.alert.button2.text.color,
      //     }
      //   ),
      // },
    };

    alert.add(alertData.background);
    alert.add(alertData.text);
    alert.add(alertData.button1.background);
    alert.add(alertData.button1.text);
    alert.setAlpha(0);
    alert.setActive(false);

    alertData.text.setOrigin(0.5, 0.5);

    alertData.button1.text.setOrigin(0.5, 0.5);
    alertData.button1.background.setInteractive();

    // alert.button2.text.setOrigin(0.5, 0.5);
    // alert.button2.background.setInteractive();

    events.on("Alert", (p: AlertProperties) => {
      alertData.text.text = p.message;
      alertData.button1.text.text = p.button1!.text;
      alertData.button1.background.on("pointerdown", () => {
        p.button1!.action();
        alert.setAlpha(0);
        alert.setActive(false);
      });

      alert.setAlpha(1);
      alert.setActive(true);
    });
  }
}

export default HUD;
