const grinch = {
  x: 365,
  y: 125,
  scale: 0.12,
  zone: {
    x: 44,
    y: 225,
    width: 133,
    height: 133,
  },
  velocity: 100,
  presentYOffset: 10,
};

const npc = {
  who: {
    x: 360,
    y: 255,
    scale: 0.14,
    zone: {
      size: 100,
    },
    velocity: 25,
  },
  fox: {
    x: 120,
    y: 125,
    scale: 0.08,
    zone: {
      size: 100,
    },
    velocity: 25,
  },
};

const tree = {
  x: 175,
  y: 225,
  scale: 0.08,
  zone: {
    x: 185,
    y: 275,
    width: 30,
    height: 40,
  },
  innerZone: {
    x: 130,
    y: 1000,
    width: 425,
    height: 650,
  },
  fall: {
    x: -38,
    y: 42,
    rotation: -1.5,
    duration: 200,
  },
  fallenZone: {
    x: 75,
    y: 450,
    width: 1000,
    height: 750,
  },
};

const hud = {
  background: {
    x: 510,
    y: 0,
    width: 1100,
    height: 205,
    color: 0x00000,
    alpha: 0.1,
  },
  heart: {
    x: 50,
    xOffset: 68,
    y: 50,
    scale: 0.25,
    fadeDuration: 400,
  },
  levelName: {
    x: 785,
    y: 25,
    size: 50,
    color: "black",
  },
  joystick: {
    background: {
      x: 900,
      y: 650,
      radius: 90,
      color: 0x000000,
      alpha: 0.1,
    },
    x: 900,
    y: 650,
    radius: 40,
    color: 0xffffff,
    alpha: 0.7,
    move: {
      x: { min: 840, max: 960 },
      y: { min: 590, max: 710 },
    },
    snapDuration: 50,
  },
  alert: {
    x: 550,
    y: 380,
    width: 600,
    height: 300,
    color: 0xff9900,
    alpha: 1,
    text: {
      x: 550,
      y: 345,
      size: 30,
      color: "rgb(10, 50, 160)",
    },
    button1: {
      x: 550,
      y: 430,
      width: 120,
      height: 35,
      color: 0xcc0000,
      alpha: 1,
      text: {
        size: 20,
        color: "white",
      },
    },
    // button2: {
    //   x: 650,
    //   y: 410,
    //   width: 100,
    //   height: 30,
    //   color: 0xcc0000,
    //   alpha: 1,
    //   text: {
    //     size: 15,
    //     color: "white",
    //   },
    // },
  },
};

const walls = {
  color: 0x33ff33,
  top: {
    x: 235,
    y: 50,
    width: 580,
    height: 110,
  },
  right: {
    x: 465,
    y: 200,
    width: 120,
    height: 250,
  },
  bottom: {
    x: 235,
    y: 360,
    width: 580,
    height: 110,
  },
  left: {
    x: 10,
    y: 200,
    width: 130,
    height: 250,
  },
  line: {
    color: 0x11dd11,
    lines: [
      { x: 570, y: 50, x1: 0, y1: 0, x2: -110, y2: 110 },
      { x: 460, y: 360, x1: 0, y1: 0, x2: 110, y2: 110 },
      { x: 20, y: 50, x1: 0, y1: 0, x2: 110, y2: 110 },
      { x: 130, y: 360, x1: 0, y1: 0, x2: -110, y2: 110 },
    ],
  },
};

const constants = {
  zoom: 4,
  lives: 4,
  grinch,
  npc,
  tree,
  hud,
  walls,
  present: {
    x: 205,
    y: 255,
    scale: 0.1,
  },
  chimney: {
    x: 390,
    y: 100,
    scale: 0.12,
  },
  board: {
    x: 260,
    y: 175,
    scale: 0.08,
  },
  bed: {
    scale: 0.14,
  },
  floor: {
    color: 0x6495ed,
  },
};

export default constants;
