
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const duckImg = new Image();
const snackImg = new Image();
const rugBagImg = new Image();

duckImg.src = 'assets/duck.png';
snackImg.src = 'assets/meme_snack.png';
rugBagImg.src = 'assets/rug_bag.png';

let duck = {
  x: 50,
  y: window.innerHeight / 2,
  width: 50,
  height: 50,
  velocity: 0
};

let gravity = 0.5;
let lift = -8;
let snacks = [];
let bags = [];
let score = 0;
let frame = 0;
let gameOver = false;

function drawDuck() {
  ctx.drawImage(duckImg, duck.x, duck.y, duck.width, duck.height);
}

function drawSnacks() {
  snacks.forEach(s => ctx.drawImage(snackImg, s.x, s.y, 30, 30));
}

function drawBags() {
  bags.forEach(b => ctx.drawImage(rugBagImg, b.x, b.y, 40, 40));
}

function showScore() {
  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function update() {
  if (gameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  duck.velocity += gravity;
  duck.y += duck.velocity;

  if (duck.y + duck.height > canvas.height || duck.y < 0) {
    gameOver = true;
  }

  if (frame % 100 === 0) {
    snacks.push({
      x: canvas.width,
      y: Math.random() * (canvas.height - 50)
    });
  }

  if (frame % 150 === 0) {
    bags.push({
      x: canvas.width,
      y: Math.random() * (canvas.height - 50)
    });
  }

  snacks.forEach((s, i) => {
    s.x -= 2;
    if (
      duck.x < s.x + 30 &&
      duck.x + duck.width > s.x &&
      duck.y < s.y + 30 &&
      duck.y + duck.height > s.y
    ) {
      snacks.splice(i, 1);
      score++;
    }
  });

  bags.forEach((b, i) => {
    b.x -= 3;
    if (
      duck.x < b.x + 40 &&
      duck.x + duck.width > b.x &&
      duck.y < b.y + 40 &&
      duck.y + duck.height > b.y
    ) {
      gameOver = true;
    }
  });

  drawDuck();
  drawSnacks();
  drawBags();
  showScore();

  frame++;
  if (!gameOver) requestAnimationFrame(update);
  else {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
  }
}

function flap() {
  duck.velocity = lift;
}

document.addEventListener("keydown", flap);
canvas.addEventListener("click", flap);
canvas.addEventListener("touchstart", function (e) {
  e.preventDefault();
  flap();
}, { passive: false });

window.onload = function () {
  let loaded = 0;
  const total = 3;
  function checkLoaded() {
    loaded++;
    if (loaded === total) {
      update();
    }
  }
  duckImg.onload = checkLoaded;
  snackImg.onload = checkLoaded;
  rugBagImg.onload = checkLoaded;
};
