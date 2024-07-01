class Animation {
  constructor() {
    this.dash = 5; // Length of dashes
    this.gap = 5; // Length of gaps between dashes
    this.angle2 = 0; // Initial angle for dot2
    this.angle3 = -60; // Start angle for dot3 so it starts later
    this.angle1 = -120; // Start angle for dot1 so it starts later
    this.handLength = 0;
    this.speed = 6; // Speed of the swing
    this.phase = 0;
    this.shrinkFactor2 = 1;
    this.shrinkFactor3 = 1;
    this.shrinkFactor1 = 1;
    this.swipeFactor = 0; // Factor to control the swipe animation
    this.hexagonPoints = [];
    this.hexagonFactor = 0;
    this.hexagonLinesFactor = 0;
    noFill(); // No fill for the ellipse
    ellipseMode(CENTER);
  }

  setup() {
    createCanvas(1280, 720); 
    background(100, 200, 100); 
    stroke(255); 
    angleMode(DEGREES); 

    // Calculate hand length
    this.handLength = min(width, height) / 4;

    // Initialize hexagon points
    this.initHexagon();
  }

  draw() {
    background(100, 200, 100); // Clear canvas each frame
    strokeWeight(5);

    // Draw the line in the middle (60% of canvas width)
    let lineStartX = width * 0.1;
    let lineEndX = width * 0.8;
    line(lineStartX, height / 2, lineEndX, height / 2);


    let initialDot1X = -width / 2;
    let initialDot2X = -width / 2;
    let initialDot3X = -width / 2;

 
    let finalDot1X = lineStartX + (lineEndX - lineStartX) / 4;
    let finalDot2X = lineStartX + (lineEndX - lineStartX) / 2;
    let finalDot3X = lineStartX + 3 * (lineEndX - lineStartX) / 4;

    // Interpolate dot positions based on swipeFactor
    let dot1X = lerp(initialDot1X, finalDot1X, this.swipeFactor);
    let dot2X = lerp(initialDot2X, finalDot2X, this.swipeFactor);
    let dot3X = lerp(initialDot3X, finalDot3X, this.swipeFactor);
    
    // Calculate end points for lines based on angles
    let x2 = dot2X + this.handLength * cos(this.angle2 - 90) * this.shrinkFactor2;
    let y2 = height / 2 + this.handLength * sin(this.angle2 - 90) * this.shrinkFactor2;
    let x3 = dot3X + this.handLength * cos(this.angle3 - 90) * this.shrinkFactor3;
    let y3 = height / 2 + this.handLength * sin(this.angle3 - 90) * this.shrinkFactor3;
    let x1 = dot1X + this.handLength * cos(this.angle1 - 90) * this.shrinkFactor1;
    let y1 = height / 2 + this.handLength * sin(this.angle1 - 90) * this.shrinkFactor1;


    if (this.phase < 5) {
      stroke(0);
      strokeWeight(3);
      ellipse(dot1X, height / 2, 10, 10); // Dot 1
      ellipse(dot2X, height / 2, 10, 10); // Dot 2
      ellipse(dot3X, height / 2, 10, 10); // Dot 3
    }

    // Draw the lines in sequence
    if (this.phase === 0) {
      // Swipe animation from left to center
      this.swipeFactor += 0.02;
      if (this.swipeFactor >= 1) {
        this.swipeFactor = 1;
        this.phase = 1;
      }
    } else if (this.phase === 1) {
      if (frameCount > 0) {
        this.drawDashedEllipse(640, 360, 380, 380, frameCount);
      }
      line(dot2X, height / 2, x2, y2);
      this.angle2 -= this.speed;
      if (this.angle2 <= -360) {
        this.phase = 2;
      }
    } else if (this.phase === 2) {
      if (frameCount > 120) {
        this.drawDashedEllipse(780, 360, 275, 275, frameCount - 120);
      }
      line(dot2X, height / 2, x2, y2);
      if (frameCount > 180) { // Start after 3 seconds (180 frames)
        this.drawDashedEllipse(dot3X, height / 2, 380, 380, frameCount - 180);
      }
      line(dot3X, height / 2, x3, y3);
      this.angle2 -= this.speed;
      this.angle3 -= this.speed;
      if (this.angle3 <= -360) {
        this.phase = 3;
      }
    } else if (this.phase === 3) {
      if (frameCount > 180) {
        this.drawDashedEllipse(440, 360, 270, 270, frameCount - 180);
      }
      line(dot2X, height / 2, x2, y2);
      line(dot3X, height / 2, x3, y3); 
      line(dot1X, height / 2, x1, y1);
      this.angle2 -= this.speed;
      this.angle3 -= this.speed;
      this.angle1 -= this.speed;
      if (this.angle1 <= -360) {
        this.phase = 4;
      }
    } else if (this.phase === 4) {
      // Reduce the length of the lines to create the disappearing effect
      this.shrinkFactor2 -= 0.02;
      this.shrinkFactor3 -= 0.02;
      this.shrinkFactor1 -= 0.02;

      x2 = dot2X + this.handLength * cos(this.angle2 - 90) * this.shrinkFactor2;
      y2 = height / 2 + this.handLength * sin(this.angle2 - 90) * this.shrinkFactor2;
      x3 = dot3X + this.handLength * cos(this.angle3 - 90) * this.shrinkFactor3;
      y3 = height / 2 + this.handLength * sin(this.angle3 - 90) * this.shrinkFactor3;
      x1 = dot1X + this.handLength * cos(this.angle1 - 90) * this.shrinkFactor1;
      y1 = height / 2 + this.handLength * sin(this.angle1 - 90) * this.shrinkFactor1;

      line(dot2X, height / 2, x2, y2); 
      line(dot3X, height / 2, x3, y3); 
      line(dot1X, height / 2, x1, y1);

      this.angle2 -= this.speed;
      this.angle3 -= this.speed;
      this.angle1 -= this.speed;

      if (this.shrinkFactor2 <= 0 && this.shrinkFactor3 <= 0 && this.shrinkFactor1 <= 0) {
        this.phase = 5;
        this.initHexagon();
      }
    } else if (this.phase === 5) {
      this.drawHexagonAnimation();
    }
  }
  

  drawDashedEllipse(centerX, centerY, ellipseWidth, ellipseHeight, currentFrame) { 
      let currentAngle = currentFrame % 360;

    // Draw dashed lines up to the current angle
    for (let angle = 0; angle <= currentAngle; angle += 1) {
      let x1 = centerX + (ellipseWidth / 2) * cos(angle);
      let y1 = centerY + (ellipseHeight / 2) * sin(angle);
      let x2 = centerX + ((ellipseWidth / 2) + this.dash) * cos(angle);
      let y2 = centerY + ((ellipseHeight / 2) + this.dash) * sin(angle);
      
      // Draw the dash
      if (angle % (this.dash + this.gap) < this.dash) {
        line(x1, y1, x2, y2);
      }
    }
  }

  initHexagon() {
    let hexRadius = this.handLength * 1.5;
    this.hexagonPoints = [];
    for (let i = 0; i < 6; i++) {
      let angle = 60 * i;
      let x = width / 2 + hexRadius * cos(angle);
      let y = height / 2 + hexRadius * sin(angle);
      this.hexagonPoints.push(createVector(x, y));
    }
    this.hexagonFactor = 0;
    this.hexagonLinesFactor = 0;
  }

  drawHexagonAnimation() {
    stroke(255);
    strokeWeight(5);

    for (let i = 0; i < this.hexagonPoints.length; i++) {
      let start = this.hexagonPoints[i];
      let end = this.hexagonPoints[(i + 1) % this.hexagonPoints.length];
      let x = lerp(start.x, end.x, this.hexagonFactor);
      let y = lerp(start.y, end.y, this.hexagonFactor);
      line(start.x, start.y, x, y);
    }

    if (this.hexagonFactor >= 1) {
      this.fillHexagonWithLines();
    }

    this.hexagonFactor += 0.02;
    if (this.hexagonFactor >= 1) {
      this.hexagonFactor = 1;
    }
  }

  fillHexagonWithLines() {
    stroke('navy');
    strokeWeight(2);

    let hexRadius = this.handLength * 1.5;
    let spacing = 10; // Adjust spacing between lines for coarseness

    // Draw lines parallel to one hexagon side
    for (let i = -hexRadius; i <= hexRadius; i += spacing) {
      let startX = width / 2 - hexRadius + i;
      let endX = width / 2 + hexRadius + i;
      let startY = height / 2 - (3) * hexRadius / 2;
      let endY = height / 2 + (3) * hexRadius / 2;

      // Clip the lines to the hexagon boundary
      let clippedLine = this.clipLineToHexagon(startX, startY, endX, endY, hexRadius);
      if (clippedLine) {
        line(clippedLine[0], clippedLine[1], clippedLine[2], clippedLine[3]);
      }
    }
  }

  clipLineToHexagon(x1, y1, x2, y2, radius) {
    let clippedLine = [];
    for (let i = 0; i < this.hexagonPoints.length; i++) {
      let start = this.hexagonPoints[i];
      let end = this.hexagonPoints[(i + 1) % this.hexagonPoints.length];
      let intersection = this.lineIntersection(x1, y1, x2, y2, start.x, start.y, end.x, end.y);
      if (intersection) {
        clippedLine.push(intersection);
      }
    }
    if (clippedLine.length >= 2) {
      return [clippedLine[0].x, clippedLine[0].y, clippedLine[1].x, clippedLine[1].y];
    }
    return null;
  }

  lineIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    let denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (denom === 0) return null; // Parallel lines
    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
      let x = x1 + ua * (x2 - x1);
      let y = y1 + ua * (y2 - y1);
      return createVector(x, y);
    }
    return null;
  }

  restartAnimation() {
    this.phase = 0;
    this.swipeFactor = 0;
    this.shrinkFactor1 = 1;
    this.shrinkFactor2 = 1;
    this.shrinkFactor3 = 1;
    this.angle1 = -120;
    this.angle2 = 0;
    this.angle3 = -60;
    this.initHexagon();
  }
}

