function setup() {
  createCanvas(1200, 800);
}

function preload() {
}

function draw() {
  background(255);
  
  grid();
  text1();
  if (box1) {
    box1Show();
  }
  

  
  
  noStroke();

}
var box1 = false;
var box2 = false;
var box3 = false;
var box4 = false;
var box5 = false;
var box6 = false;
var box7 = false;
var box8 = false;
var box9 = false;
var box10 = false;
var box11 = false;
var box12 = false;

function mousePressed() {
  if (mouseX > 2 && mouseX < 240 && mouseY > 2 && mouseY < 580) {
    box1Rect.speedH = 100;
    box1Rect.speedL = 100;
    box1Rect.l = 0;
    box1Rect.h = 0;
    box1 = true;
  }
  
  if (box1) {
    if (mouseX > 1050 && mouseX < 1100 && mouseY > 50 && mouseY < 100) {
      box1 = false;
      // removeInput1();
    }
  }
  
}

function grid() {
  stroke(0);
  strokeWeight(4);
  
  rectMode(CORNER);
  fill(255);
  if (mouseX > 2 && mouseX < 240 && mouseY > 2 && mouseY < 580 && !(box1 || box2 || box3 || box4 || box5 || box6 || box7 || box8 || box9 || box10 || box11 || box12)) {
    fill(200);
  }
  rect(0, 0, 240, 580);
  fill(255);
  if (mouseX > 240 && mouseX < 480 && mouseY > 2 && mouseY < 290 && !(box1 || box2 || box3 || box4 || box5 || box6 || box7 || box8 || box9 || box10 || box11 || box12)) {
    fill(200);
  }
  rect(240, 0, 240, 290);
  fill(255);
  if (mouseX > 240 && mouseX < 480 && mouseY > 290 && mouseY < 580 && !(box1 || box2 || box3 || box4 || box5 || box6 || box7 || box8 || box9 || box10 || box11 || box12)) {
    fill(200);
  }
  rect(240, 290, 240, 290);
  fill(255);
  if (mouseX > 480 && mouseX < 720 && mouseY > 2 && mouseY < 480 && !(box1 || box2 || box3 || box4 || box5 || box6 || box7 || box8 || box9 || box10 || box11 || box12)) {
    fill(200);
  }
  rect(480, 0, 240, 580);
  fill(255);
  if (mouseX > 720 && mouseX < 960 && mouseY > 2 && mouseY < 290 && !(box1 || box2 || box3 || box4 || box5 || box6 || box7 || box8 || box9 || box10 || box11 || box12)) {
    fill(200);
  }
  rect(720, 0, 240, 290);
  fill(255);
  if (mouseX > 720 && mouseX < 960 && mouseY > 290 && mouseY < 580 && !(box1 || box2 || box3 || box4 || box5 || box6 || box7 || box8 || box9 || box10 || box11 || box12)) {
    fill(200);
  }
  rect(720, 290, 240, 290);
  fill(255);
  if (mouseX > 960 && mouseX < 1198 && mouseY > 2 && mouseY < 580 && !(box1 || box2 || box3 || box4 || box5 || box6 || box7 || box8 || box9 || box10 || box11 || box12)) {
    fill(200);
  }
  rect(960, 0, 240, 580);
  fill(255);
  if (mouseX > 2 && mouseX < 600 && mouseY > 580 && mouseY < 800 && !(box1 || box2 || box3 || box4 || box5 || box6 || box7 || box8 || box9 || box10 || box11 || box12)) {
    fill(200);
  }
  rect(0, 580, 600, 220);
  fill(255);
  if (mouseX > 600 && mouseX < 1198 && mouseY > 580 && mouseY < 800 && !(box1 || box2 || box3 || box4 || box5 || box6 || box7 || box8 || box9 || box10 || box11 || box12)) {
    fill(200);
  }
  rect(600, 580, 600, 220);
  
  strokeWeight(7);
  noFill();
  rect(2, 2, width-4, height-4);
  fill(255);
  
  if (box1 || box2 || box3 || box4 || box5 || box6 || box7 || box8 || box9 || box10 || box11 || box12) {
    fill(0, 170);
    rect(0, 0, width, height);
  }
  
}

function text1() {
  fill(0);
  strokeWeight(1);
  textSize(40);
  textAlign(CENTER, CENTER);
  
  text('Problem', 120, 30);
  text('Solution', 360, 30);
  textSize(30);
  text('Unique Value\nProposition', 600, 45);
  textSize(35);
  // textLeading(34)
  text('Unfair\nAdvantage', 840, 45);
  // textLeading();
  text('Customer\nSegments', 1080, 45);
  text('Key Metrics', 360, 320);
  text('Channels', 840, 320);
  textSize(40);
  text('Cost Structure', 300, 610);
  text('Revenue Streams', 900, 610)
}

var box1Rect = {
  l: 0,
  h: 0,
  speedL: 100,
  speedH: 100
}
function box1Show() {
  rectMode(CENTER);
  fill(255);
  strokeWeight(4);
  stroke(0);
  rect(width/2, height/2, box1Rect.l, box1Rect.h, 20)
  box1Rect.l += box1Rect.speedL;
  box1Rect.h += box1Rect.speedH;
  
  if (box1Rect.l >= 1000) {
    box1Rect.speedL = 0;
  }
  
  if (box1Rect.h >= 700) {
    box1Rect.speedH = 0;
  }
  
  if(box1Rect.speedH == 0 && box1Rect.speedL== 0) {
    fill(255, 20, 10);
    if (mouseX > 1050 && mouseX < 1100 && mouseY > 50 && mouseY < 100) {
      fill(107, 9, 2);
    }
    rect(1075, 75, 50, 50, 0, 20, 0, 0 );
    
    fill(0);
    strokeWeight(1);
    textSize(60);
    textAlign(CENTER, CENTER);

    text('Problem', 600, 100);

    textSize(30);
    noStroke();
    textAlign(LEFT, CENTER);
    text('List your 1-3 top problems', 150, 200);
    text('Examples: .............', 150, 250);
    
    strokeWeight(4);
    stroke(0);
    fill(255);
    rect(600, 500, 800, 300);
    
    // if (mouseX > 200 && mouseX < 600 && mouseY > 350 && mouseY < 650) {
    //   redraw(1);
    //   inp1();
    // }
    // loop();
  
  }
  
}

// function inp1() {
//     input1 = createInput();
//     input1.position(550, 500);
//     input1.size(200, 100);

//     button1 = createButton('Submit');
//     button1.position(input1.x + input1.width, 500);
// }

// function removeInput1() {
// 	var element = document.input1
// 	document.body.remove(input1);
// }