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
}

function draw() {
  background('hsla(210, 50%, 65%, 0.3)');          // make the screen white
  fill(51);
  textSize(15);
  text("Linea Minima " + alturaMinima, 140, linea_minima);
  text("Linea Maxima " + alturaMaxima, 140, linea_maxima);
  altura = percent * distAgua + 40;
  nivel_fosa = alturaFosa - distAgua;

  text("Arqueta Toma Muestras", 880, 180);
    text("Valvula de Retorno", 480, 555);
    text("Valvula de Vertido", 730, 555);
    textSize(25);
    text("Nivel Fosa: " + nivel_fosa + "cm", 300, windowHeight - 100);
    text("Temperatura Aire: " + tempAire + "ºC", 300, windowHeight - 50);
    text(day() + "/" + month() + "/" + year(), 1100, 50);
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

  ellipse(300, 450, 55, 55);
  ellipse(400, 350, 55, 55);
  switch(electroA) {
      case "0":
          fill('red');
          ellipse(638, 550, 35, 35);
          ellipse(200, 550, 55, 55);
        break;
      case "1":
          fill('green');
          ellipse(638, 550, 35, 35);
          ellipse(200, 550, 55, 55);
          break;
  }
  switch(electroB) {
      case "0":
          fill("red");
          ellipse(703, 550, 35, 35);
          rect(900, 200, 55, 55, 20);
          break;
      case "1":
          fill("green");
          ellipse(703, 550, 35, 35);
          rect(900, 200, 55, 55, 20);
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
    distAgua = parseFloat(datos[0]);
    tempAire = datos[1];
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
