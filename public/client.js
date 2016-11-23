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
var x, height, distAgua, alturaFosa, altura;
var tempAire;// readings from the server
var electroA, electroB, agitator;
var code;
var code_valve;
var textInfo, alturaText, tempText;
function setup() {
  createCanvas(windowWidth, windowHeight);   // set up the canvas
  alturaFosa = 247;
  percent = (windowHeight - 40) / 300;
  distanciaMinima = 95;
  distanciaMaxima = 55;
  distanciaCritica = 32;
  alturaMinima = alturaFosa - distanciaMinima;
  alturaMaxima = alturaFosa - distanciaMaxima;
  alturaCritica = alturaFosa - distanciaCritica;
  linea_minima = distanciaMinima * percent + 40;
  linea_maxima = distanciaMaxima * percent + 40;
  linea_critica = distanciaCritica * percent + 40;
  anchoMedidor = 0.05 * windowWidth;
  radioValvulas = 0.05 * windowHeight;
  radioArquetas = 0.07 * windowHeight;
  code_valve = '666';

  buttonOpen = createButton('Abrir Valvula Salida');
  buttonOpen.position(windowWidth * 0.35, windowHeight * 0.1);
  //buttonOpen.position(1100,300);
  buttonOpen.size(200,50);
  buttonOpen.style("font-size", "20px");
  buttonOpen.style("background-color", "#4CAF50");
  buttonOpen.style("border-radius", "12px");
  buttonOpen.mousePressed(sendOpenSignal);
  buttonClose = createButton('Cerrar Valvula Salida');
  buttonClose.position(windowWidth * 0.35, windowHeight * 0.2);
  //buttonClose.position(1100,375);
  buttonClose.size(200,50);
  buttonClose.style("font-size", "20px");
  buttonClose.style("background-color", "#f44336");
  buttonClose.style("border-radius", "12px");
  buttonClose.mousePressed(sendCloseSignal);
  textInfo = createInput('');
  textInfo.position(windowWidth * 0.28, windowHeight * 0.45)
  //textInfo.position(1000,500);
  textInfo.size(windowWidth * 0.18, windowHeight * 0.05);
  textInfo.style("font-size", "20px");
  textInfo.style("background-color", "yellow");
  var valveBack = createElement('h2','Valvula de Retorno');
  valveBack.position(windowWidth * 0.28, windowHeight * 0.71);
  var valveExit = createElement('h2','Valvula de Vertido');
  valveExit.position(windowWidth * 0.28, windowHeight * 0.63);
  var agitator = createElement('h2','Agitador');
  agitator.position(windowWidth * 0.28, windowHeight * 0.55);
  alturaText = createInput("No Conectado...");
  alturaText.position(windowWidth * 0.28, 0.80 * windowHeight);
  alturaText.size(windowWidth * 0.18, windowHeight * 0.05);
  //alturaText.size(300,30);
  alturaText.style("font-size", "26px");
  alturaText.style("background-color", "Wheat");
  alturaText.style("border-width", "3px");
  alturaText.style("border-style", "inset");
  tempText = createInput("No Conectado....");
  tempText.position(windowWidth * 0.28, 0.85 * windowHeight);
  tempText.size(windowWidth * 0.18, windowHeight * 0.05);
  tempText.style("font-size", "26px");
  tempText.style("background-color", "Wheat");
  tempText.style("border-width", "3px");
  tempText.style("border-style", "inset");
  var lineMin = createElement('h2','Linea Minima ' + alturaMinima);
  lineMin.position(anchoMedidor + 60, linea_minima - 25);
  var lineMax = createElement('h2','Linea Maxima ' + alturaMaxima);
  lineMax.position(anchoMedidor + 60, linea_maxima - 25);
  var lineCritical = createElement('h2','Linea Critica ' + alturaCritica);
  lineCritical.position(anchoMedidor + 60, linea_critica - 25);
  var timeSpan = createSpan(day() + "/" + month() + "/" + year());
  timeSpan.position(windowWidth * 0.22, 0.05 * windowHeight);
  //timeSpan.position(1100,50);
  timeSpan.style("font-size", "26px");
}

