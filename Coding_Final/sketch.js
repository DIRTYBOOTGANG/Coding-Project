var player = {
  x: 50,
  y: 100,
  xPrev: 200,
  yPrev: 100,
  xSpeed: 0,
  ySpeed: 0,
  width: 50,
  height: 50,
  inAir: true
};
var sheet
var spriteW = 48;
var spriteH = 48;
var spriteNum = 4;
var frame = 0;

var gravity = 0.3;

var cloud;

var clouds = [{
    x: 275,
    y: 150,
    l: 100,
    w: 50
  },
  {
    x: 50,
    y: 50,
    l: 100,
    w: 50
  },
  {
    x: 330,
    y: -50,
    l: 130,
    w: 50
  },
  {
    x: 100,
    y: -170,
    l: 100,
    w: 50
  },
  {
    x: 90,
    y: -340,
    l: 200,
    w: 50,
  },
  {
    x: 390,
    y: -480,
    l: 40,
    w: 50,
  },
  {
    x: 90,
    y: -580,
    l: 40,
    w: 50,
  },
];

function setup() {
  createCanvas(600, 500);
  cloud = loadImage("https://i.postimg.cc/hvTrDDv5/kisscc0-cloud-drawing-kleurplaat-rainbow-nuage-cloud-5b3f463fba6.png");
  sheet = loadImage("https://i.postimg.cc/C1Zn0c5P/Cloud-Boy.png");
}

function draw() {
  background(86, 184, 255);

  //Sun
  fill(242, 238, 2);
  noStroke();
  ellipse(525, 100, 100, 100);

  // Pin player to center  
  translate(0, height / 2 - player.y);
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
  fill(16, 183, 55);
  stroke(5);
  rect(-.5, groundY, width, groundY);
  if (player.y > groundY) {
    player.inAir = false;
    player.ySpeed = 0;
    player.y = groundY;
  }


  // Platform
  var index = 0;
  while (index < clouds.length) {
    image(cloud, clouds[index].x, clouds[index].y, clouds[index].l, clouds[index].w);
    index += 1;
  }

  if (player.ySpeed > 0) {
    index = 0;
    while (index < clouds.length) {
      landOnPlatform(clouds[index].x, clouds[index].y, clouds[index].l, clouds[index].w);
      index += 1;
    }
  }

  // Draw player (last)
  // Set frame to stop animation
  if (!keyIsPressed) {
    frame = 0;
  }
  // Draw a particular slice of the image
  //ellipse(player.x - player.width / 120, player.y - player.height / 2, 50, 50);
  image(
    sheet, // image
    player.x -25, player.y - 42, spriteW, spriteH, // location of image
    0, frame * 200, 200, 200 // slice image
  );
  //image(sheet, 0, 0);
  //rect(0, frame * 200, 200, 200);
  // Increase frame, reset when you reach the end
  if (frameCount % 3 === 0) { // delay changing
    frame += 1;
    if (frame == spriteNum) {
      frame = 0;
    }
    // frame = (frame + 1) % spriteNum // does the same
  }

  player.xPrev = player.x;
  player.yPrev = player.y;

  //Side Barriers
  if (player.x > 600) {
    player.x = 600;
  }
  if (player.x < 0) {
    player.x = 0;
  }
  //Title
  fill(0);
	textSize(20);
	textAlign(CENTER, CENTER);
	text("Cloud Jumper", width / 2, 400);
  
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