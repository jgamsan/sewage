/*
  webSocket client
  context: P5.js
  A webSocket client that draws a ball on the screen
  that's moved around with data from the server. The server
  is sending data received serially from an Arduino.
  The server is sending:
    x, y, buttonValue\n
    created 10 June 2015
    by Tom Igoe
*/
var socket = io();		      // socket.io instance. Connects back to the server
var x, height, distAgua, alturaFosa;
var tempAire;// readings from the server
var electroA, electroB;
function setup() {
  createCanvas(windowWidth, windowHeight);   // set up the canvas
  alturaFosa = 247;
  percent = (windowHeight - 40) / 300;
  distanciaMinima = 45;
  distanciaMaxima = 35;
  alturaMinima = alturaFosa - 45;
  alturaMaxima = alturaFosa - 35;
  linea_minima = distanciaMinima * percent + 40;
  linea_maxima = distanciaMaxima * percent + 40;
  anchoMedidor = 0.05 * windowWidth;
  radioValvulas = 0.05 * windowHeight;
  radioArquetas = 0.07 * windowHeight;
}

function draw() {
  background('hsla(210, 50%, 65%, 0.3)');          // make the screen white
  fill(51);
  textSize(0.03 * windowHeight);
  text("Linea Minima " + alturaMinima, anchoMedidor + 60, linea_minima);
  text("Linea Maxima " + alturaMaxima, anchoMedidor + 60, linea_maxima);
  altura = percent * distAgua + 40;
  nivel_fosa = alturaFosa - distAgua;

  text("Arqueta Toma Muestras", windowWidth * 0.6, windowHeight * 0.22);
  text("Valvula de Retorno", windowWidth * 0.3, windowHeight * 0.75);
  text("Valvula de Vertido", windowWidth * 0.51, windowHeight * 0.75);
  textSize(0.03 * windowHeight);
  text("Nivel Fosa: " + nivel_fosa + " cm", windowWidth * 0.18, 0.90 * windowHeight);
  text("Temperatura Aire: " + tempAire + "ºC", windowWidth * 0.18, 0.95 * windowHeight);
  text(day() + "/" + month() + "/" + year(), 1100, 50);
  fill(255);
  rect(30,40,anchoMedidor,floor(altura));
  height = 300 * percent - altura;
  fill(255,204,0);
  rect(30,floor(altura),anchoMedidor,floor(height));
  noFill();
  strokeWeight(3);
  line(20, linea_minima, anchoMedidor + 40, linea_minima);
  line(20, linea_maxima, anchoMedidor + 40, linea_maxima);
  fill('green');
  rect(windowWidth * 0.42, windowHeight * 0.10, windowWidth * 0.1, windowHeight * 0.59, 5, 5, 0, 0);

  ellipse(windowWidth * 0.22, windowHeight * 0.62, radioArquetas, radioArquetas);
  ellipse(windowWidth * 0.29, windowHeight * 0.50, radioArquetas, radioArquetas);
  switch(electroA) {
      case "0":
          fill('red');
          ellipse(windowWidth * 0.45, windowHeight * 0.74, radioValvulas, radioValvulas);
          ellipse(windowWidth * 0.15, windowHeight * 0.74, radioArquetas, radioArquetas);
        break;
      case "1":
          fill('blue');
          ellipse(windowWidth * 0.45, windowHeight * 0.74, radioValvulas, radioValvulas);
          ellipse(windowWidth * 0.15, windowHeight * 0.74, radioArquetas, radioArquetas);
          break;
  }
  switch(electroB) {
      case "0":
          fill("red");
          ellipse(windowWidth * 0.49, windowHeight * 0.74, radioValvulas, radioValvulas);
          rect(windowWidth * 0.65, windowHeight * 0.25, radioArquetas, radioArquetas, 20);
          break;
      case "1":
          fill("blue");
          ellipse(windowWidth * 0.49, windowHeight * 0.74, radioValvulas, radioValvulas);
          rect(windowWidth * 0.65, windowHeight * 0.25, radioArquetas, radioArquetas, 20);
          break;
  }

  fill('black');
  if (distAgua == 999) {
    textSize(15);
    text("Puerto Serie no conectado",1000,500);
  }
}

function readData (data) {

    var datos = data.split("%");
    //distAgua = parseFloat(datos[0]);
    //tempAire = datos[1];
    distAgua = 65;
    tempAire = 22.3;
    //distAgua = parseInt(data);

    if (distAgua <= 35) {
        electroA = "0";
        electroB = "1";
    } else if (distAgua > 35 && distAgua <= 45) {
        electroA = "1";
        electroB = "1";
    } else {
        electroA = "1";
        electroB = "0";
    }
}

// when new data comes in the websocket, read it:
socket.on('message', readData);
