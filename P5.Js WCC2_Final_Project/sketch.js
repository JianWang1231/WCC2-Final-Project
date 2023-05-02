/*
  Distance
  by Jian Wang
 */

//The distance between the audience and the screen is captured by an ultrasonic sensor to achieve artistic variations in the effect.
//Reference：https://openprocessing.org/sketch/1914603   https://github.com/gohai/p5.webserial/blob/main/examples/basic/basic_p5js/sketch.js


let pg1, pg2;
let capCopy;
let port;
let ardButton;
let mode = 0;
let dis = 0;
let capture;
let col = 60;
let row = 40;
let cirSize = 15;
let alpha1 = 0;

let alpha2 = 0;
function setup() {
  createCanvas(windowWidth, windowHeight);
  pg1 = createGraphics(width, height);
  pg2 = createGraphics(width, height);

  port = createSerial();
  capture = createCapture(VIDEO);
  capture.hide();

  ardButton = createButton("Connect to Arduino");
  ardButton.position(20, height - 80);
  ardButton.size(200, 50);
  ardButton.mousePressed(ardButtonClicked);
}

function draw() {
  background(0);
  capCopy = capture.get();
  // print(capCopy.width,capCopy.height)
  capCopy.resize(width, height);
  // image(capCopy, 0, 0);

  if (!port.opened()) {
    ardButton.html("Connect to Arduino");
  } else {
    ardButton.html("Disconnect");
    let val = port.read(); 
    port.clear();
    if (val != "") {
      print("dist:"+int(val));
      if (val < 0) {
        val = 0;
      }
      dis = int(lerp(dis, val, 0.08));
    }
  }
  drawEffect1();
  drawEffect2();

  dis = constrain(dis, 0, 1000);
  if (dis > 100) {
    alpha1 = lerp(alpha1, 255, 0.08);
    alpha2 = lerp(alpha2, 0, 0.08);
  } else {
    alpha1 = lerp(alpha1, 0, 0.08);
    alpha2 = lerp(alpha2, 255, 0.08);
  }
  tint(255, alpha1);

  image(pg1, 0, 0);
  tint(255, alpha2);
  image(pg2, 0, 0);
  
  textSize(15)
  stroke(255)
  text("dist:" + int(dis) + " alpha1:" +  int(alpha1) + " alpha2:" +  int(alpha2),50,50);
  
}


//Set two screen effects
function drawEffect1() {
  pg1.clear();
  for (let c = 0; c < col; c++) {
    for (let r = 0; r < row; r++) {
      let x = int(map(c + 0.5, 0, col, 0, width));
      let y = int(map(r + 0.5, 0, row, 0, height));
      let color = capCopy.get(x, y);
      let bri = brightness(color);
      let s = map(bri, 0, 255, 0.5, 2);
      pg1.fill(color);
      pg1.noStroke();
      pg1.ellipse(x, y, cirSize * s, cirSize * s);
    }
  }
}
function drawEffect2() {
  pg2.background(0,5)
  let _noiseScale = 0.0097;
  for (let i = 0; i < 400; i++) {
    let x = random(capCopy.width);
    let y = random(capCopy.height);
    let color = capCopy.get(int(x), int(y));
    let noi = noise(x * _noiseScale, y * _noiseScale);
    let leng = noi * 50;
    pg2.push();
    pg2.translate(x, y);
    pg2.rotate(noi * radians(180));
    pg2.stroke(color);
    pg2.strokeWeight(random(5,10));
    pg2.line(0, 0, leng, leng);
    pg2.pop();
  }

}
function ardButtonClicked() {
  if (!port.opened()) {
    port.open(9600);
  } else {
    port.close();
  }
}
