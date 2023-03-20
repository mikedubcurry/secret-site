const charWidth = 5;
let RANDOMNESS = .95;
let bits = Array.from(Array(16)).map(() => {
  return {
    x: Math.floor(Math.random() * 12) * 25,
    y: Math.floor(Math.random() * 6) * 25,
  };
});
let wall = [
  { x: 50, y: 50 },
  { x: 100, y: 50 },
  { x: 100, y: 100 },
];

export const startGame = (canvas) => {
  const w = canvas.width;
  const h = canvas.height;
  const ctx = canvas.getContext("2d");
  let score = 0;

  let charCoors = { x: w / 2, y: h / 2 };

  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
        if (charCoors.y >= charWidth && !isCollision({x: charCoors.x, y:  charCoors.y - charWidth}))
          charCoors.y = charCoors.y - charWidth;
        break;
      case "ArrowDown":
        if (charCoors.y < h - charWidth && !isCollision({x: charCoors.x, y: charCoors.y + charWidth}))
          charCoors.y = charCoors.y + charWidth;
        break;
      case "ArrowLeft":
        if (charCoors.x >= charWidth && !isCollision({x: charCoors.x - charWidth, y: charCoors.y}))
          charCoors.x = charCoors.x - charWidth;
        break;
      case "ArrowRight":
        if (charCoors.x < w - charWidth && !isCollision({x: charCoors.x + charWidth, y: charCoors.y}))
          charCoors.x = charCoors.x + charWidth;
        isCollision(charCoors);
        break;
    }
  });

  const gameLoop = () => {
    fillBg(ctx, w, h);
       if(Math.random() > RANDOMNESS)
       bits = bits.map((bit) => {
         let rX = Math.random();
         let rY = Math.random();

         if(rX <= .5) {
           if(bit.x < w - charWidth) bit.x += charWidth
         } else {
           if(bit.x >= charWidth) bit.x -= charWidth
         }
         if(rY <= .5) {
           if(bit.y < h - charWidth) bit.y += charWidth
         } else {
           if(bit.y >= charWidth) bit.y -= charWidth
         }
         return bit

       });
        bits.forEach(({ x, y }) => fillBit(ctx, x, y));
    fillChar(ctx, charCoors);
    fillWall(ctx, wall);
       if (checkHit(charCoors)) {
         bits = bits.filter(({ x, y }) => {
           if (x === charCoors.x && y === charCoors.y) return false;
           return true;
         });
         score += 1;
       }

    requestAnimationFrame(gameLoop);
  };
  fillBg(ctx, w, h);
  gameLoop();
};

const fillBg = (ctx, w, h) => {
  ctx.fillStyle = "#16161d";
  ctx.fillRect(0, 0, w, h);
};

const fillWall = (ctx, wallPoints) => {
  let [p1, ...pn] = wallPoints;
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  for (const p of pn) {
    ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
};

const isCollision = (coords) => {
  // bug: cant move across top track y:0 x:0-500, same for y: 3
  for (let i = 0; i < wall.length - 1; i += 1) {
    let p1 = wall[i];
    let p2 = wall[i + 1];
    let slope = (p2.y - p1.y) / (p2.x - p1.x);
    if (!Number.isFinite(slope)) {
      if (p1.x === coords.x) {
        let ys = [coords.y, p1.y, p2.y].sort();
        if (ys[1] !== coords.y) return true;
      }
    } else {
      let yIntercept = -1 * p1.x * slope + p1.y;
      if (coords.x * slope + yIntercept === coords.y && coords.x >= p1.x && coords.x <= p2.x) return true;
    }
  }
};

const fillChar = (ctx, coords) => {
  ctx.fillStyle = "#00ff00";
  ctx.fillRect(coords.x, coords.y, charWidth, charWidth);
};

const fillBit = (ctx, x, y) => {
  ctx.fillStyle = "#ff0";
  ctx.fillRect(x, y, charWidth, charWidth);
};

const checkHit = (coords) => {
  let hit = bits.filter((bit) => bit.x === coords.x && bit.y === coords.y).length > 0;
  if (hit) {
    // make game a little harder at the end
    if(bits.length <= 4) RANDOMNESS = .7
    return true;
  }
};
