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
var express = require('express');		// include express.js


io = require('socket.io'),				// include socket.io
app = express(),									// make an instance of express.js
server = app.listen(8080),				// start a server with the express instance
socketServer = io(server);	 			// make a socket server using the express server

// serial port initialization:
var serialport = require('serialport'),			// include the serialport library
SerialPort  = serialport.SerialPort,			// make a local instance of serial
portName = process.argv[2],								// get the port name from the command line
portConfig = {
	baudRate: 9600,
	// call myPort.on('data') when a newline is received:
	parser: serialport.parsers.readline('\n')
};

// open the serial port:
var myPort = new SerialPort(portName, portConfig, function(error) {
	//console.log(error);
});
var moment = require('moment');


app.use(express.static('public'));					// serve files from the public folder
app.use('/scripts', express.static(__dirname + '/node_modules/'));
var sess;
app.get('/:name', serveFiles, function(req,res){
    /*
    * Here we have assign the 'session' to 'sess'.
    * Now we can create any number of session variable we want.
    * in PHP we do as $_SESSION['var name'].
    * Here we do like this.
    */
  });
var SEW = require('./models/sewage');

// listener for all static file requests
socketServer.on('connection', openSocket);	// listener for websocket data

function serveFiles(request, response) {
	var fileName = request.params.name;				// get the file name from the request
	response.sendFile(fileName, {"root": __dirname});							// send the file
}

myPort.on('data', function(data) {
	a = moment().format("YYYY-MM-DD HH:mm:ss");
	datos = data.split("%");
	document = { altura: parseInt(datos[0]), hora: a};
	SEW.insertLectura(document);
});

function openSocket(socket){
	//console.log('new user address: ' + socket.handshake.address);
	// send something to the web client with the data:
	if (myPort.isOpen()) {
		socket.emit('message', '000');
		//console.log('000');
	} else {
		socket.emit('message', '999');
		console.log('999');
	}

	//socket.emit('message', 'Hello, ' + socket.handshake.address);

	// this function runs if there's input from the client:
	socket.on('message', function(data) {
		myPort.write(data);							// send the data to the serial device
	});

	// this function runs if there's input from the serialport:
	myPort.on('data', function(data) {
		socket.emit('message', data);		// send the data to the client
	});

	// this function runs if port is closed:
	myPort.on('disconnect', function() {
		//console.log("Port is closed");
	});

	myPort.on('error', function() {
		socket.emit('message', '999');
		console.log('999');
	});
}




/* add worksheet to workbook */

