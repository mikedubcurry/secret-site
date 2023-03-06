const charWidth = 5;
let bits = Array.from(Array(16)).map(() => {
  return {
    x: Math.floor(Math.random() * 12) * 25,
    y: Math.floor(Math.random() * 6) * 25,
  };
});

export const startGame = (canvas) => {
  const w = canvas.width;
  const h = canvas.height;
  const ctx = canvas.getContext("2d");
  let score = 0;

  let i = w / 2,
    j = h / 2;
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
        if (j >= charWidth) j -= charWidth;
        break;
      case "ArrowDown":
        if (j < h - charWidth) j += charWidth;
        break;
      case "ArrowLeft":
        if (i >= charWidth) i -= charWidth;
        break;
      case "ArrowRight":
        if (i < w - charWidth) i += charWidth;
        break;
    }
  });

  const gameLoop = () => {
    fillBg(ctx, w, h);
    bits.forEach(({x, y}) => fillBit(ctx, x, y))
    fillChar(ctx, i, j);

    if(checkHit(i, j)) {
      bits = bits.filter(({x, y}) =>{
        if(x === i && y === j) return false;
        return true
      })
      score += 1;
      console.log(score)
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

const fillChar = (ctx, x, y) => {
  ctx.fillStyle = "#00ff00";
  ctx.fillRect(x, y, charWidth, charWidth);
};

const fillBit = (ctx, x, y) => {
  ctx.fillStyle = "#ff0";
  ctx.fillRect(x, y, charWidth, charWidth);
};

const checkHit = (x, y) => {
  let hit = bits.filter(bit => bit.x === x && bit.y === y).length > 0;
  if(hit) {
    return true;
  }
}
