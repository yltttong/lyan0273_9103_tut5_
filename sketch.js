class Timer {
  constructor() {
    this.rotationSpeed = 0.003; // Set rotation speed
    this.interval = null;
  }

  start() {
    this.interval = setInterval(this.updateTimer.bind(this), 500); // Set a timer with an interval of 500 milliseconds, calling updateTimer function
  }

  stop() {
    clearInterval(this.interval); // Stop the timer
  }

  updateTimer() {
    this.rotationSpeed += 0.0005;
  }
}

class GenerativePattern {
  constructor() {
    this.x;
    this.y;
    this.rad = 70;
    this.firstframe = true;
    this.seed;
    this.timer = 0;
    this.isPaused = false;// Add a variable to control animation
  }

  setup() {
    createCanvas(500, 500);
    background(0, 91, 130);
    this.seed = int(random(100000));

    this.rad = 70;
  }

  draw() {
    background(0, 91, 130);
    randomSeed(this.seed);

    if (this.firstframe) {
      translate(width / 2, height / 2);
      rotate(-PI / 12);

      let spaceBetween = this.rad * 2.5;

      for (let j = -height; j < height; j += spaceBetween) {
        let offsetX = 0;

        if ((j + height) / spaceBetween % 2 == 1) {
          offsetX = this.rad;
        }

        for (let i = -width + offsetX; i < width; i += spaceBetween) {
          push();
          translate(i, j);
          rotate(this.timer * timer.rotationSpeed); // Update rotation angle based on timer
          this.drawPattern(0, 0, this.rad);
          pop();
        }

        if (!this.isPaused) {
          this.timer++;
        }
      }
    }
  }

  drawPattern(centerX, centerY, rad) {
      drawOuterRing(centerX, centerY, rad * 1.35);

      let outerLayerChoice = random(1);
      if (outerLayerChoice < 0.5) {
        drawTriangleStripLayer(centerX, centerY, rad * 1.25, 80);
      } else {
        drawDottedLayer(centerX, centerY, rad * 0.65, 8, 20);
      }
    
      let middleLayerChoice = random(1);
      if (middleLayerChoice < 0.5) {
        drawDottedLayer(centerX, centerY, rad * 0.5, 8, 20);
      } else {
        drawRingLayer(centerX, centerY, rad * 0.55, 4, rad * 0.05);
      }
    
      drawCore(centerX, centerY, rad);
      drawRandomLine(centerX, centerY, rad * 1.5);
          
  }
}

let timer = new Timer();
let pattern = new GenerativePattern();

function setup() {
  timer.start();
  pattern.setup();
}

function draw() {
  pattern.draw();
}

function mouseClicked() {
  pattern.isPaused = !pattern.isPaused; // Toggle animation playback state
}

function getRandomPastelColor() {
  let r = random(50, 255);
  let g = random(50, 255);
  let b = random(50, 255);
  return color(r, g, b);
}

function drawCore(x, y, rad) {
  noStroke();
  for (let i = 0; i < 5; i++) {
    let col = getRandomPastelColor();  
    fill(col);
    let currentRad = rad * (1 - i * 0.2);  
    ellipse(x, y, currentRad);
  }
}




function drawDottedLayer(x, y, rad, numLayers, dotsPerLayer) {
  let layerOffset = rad / numLayers;  // Distance between each layer
  let angleOffset;
  let dotColor = getRandomPastelColor();  // Get a random color using the above function
  
  // Calculate the outermost layer's radius
  let outerLayerRad = rad + (numLayers - 1) * layerOffset;

// Draw a uniform circular background
fill(getRandomPastelColor());
ellipse(x, y, outerLayerRad * 2);
noStroke();
for (let i = 1; i <= numLayers; i++) {
  let currentRad = rad + (i - 1) * layerOffset;  // 当前层的半径
  angleOffset = TWO_PI / (dotsPerLayer * i);  // 当前层每个点的角度偏移
  let currentDotSize = rad * 0.08;  // 控制圆点的大小
  for (let j = 0; j < TWO_PI; j += angleOffset) {
    let dotX = x + currentRad * cos(j);
    let dotY = y + currentRad * sin(j);
    fill(dotColor);
    ellipse(dotX, dotY, currentDotSize);
  }
}
}


