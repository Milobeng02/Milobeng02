let angle = 0;
let armAngle = 0;
let legAngle = 0;
let headAngle = 0;
let armDirection = 1;
let legDirection = 1;
let headDirection = 1;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(175, 110, 110);
  rotateY(angle);
  angle += 0.01;

  // Head
  push();
  fill(255, 224, 189);
  translate(0, -150, 0);
  rotateX(headAngle);
  headAngle += 0.01 * headDirection;
  if (headAngle > QUARTER_PI || headAngle < -QUARTER_PI) {
    headDirection *= -1;
  }
  ellipsoid(50, 60, 50);
  pop();

  // Hair
  push();
  fill(150, 0, 150);
  translate(0, -200, 0);
  rotateX(HALF_PI);
  cone(60, 100);
  pop();

  // Eyes
  push();
  fill(255);
  translate(-20, -150, 50);
  sphere(10);
  translate(40, 0, 0);
  sphere(10);
  pop();

  // Eye details
  push();
  fill(255, 0, 0);
  translate(-20, -150, 55);
  sphere(5);
  translate(40, 0, 0);
  sphere(5);
  pop();

  // Mouth
  push();
  fill(150, 75, 0);
  translate(0, -120, 50);
  box(30, 10, 1);
  pop();

  // Body
  push();
  fill(0, 150, 0);
  translate(0, -50, 0);
  box(80, 100, 40);
  pop();

  // Left Arm
  push();
  fill(255, 224, 189);
  translate(-60, -70, 0);
  rotateZ(armAngle);
  armAngle += 0.01 * armDirection;
  if (armAngle > QUARTER_PI || armAngle < -QUARTER_PI) {
    armDirection *= -1;
  }
  box(20, 80, 20);
  pop();

  // Right Arm
  push();
  fill(255, 224, 189);
  translate(60, -70, 0);
  rotateZ(-armAngle);
  box(20, 80, 20);
  pop();

  // Left Leg
  push();
  fill(0, 100, 0);
  translate(-20, 50, 0);
  rotateX(legAngle);
  legAngle += 0.01 * legDirection;
  if (legAngle > QUARTER_PI || legAngle < -QUARTER_PI) {
    legDirection *= -1;
  }
  box(30, 100, 30);
  pop();

  // Right Leg
  push();
  fill(0, 100, 0);
  translate(20, 50, 0);
  rotateX(-legAngle);
  box(30, 100, 30);
  pop();

  // Feet
  push();
  fill(0, 50, 0);
  translate(-20, 100, 15);
  box(30, 10, 50);
  translate(40, 0, 0);
  box(30, 10, 50);
  pop();
}

orbitControl();
