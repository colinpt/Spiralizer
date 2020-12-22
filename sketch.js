//****************************************
// Some variables to mess around with
//****************************************
let rDiv      = 10;     // Default 10
let angle     = 3;    // Default 0.1
let radius    = 0.06;   // Default 0.06
let pixelRate = 20000;  // Default 20000
let speed     = 64;      // Default 32
//****************************************
// Important stuff
//****************************************
let r = 0.2;
let theta = 0;
let pixelIndex = 0;
let canvasToggle = false;
let currentCanvas;
let pixelArray = null;
let url;
let previous;
let dir = "down";
let shape = "circle";
let rStep = 0;
let rotation = 0;
let w;
let h;
let prevURL;
let prevDir;
let currImg;
//****************************************

function setup() {
  rectMode(CENTER);
  angleMode(DEGREES);
}

async function load(){
    // Grab url and value from dropdown
    urlElement       = document.getElementById("url");
    selection = document.getElementById("selection").elements[0].value;
    // Load image based on dropdown value
    switch (selection){
    case "custom":
      url = "https://cors-anywhere.herokuapp.com/" + urlElement.elements[0].value;
      break;
    case "aurora":
      url = "https://i.imgur.com/wGAsX2j.jpg";
      break;
    case "snowcap":
      url = "https://i.imgur.com/OyoFdzI.jpg";
      break;
    case "hotspring":
      url = "https://i.imgur.com/lIUTGHk.jpg";
      break;
    case "paintjob":
      url = "https://i.imgur.com/aYy8IFf.jpg";
      break;
    case "fireworks":
      url = "https://i.imgur.com/TkNhwWy.jpg";
      break;
    case "japan":
      url = "https://i.imgur.com/cow2bsg.jpg";
      break;
    case "sculpture":
      url = "https://i.imgur.com/S6nrwuP.jpg";
      break;
    case "field":
      url = "https://i.imgur.com/SUiP2gJ.jpg";
      break;
    case "tiedye":
      url = "https://i.imgur.com/aCcIW8Q.jpg";
      break; 
    case "bee":
      url = "https://i.imgur.com/NR6C9JW.jpg";
      break;
    default:
      url = "https://i.imgur.com/GfJdbHr.jpg";
  }
  fetchSettings();
  
  // Only reload proccess intensive stuff if things have changed.
  if (url != prevURL || dir != prevDir){
    await loadImage(url, img => {
      currImg = img;
      background(255);
      w = img.width;
      h = img.height;
      currentCanvas = createCanvas((Math.floor(w / 10) * 10), (Math.floor(h / 10) * 10));
      image(img, 0, 0, (Math.floor(w / 10) * 10), (Math.floor(h / 10) * 10));
      loadPixels();
      pixelArray = pixelsToObjectArray(pixels, dir);
      if (pixelArray != null) checkRate();
      if (canvasToggle){
        currentCanvas = createCanvas(windowWidth, windowWidth);
      } else {
        currentCanvas = createCanvas(windowWidth, windowHeight);
        image(img,0,0,windowWidth,windowHeight);
      }

      prevURL = url;
      prevDir = dir;
      reset();
    });
  } else {
    background(255);
    if (pixelArray != null) checkRate();
    if (canvasToggle){
      currentCanvas = createCanvas(windowWidth, windowWidth);
    } else {
      currentCanvas = createCanvas(windowWidth, windowHeight);
      image(currImg,0,0,windowWidth,windowHeight);
    }
    reset();
  }
  
}

