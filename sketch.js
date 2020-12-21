//****************************************
// Some variables to mess around with
//****************************************
let rDiv      = 10;     // Default 10
let angle     = 0.1;    // Default 0.1
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
let w;
let ht;
//****************************************

// I don't need to use setup, but P5JS will throw a fit if it doesn't exist.
function setup() {}

async function load(){
    // Grab url and value from dropdown
    urlElement       = document.getElementById("url");
    selectionElement = document.getElementById("selection");
    selection = Number(selectionElement.elements[0].value)
    // Load image based on dropdown value
    switch (selection){
    case 0:
      url = "https://cors-anywhere.herokuapp.com/" + urlElement.elements[0].value;
      break;
    case 1:
      url = "https://i.imgur.com/v3L86qJ.jpg";
      break;
    case 2:
      url = "https://i.imgur.com/36LRbi9.jpg";
      break;
    case 3:
      url = "https://i.imgur.com/Nom8p3a.jpg";
      break;
    case 4:
      url = "https://i.imgur.com/jQGo8AA.jpg";
      break;
    case 5:
      url = "https://i.imgur.com/0en6UV9.jpg";
      break;
    case 6:
      url = "https://i.imgur.com/wy7dwsq.jpg";
      break;
    case 7:
      url = "https://i.imgur.com/hXyN3lZ.jpg";
      break;
    case 8:
      url = "https://i.imgur.com/Iwn44sv.jpg";
      break;
    case 9:
      url = "https://i.imgur.com/vrSOj4I.jpg";
      break; 
    case 10:
      url = "https://i.imgur.com/whcht9S.jpg";
      break;
    default:
      url = "https://i.imgur.com/GfJdbHr.jpg";
  }

  await loadImage(url, img => {
    
    background(255);

    setDir();
    w = img.width;
    h = img.height;
    currentCanvas = createCanvas((Math.floor(w / 10) * 10), (Math.floor(h / 10) * 10));
    image(img, 0, 0, (Math.floor(w / 10) * 10), (Math.floor(h / 10) * 10));
    loadPixels();
    pixelArray = pixelsToObjectArray(pixels, dir);
    
    getData();

    if (canvasToggle){
      currentCanvas = createCanvas(windowWidth, windowWidth);
    } else {
      currentCanvas = createCanvas(windowWidth, windowHeight);
      image(img,0,0,windowWidth,windowHeight);
    }

    previous = url;
    reset();
  });
  
}

function draw() {
    for(reps = 0; reps < speed; reps++){
      if (pixelArray !== null && pixelIndex < pixelArray.length){
        let currPixel = pixelArray[pixelIndex];

        let x = r * cos(theta);
        let y = r * sin(theta);
        // Draw an ellipse at x,y
        noStroke()
        fill(currPixel.r, currPixel.g, currPixel.b);
        // Adjust for center of window and increase size as radius increases
        ellipse((x+width/2), (y+height/2), 3 + r/rDiv, 3 + r/rDiv); 
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
  console.log(direction);
  console.log("W: " + w + " H: " + h);
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
  console.log("Len: " + pixelObjectArray.length);
  console.log(pixelObjectArray);
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

function setDir(){
  dirElement = document.getElementById("direction");
  dir = dirElement.elements[0].value;
}

function getData(){
  rDivElement      = document.getElementById("radiusDiv"); // Default 10
  angleElement     = document.getElementById("angle"); // Default 0.1
  radiusElement    = document.getElementById("radius"); // Default 0.06
  pixelRateElement = document.getElementById("pixelRate");  // Default 20000
  speedElement     = document.getElementById("speed");
 
  rDiv      = Number(rDivElement.elements[0].value);
  angle     = Number(angleElement.elements[0].value);
  radius    = Number(radiusElement.elements[0].value);
  pixelRate = Number(pixelRateElement.elements[0].value);
  speed     = Number(speedElement.elements[0].value);

  if (rDiv < 0.6 && rDiv > -0.6){
    rDiv = 0.6;
    rDivElement.elements[0].value = 0.6;
  }
  if (pixelRate < 100){
    pixelRate = 100;
    pixelRateElement.elements[0].value = 100;
  }
  else if(pixelRate >= pixelArray.length){
    pixelRate = pixelArray.length - 1;
    pixelRateElement.elements[0].value = pixelArray.length - 1;
  }
  if (angle == 0){
    angle = 0.1;
    angleElement.elements[0].value = 0.1;
  }
  if (speed < 1){
    speed = 1;
    speedElement.elements[0].value = 1;
  }
  else if (speed > 10000){
    speed = 10000;
    speedElement.elements[0].value = 10000;
  }
}