function drawRingLayer(x, y, rad, numLayers, ringWidth) {
  let layerOffset = rad / numLayers;  // Distance between each layer

  noStroke();

  for (let i = numLayers; i >= 1; i--) {  // Note the change in loop order here
    let currentRad = rad + (i - 1) * layerOffset;  // Radius of the current layer

    fill(getRandomPastelColor());
    ellipse(x, y, currentRad * 2, currentRad * 2);  // Only draw one circle here
  }
}


function drawTriangleStripLayer(x, y, rad, numTriangles) {
  let angleOffset = TWO_PI / numTriangles;  // Angle offset for each triangle

  // Draw a filled, borderless background circle
  fill(getRandomPastelColor());
  noStroke();
  ellipse(x, y, rad * 2);

  let innerRad = rad * 0.8;  // Set the radius of the small circle
  strokeWeight(1);
  stroke(getRandomPastelColor());

  for (let i = 0; i < TWO_PI; i += angleOffset) {
    noFill();

    // Center
    let centerX = x;
    let centerY = y;

    // First vertex of the triangle, starting from the edge of the small circle
    let firstX = centerX + innerRad * cos(i);
    let firstY = centerY + innerRad * sin(i);

    // Second vertex of the triangle, extending to the edge of the large circle
    let secondX = centerX + rad * cos(i);
    let secondY = centerY + rad * sin(i);

    // Third vertex of the triangle, also starting from the edge of the small circle
    let thirdX = centerX + innerRad * cos(i + angleOffset);
    let thirdY = centerY + innerRad * sin(i + angleOffset);

    beginShape();
    vertex(firstX, firstY);      // Edge point of the small circle
    vertex(secondX, secondY);    // Edge point of the large circle
    vertex(thirdX, thirdY);      // Next edge point of the small circle
    endShape(CLOSE);
  }
}


function drawOuterRing(centerX, centerY, maxRadius) {
  let angleOffset = radians(15); // Set the angle interval between each element

  for (let angle = 0; angle < TWO_PI; angle += angleOffset) {
    // Draw connecting lines
    let nextAngle = angle + angleOffset;
    let startX = centerX + maxRadius * cos(angle);
    let startY = centerY + maxRadius * sin(angle);
    let endX = centerX + maxRadius * cos(nextAngle);
    let endY = centerY + maxRadius * sin(nextAngle);
    stroke(getRandomPastelColor());
    strokeWeight(1.5);
    line(startX, startY, endX, endY);
    // Draw black-white-orange rings
    drawColoredRing(centerX + maxRadius * cos(angle), centerY + maxRadius * sin(angle), maxRadius * 0.05);

    // Calculate the position of the randomly colored ellipse
    let ellipseX = centerX + maxRadius * cos(angle + angleOffset / 2);
    let ellipseY = centerY + maxRadius * sin(angle + angleOffset / 2);

    fill(getRandomPastelColor()); // Fill the ellipse with a random color
    noStroke();
    ellipse(ellipseX, ellipseY, maxRadius * 0.08, maxRadius * 0.06); // Draw the ellipse
  }
}

function drawColoredRing(x, y, rad) {
  const colors = ['white', 'black', 'orange'];
  for (let i = 0; i < colors.length; i++) {
    fill(colors[i]);
    noStroke();
    ellipse(x, y, rad * (3 - i), rad * (3 - i));
  }
}

function drawRandomLine(x, y, rad) {
  noFill();
  stroke(getRandomPastelColor());
  strokeWeight(4);

  let angle1 = random(TWO_PI);
  let controlX1 = x + rad * 0.5 * cos(angle1);
  let controlY1 = y + rad * 0.5 * sin(angle1);
  let angle2 = angle1 + random(HALF_PI);
  let controlX2 = x + rad * 0.75 * cos(angle2);
  let controlY2 = y + rad * 0.75 * sin(angle2);
  let angle3 = angle2 + random(HALF_PI);
  let endX = x + rad * cos(angle3);
  let endY = y + rad * sin(angle3);

  bezier(x, y, controlX1, controlY1, controlX2, controlY2, endX, endY);
}