function draw() {
    for(reps = 0; reps < speed; reps++){
      if (pixelArray !== null && pixelIndex < pixelArray.length){
        let currPixel = pixelArray[pixelIndex];

        let x = (r * cos(theta)) + width/2;
        let y = (r * sin(theta)) + height/2;
        let c = r/rDiv;
        // Draw an ellipse at x,y
        noStroke()
        fill(currPixel.r, currPixel.g, currPixel.b);

        push();
        translate(x,y);
        rotate(rotation);
        // Adjust for center of window and increase size as radius increases
        if (shape == "square"){
          rect(0, 0, 3 + c, 3 + c);
        }
        else if (shape == "triangle"){
          triangle(0, 0 - c/2, 0 - c/2, 0 + c/2, 0 + c/2, 0 + c/2);
        }
        else {
          ellipse(0, 0, 3 + c, 3 + c); 
        }
        pop();
        rotation += rStep;
        // Each ellipse is one ten-thousandth (or whatever pixelRate is) of the input image
        pixelIndex += Math.floor(((pixelArray.length) / pixelRate));
        // Increment the angle
        theta += angle;
        // Increment the radius
        r += radius;
      }
    }
}

function pixelsToObjectArray(pixels, direction){
  let pixelObjectArray = [];
  index = 0;
  if (direction == "left"){
    for (i = 0; i < w; i++){
      for (j = 0; j < h; j++){
        k = (j*w*4) + (i*4);
        pixelObjectArray[index++] = {
          'r' : pixels[k],
          'g' : pixels[k + 1],
          'b' : pixels[k + 2]
        };
      }
    }
  } 
  else if (direction == "right"){
    for (i = w; i > 0; i--){
      for (j = h; j > 0; j--){
        k = (j*w*4) + (i*4);
        pixelObjectArray[index++] = {
          'r' : pixels[k],
          'g' : pixels[k + 1],
          'b' : pixels[k + 2]
        };
      }
    }
  }
  else if (direction == "up"){
    for (i = pixels.length - 4; i > 0; i -= 4){
      pixelObjectArray[index++] = {
        'r' : pixels[i],
        'g' : pixels[i + 1],
        'b' : pixels[i + 2]
      };
    }
  }
  else {
    for (i = 0; i < pixels.length; i += 4){
      pixelObjectArray[index++] = {
        'r' : pixels[i],
        'g' : pixels[i + 1],
        'b' : pixels[i + 2]
      };
    }
  } 
  return pixelObjectArray;
}

function toggleAspect(){
  canvasToggle = !canvasToggle; 
  load();
}

function reset(){
  pixelIndex = 0;
  r = 0.2;
  theta = 0;
}

function saveSpiral() {
  let fileName = "-rd-" + str(rDiv) + "-a-" + str(angle) + "-r-" + str(radius) + "-pr-" + str(pixelRate);
  save(fileName + ".jpg");
}

function checkRate(){
  pixelRateElem = document.getElementById("pixelRate");
  pixelRate = Number(pixelRateElem.elements[0].value);
  if (pixelRate < 100){
    pixelRate = 100;
    pixelRateElem.elements[0].value = 100;
  }
  else if(pixelRate >= pixelArray.length){
    pixelRate = pixelArray.length - 1;
    pixelRateElem.elements[0].value = pixelArray.length - 1;
  }
}

function fetchSettings(){
  rStepElem  = document.getElementById("rotation");
  rDivElem   = document.getElementById("radiusDiv");
  angleElem  = document.getElementById("angle");
  radiusElem = document.getElementById("radius");
  speedElem  = document.getElementById("speed");

  dir        = document.getElementById("direction").elements[0].value;
  shape      = document.getElementById("shape").elements[0].value;

  rStep      = Number(rStepElem.elements[0].value);
  rDiv       = Number(rDivElem.elements[0].value);
  angle      = Number(angleElem.elements[0].value);
  radius     = Number(radiusElem.elements[0].value);
  speed      = Number(speedElem.elements[0].value);

  if (rDiv < 0.6 && rDiv > -0.6){
    rDiv = 0.6;
    rDivElem.elements[0].value = 0.6;
  }
  
  if (angle == 0){
    angle = 0.1;
    angleElem.elements[0].value = 0.1;
  }
  if (speed < 1){
    speed = 1;
    speedElem.elements[0].value = 1;
  }
  else if (speed > 10000){
    speed = 10000;
    speedElem.elements[0].value = 10000;
  }
}