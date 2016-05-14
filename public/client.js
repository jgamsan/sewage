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
var x, height, dist_agua, altura_fosa;           // readings from the server

function setup() {
  createCanvas(1400, 800);   // set up the canvas
  altura_fosa = 215;
  percent = (800 - 40) / 300;
  linea_minima = 45 * percent;
  linea_maxima = 35 * percent;
}

function draw() {
  background('hsla(210, 50%, 65%, 0.3)');          // make the screen white
  fill(51);
  textSize(15);
  text("Linea Minima " + linea_minima, 140, linea_minima);
  text("Linea Maxima", 140, linea_maxima);
  altura = percent * dist_agua + 40;
  nivel_fosa = ((altura_fosa / 100) - (dist_agua / 100));
  text("Nivel Fosa " + nfc(nivel_fosa, 2) + "m", 140, altura);
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
  fill('red');
  ellipse(638, 550, 35, 35);
  ellipse(703, 550, 35, 35);
  fill('black');
  if (dist_agua == 999) {
    textSize(15);
    text("Puerto Serie no conectado",1000,500);
  }
}

function readData (data) {
  dist_agua = data;
}

// when new data comes in the websocket, read it:
socket.on('message', readData);