function draw() {
  background('hsla(210, 50%, 65%, 0.3)');          // make the screen white

  fill(255);
  rect(30,40,anchoMedidor,floor(altura));
  //height = 300 * percent - altura;
  fill(255,204,0);
  rect(30,floor(altura),anchoMedidor,floor(height));
  noFill();
  strokeWeight(3);
  line(20, linea_critica, anchoMedidor + 40, linea_critica);
  line(20, linea_minima, anchoMedidor + 40, linea_minima);
  line(20, linea_maxima, anchoMedidor + 40, linea_maxima);
  //rect(windowWidth * 0.42, windowHeight * 0.10, windowWidth * 0.1, windowHeight * 0.59, 5, 5, 0, 0);

  //ellipse(windowWidth * 0.22, windowHeight * 0.62, radioArquetas, radioArquetas);
  //ellipse(windowWidth * 0.29, windowHeight * 0.50, radioArquetas, radioArquetas);
  switch(electroA) {
      case 0:
        fill('red');
        ellipse(windowWidth * 0.25, windowHeight * 0.74, radioValvulas, radioValvulas);
          //ellipse(windowWidth * 0.15, windowHeight * 0.74, radioArquetas, radioArquetas);
        break;
      case 1:
        fill('blue');
        ellipse(windowWidth * 0.25, windowHeight * 0.74, radioValvulas, radioValvulas);
          //ellipse(windowWidth * 0.15, windowHeight * 0.74, radioArquetas, radioArquetas);
        break;
  }
  switch(electroB) {
      case 0:
        fill("red");
        ellipse(windowWidth * 0.25, windowHeight * 0.66, radioValvulas, radioValvulas);
          //rect(windowWidth * 0.65, windowHeight * 0.25, radioArquetas, radioArquetas, 20);
        buttonOpen.show();
        buttonClose.show();
        break;
      case 1:
        fill("blue");
        ellipse(windowWidth * 0.25, windowHeight * 0.66, radioValvulas, radioValvulas);
          //rect(windowWidth * 0.65, windowHeight * 0.25, radioArquetas, radioArquetas, 20);
        buttonOpen.hide();
        if (code_valve=="555") {
          buttonClose.show();
        } else {
          buttonClose.hide();
        }
        break;
  }
  switch (agitator) {
    case 0:
      fill('red');
      ellipse(windowWidth * 0.25, windowHeight * 0.58, radioValvulas, radioValvulas);
      break;
    case 1:
      fill('blue');
      ellipse(windowWidth * 0.25, windowHeight * 0.58, radioValvulas, radioValvulas);
      break;
  }

}

function readData(data) {

    var datos = data.split("%");
    //console.log(datos[3]);
    if (datos[0] == 999) {
      textInfo.value(datos[1]);
    } else {
      distAgua = parseFloat(datos[0]);
      nivel_fosa = alturaFosa - distAgua;
      altura = percent * distAgua + 40;
      height = 300 * percent - altura;
      console.log(datos);
      alturaText.value("Nivel Fosa: " + nf(nivel_fosa, 3, 1) + " cm");
      tempAire = datos[1];
      tempText.value("Temperatura: " + tempAire + "ºC");
      code = 0;
      electroA = parseInt(datos[2]);
      electroB = parseInt(datos[3]);
      agitator = parseInt(datos[4]);
    }

}

function sendOpenSignal() {
  socket.emit('message', "555");
  code_valve = '555';
  textInfo.value("Valvula Vertido Abierta Manualmente..");
  redraw();
}

function sendCloseSignal() {
  socket.emit('message', "666");
  code_valve = '666';
  textInfo.value("");
  redraw();
}

// when new data comes in the websocket, read it:
socket.on('message', readData);
