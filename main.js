let video;
let objectDetector;
let objects = [];
let statusText = "Esperando detección...";

function setup() {
  createCanvas(640, 480).center();
  video = createVideo('video.mp4', videoLoaded);
  video.hide(); // Oculta el video para mostrar solo el canvas
}

function videoLoaded() {
  if (typeof ml5 === 'undefined') {
    console.error('ml5.js no está cargado.');
    return;
  }

  if (typeof ml5.objectDetector !== 'function') {
    console.error('ml5.objectDetector no es una función.');
    return;
  }

  objectDetector = ml5.objectDetector('cocossd', modelLoaded);
}

function modelLoaded() {
  console.log("Modelo cargado!");
  statusText = "Modelo cargado. Presiona el botón para iniciar.";
}

function startDetection() {
  if (objectDetector) {
    objectDetector.detect(video, gotResult);
    statusText = "Detectando objetos...";
  } else {
    console.error('objectDetector no está inicializado.');
  }
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  objects = results;
  drawResults();
  objectDetector.detect(video, gotResult); // Repetir detección
}

function drawResults() {
  image(video, 0, 0); // Dibuja el video en el canvas
  fill(255, 0, 0);
  noStroke();
  for (let i = 0; i < objects.length; i++) {
    let obj = objects[i];
    textSize(24);
    text(obj.label + " " + floor(obj.confidence * 100) + "%", obj.x + 10, obj.y + 24);
    noFill();
    stroke(255, 0, 0);
    rect(obj.x, obj.y, obj.width, obj.height);
  }
  document.getElementById('status').innerText = statusText;
  document.getElementById('number_of_objects').innerText = `Número de objetos detectados: ${objects.length}`;
}
