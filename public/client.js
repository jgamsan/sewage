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
var x, height, distAgua, alturaFosa;           // readings from the server
var electroA, electroB;
function setup() {
  createCanvas(1400, 800);   // set up the canvas
  alturaFosa = 247;
  percent = (800 - 40) / 300;
  distanciaMinima = 45;
  distanciaMaxima = 35;
  alturaMinima = alturaFosa - 45;
  alturaMaxima = alturaFosa - 35;
  linea_minima = distanciaMinima * percent + 40;
  linea_maxima = distanciaMaxima * percent + 40;
}

function draw() {
  background('hsla(210, 50%, 65%, 0.3)');          // make the screen white
  fill(51);
  textSize(15);
  text("Linea Minima " + alturaMinima, 140, linea_minima);
  text("Linea Maxima", 140, linea_maxima);
  altura = percent * distAgua + 40;
  nivel_fosa = alturaFosa - distAgua;
  text("Nivel Fosa " + nivel_fosa + "cm", 140, altura);
  text("Arqueta Toma Muestras", 880, 180);
  fill(255);
  rect(30,40,75,floor(altura));
  height = 300 * percent - altura;
  fill(255,204,0);
  rect(30,floor(altura),75,floor(height));
  noFill();
  strokeWeight(3);
  line(10, linea_minima, 125, linea_minima);
  line(10, linea_maxima, 125, linea_maxima);
  fill('green');
  rect(600, 100, 150, 400, 5, 5, 0, 0);
  ellipse(200, 550, 55, 55);
  ellipse(300, 450, 55, 55);
  ellipse(400, 350, 55, 55);
  rect(900, 200, 55, 55, 20);
  if (electroA == "1") {
    fill('green');
    ellipse(638, 550, 35, 35);
  } else {
    fill('red');
    ellipse(638, 550, 35, 35);
  }
  if (electroB == "1") {
    fill("green");
    ellipse(703, 550, 35, 35);
  } else {
    fill("red");
    ellipse(703, 550, 35, 35);
  }
  fill('black');
  if (distAgua == 999) {
    textSize(15);
    text("Puerto Serie no conectado",1000,500);
  }
}

function readData (data) {
  //dist_agua = data.split("/");
  datos = "39/1/0".split("/");
  distAgua = parseInt(datos[0]);
  electroA = datos[1];
  electroB = datos[2];
}

// when new data comes in the websocket, read it:
socket.on('message', readData);