let animation;

function setup() {
  animation = new Animation();
  animation.setup();
}

function draw() {
  animation.draw();
}

function mouseClicked() {
  if (animation.phase === 5) {
    animation.restartAnimation();
  }
}

//small line segment for dots but doesn't really works.

// let dashLength = 5;
// let gapLength = 5;

// function setup() {
//   createCanvas(1280, 720);
//   background(220);
//   noFill(); // No fill for the ellipse
//   ellipseMode(CENTER);
// }

// function draw() {
//   background(220); // Clear the canvas for animation effect

//   // First set
//   if (frameCount > 0) {
//     drawDashedEllipse(640, 360, 380, 380, frameCount);
//   }
  
//   // Second set
//   if (frameCount > 120) {
//     drawDashedEllipse(780, 360, 275, 275, frameCount - 120);
//   }
  
//   // Third set
//   if (frameCount > 180) {
//     drawDashedEllipse(440, 360, 270, 270, frameCount - 180);
//   }
// }

// function drawDashedEllipse(centerX, centerY, ellipseWidth, ellipseHeight, currentFrame) {
//   let currentAngle = currentFrame % 360;

//   // Draw dashed lines up to the current angle
//   for (let angle = 0; angle <= currentAngle; angle += 1) {
//     let rad = radians(angle);
    
//     // Calculate the position on the ellipse perimeter
//     let x1 = centerX + (ellipseWidth / 2) * cos(rad);
//     let y1 = centerY + (ellipseHeight / 2) * sin(rad);

//     // Calculate the end position of the dash
//     let x2 = centerX + (ellipseWidth / 2 + dashLength) * cos(rad);
//     let y2 = centerY + (ellipseHeight / 2 + dashLength) * sin(rad);

//     // Draw the dash
//     if (angle % (dashLength + gapLength) < dashLength) {
//       line(x1, y1, x2, y2);
//     }
//   }
// }
