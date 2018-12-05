var player = {
  x: 200,
  y: 100,
  xPrev: 200,
  yPrev: 100,
  xSpeed: 0,
  ySpeed: 0,
  width: 50,
  height: 50,
  inAir: true
};
var gravity = 0.3;

function setup() {
  createCanvas(600, 500);
  strokeWeight(5);
}

function draw() {
  background(220);
  
  // Pin player to center  
  translate(width/2 - player.x, height/2 - player.y);
  
   player.xSpeed = 0;
  var keySpeed = 5;
  var jumpSpeed = 10;
  if (keyIsDown(LEFT_ARROW)) {
    player.xSpeed -= keySpeed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player.xSpeed += keySpeed;
  }
  if (!player.inAir && keyIsDown(UP_ARROW)) {
    player.inAir = true;
    player.ySpeed = -jumpSpeed;
  }
  
    // Update player
  player.x += player.xSpeed;
  if (player.x < player.fallLeft || player.x > player.fallRight) {
    player.inAir = true;
  }
  if (player.inAir) {
    player.y += player.ySpeed;
    player.ySpeed += gravity;
  }
  
    // Ground
  var groundY = 300;
  line(0, groundY, width, groundY);
  if (player.y > groundY) {
    player.inAir = false;
    player.ySpeed = 0;
    player.y = groundY;
  }

  // Platform
  rect(250, 150, 100, 50);
  rect(100, 50, 100, 50);
  if (player.ySpeed > 0) {
    landOnPlatform(250, 150, 100, 50);
    landOnPlatform(100, 50, 100, 50);
  }

  // Draw player (last)
  rect(player.x - player.width / 2, player.y - player.height, 50, 50);
  line(player.x - 5, player.y - 5, player.x + 5, player.y + 5);
  line(player.x - 5, player.y + 5, player.x + 5, player.y - 5);

  player.xPrev = player.x;
  player.yPrev = player.y;
}

function landOnPlatform(x, y, w, h) {
  if (lineLine(
      player.x, player.y, player.xPrev, player.yPrev,
      x, y, x + w, y
    )) {
    player.inAir = false;
    player.ySpeed = 0;
    player.y = y;
    player.fallLeft = x;
    player.fallRight = x + w;
  }
}

// LINE/LINE
function lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
  // calculate the distance to intersection point
  var uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  var uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  // if uA and uB are between 0-1, lines are colliding
  // customized: removed <= and => in favor of < >
  if (uA > 0 && uA < 1 && uB > 0 && uB < 1) {
    return true;
  }
  return false;
}
