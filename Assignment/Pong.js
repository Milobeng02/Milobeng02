let ball;
let leftPaddle, rightPaddle;
let leftScore = 0, rightScore = 0;
let bgImage, bgSound, paddleHitSound, scoreSound, startSound;
let gameStarted = false;

function preload() {
  bgImage = loadImage('bg.png');
  bgSound = loadSound('bg.mp3');
  paddleHitSound = loadSound('hit.mp3');
  scoreSound = loadSound('score.mp3');
  startSound = loadSound('start.wav');
}

function setup() {
  createCanvas(1280, 720);
  ball = new Ball();
  leftPaddle = new Paddle(true);
  rightPaddle = new Paddle(false);
  bgSound.loop();
}

function draw() {
  if (!gameStarted) {
    image(bgImage, 0, 0, width, height);
  } else {
    drawGradient();
    ball.update();
    ball.show();

    leftPaddle.update();
    leftPaddle.show();
    
    rightPaddle.updateAI(ball);
    rightPaddle.show();

    textSize(32);
    textAlign(CENTER, CENTER);
    fill(255);
    text(leftScore, width / 4, 50);
    text(rightScore, 3 * width / 4, 50);
  }
}

function keyPressed() {
  if (key === 'Enter') {
    if (!gameStarted) {
      startSound.play();
      gameStarted = true;
    }
  }
  
  if (gameStarted) {
    if (key == 'w' || key == 'W') {
      leftPaddle.move(-10);
    } else if (key == 's' || key == 'S') {
      leftPaddle.move(10);
    }
  }
}

function keyReleased() {
  if (gameStarted) {
    if (key == 'w' || key == 'W' || key == 's' || key == 'S') {
      leftPaddle.move(0);
    }
  }
}

function mousePressed() {
  if (!gameStarted) {
    startSound.play();
    gameStarted = true;
  }
}

class Ball {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = width / 2;
    this.y = height / 2;
    this.xspeed = random(3, 5) * (random() > 0.5 ? 2 : -2);
    this.yspeed = random(3, 5) * (random() > 0.5 ? 2 : -2);
    this.r = 12;
  }

  update() {
    this.x += this.xspeed;
    this.y += this.yspeed;

    if (this.y < this.r || this.y > height - this.r) {
      this.yspeed *= -1;
    }

    if (this.x - this.r < 0) {
      rightScore++;
      scoreSound.play();
      this.reset();
    }

    if (this.x + this.r > width) {
      leftScore++;
      scoreSound.play();
      this.reset();
    }

    this.checkPaddle(leftPaddle);
    this.checkPaddle(rightPaddle);
  }

  checkPaddle(paddle) {
    if (this.y > paddle.y && this.y < paddle.y + paddle.h) {
      if ((this.x - this.r < paddle.x + paddle.w && this.xspeed < 0 && paddle.isLeft) ||
          (this.x + this.r > paddle.x && this.xspeed > 0 && !paddle.isLeft)) {
        this.xspeed *= -1.1;
        this.yspeed *= 1.1;
        paddleHitSound.play();
      }
    }
  }

  show() {
    fill(255);
    ellipse(this.x, this.y, this.r * 2);
  }
}

class Paddle {
  constructor(isLeft) {
    this.w = 10;
    this.h = 200;
    this.isLeft = isLeft;
    this.x = isLeft ? 0 : width - this.w;
    this.y = height / 2 - this.h / 2;
    this.yspeed = 0;
  }

  update() {
    this.y += this.yspeed;
    this.y = constrain(this.y, 0, height - this.h);
  }

  updateAI(ball) {
    if (ball.y < this.y + this.h / 2) {
      this.yspeed = -10;
    } else {
      this.yspeed = 10;
    }
    this.update();
  }

  move(steps) {
    this.yspeed = steps;
  }

  show() {
    fill(255);
    rect(this.x, this.y, this.w, this.h);
  }
}

function drawGradient() {
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(0, 0, 255), color(0, 255, 255), inter);
    stroke(c);
    line(0, y, width, y);
  }
}
