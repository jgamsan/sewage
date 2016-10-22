/*
Serial to Socket.io example
Shows how to make a basic webSocket connection between a client and a server
using Socket.io version 1.0 or later (http://socket.io/)
Takes data from the command line to drive a graphic
generated in  p5.js (http://p5js.org/)
To run it from the command line:
node server.js serialport
where serialport is the name of your serial port.
created 10 Jun 2015
by Tom Igoe
*/

// server initialization:
var express = require('express');

io = require('socket.io'),				// include socket.io
app = express(),									// make an instance of express.js
server = app.listen(8080),				// start a server with the express instance
socketServer = io(server);				// make a socket server using the express server

// serial port initialization:
var SerialPort = require('serialport');			// include the serialport library
// portName = '/dev/ttyACM0',								// get the port name from the command line
// portConfig = {
// 	baudRate: 9600,
// 	// call myPort.on('data') when a newline is received:
// 	parser: Serialport.parsers.readline('\n')
// };

// open the serial port:
var myPort = new SerialPort('/dev/ttyACM0', {
  parser: SerialPort.parsers.readline('\n')
});
var Gpio = require('onoff').Gpio,
    agi = new Gpio(18, 'out');
var moment = require('moment');

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    host: 'smtp.mundo-r.com',
    port: 25,
    auth: {
        user: '622500001',
        pass: 'uha9559/',
        secure: false,
        authMethod: 'PLAIN'
    }
});
var mailOptions = {
    from: '"CMT Parga - depuradora" <no-reply@galiclick.com>', // sender address
    to: 'uha95@mundo-r.com, jgamsan@et.mde.es', // list of receivers
    subject: 'Informe Diario Depuradora CMT Parga ✔', // Subject line
    text: 'Informe Lecturas de la Depuradra CMT Parga correspondiente al dia ' + moment().subtract(1, 'days').format("DD-MM-YYYY"), // plaintext body
};
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/sewage');
var Lectura = require('./models/lecturas');
var Agenda = require('agenda');
var url = 'mongodb://localhost:27017/sewage';
var agenda = new Agenda({db: {address: url, collection: "jobs"}});


agenda.define('start agitator', function() {
  //console.log("Activado agitador");
  //myPort.write('700');
  agi.writeSync(1);
  notifyOpenAgitator();
});
agenda.define('shutdown agitator', function() {
  //console.log("Desactivado agitador");
  //myPort.write('799');
  agi.writeSync(0);
  notifyCloseAgitator();
});
agenda.on('ready', function() {
  agenda.start();
});

app.use(express.static('public'));					// serve files from the public folder
app.use('/scripts', express.static(__dirname + '/node_modules/'));

app.get('/:name', serveFiles, function(req,res){
    /*
    * Here we have assign the 'session' to 'sess'.
    * Now we can create any number of session variable we want.
    * in PHP we do as $_SESSION['var name'].
    * Here we do like this.
    */
});
app.get('/', function(req, res) {
    res.render('index');
});
//var SEW = require('./models/sewage');

// listener for all static file requests
socketServer.on('connection', openSocket);	// listener for websocket data

myPort.on('open', showPortOpen);
myPort.on('data', saveSerialData);
myPort.on('close', notifyPortClose);
myPort.on('error', showError);



function serveFiles(request, response) {
	var fileName = request.params.name;				// get the file name from the request
	response.sendFile(fileName, {"root": __dirname});							// send the file
}

function showPortOpen() {
   //console.log('port open. Data rate: ' + myPort.options.baudRate);
}

function saveSerialData(data) {
  var a = moment().format();
  var datos = data.split("%");
  var newLectura = Lectura({altura: parseInt(datos[0]), hora: a});
  newLectura.save(function(err) {
    if (err) throw err;
    console.log('User created!');
  });
}

function notifyPortClose() {
  mailOptions['subject'] = 'Informando Cierre en Puerto Comunicaciones Depuradora';
  mailOptions['text'] = 'Se ha cerrado el puerto de comunicacion de datos entre Arduino y Raspberry. EL PUERTO ESTA CERRADO. La hora del fallo es: ' + moment().format("HH:mm:ss");
  transporter.sendMail(mailOptions, function(error, info){
    if(error){ }
  });
}

function showError(error) {
   mailOptions['subject'] = 'Informando error en Comunicaciones Depuradora';
   mailOptions['text'] = 'Se ha producido un error en el puerto de comunicacion de datos entre Arduino y Raspberry. EL CODIGO DE ERROR ES: ' + error + '. La hora del fallo es: ' + moment().format("HH:mm:ss");
   if (app.settings.env == 'production') {
     transporter.sendMail(mailOptions, function(error, info){
       if(error){ }
     });
   }
}

function notifyOpenAgitator() {
  mailOptions['subject'] = 'Informando Puesta en marcha del Agitador';
  mailOptions['text'] = 'Se ha puesto en marcha el Agitador. La hora del evento es: ' + moment().format("HH:mm:ss");
  transporter.sendMail(mailOptions, function(error, info){
    if(error){ }
  });
}

function notifyCloseAgitator() {
  mailOptions['subject'] = 'Informando del apagado del Agitador';
  mailOptions['text'] = 'Se ha apagado el Agitador. La hora del evento es: ' + moment().format("HH:mm:ss");
  transporter.sendMail(mailOptions, function(error, info){
    if(error){ }
  });
}


function openSocket(socket){

	if (myPort.isOpen()) {
		socket.emit('message', '000');
	} else {
		socket.emit('message', '999%Error en Puerto. No enlace con Arduino');
		//console.log('999%error en puerto');
	}

	// this function runs if there's input from the client:
	socket.on('message', function(data) {
		console.log(data);
		myPort.write(data);							// send the data to the serial device
	});

	// this function runs if there's input from the serialport:
	myPort.on('data', function(data) {
    var final = data + "%" + agi.readSync().toString();
    socket.emit('message', final);		// send the data to the client
	});

	// this function runs if port is closed:
	myPort.on('disconnect', function() {
		socket.emit('message', '999%Puerto Desconectado');
	});

	myPort.on('error', function() {
		socket.emit('message', '999%Error en apertura de Puerto');
	});

	myPort.on('close', function(){
		socket.emit('message', '999%Puerto Cerrado. Intentando abrir ......');
    myPort.open(function (err) {
      if (err) {
        //console.log('Error opening port: ', err.message);
        socket.emit('message', '999%Se ha intentado abrir el Puerto. No fue posible');
      } else {
        //console.log("Puerto Abierto");
        socket.emit('message', '999%Se ha conseguido abrir el puerto');
      }
    })
	});
}




/* add worksheet to workbook */
