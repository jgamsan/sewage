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
var session = require('express-session');
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
var tmp = require('tmp');
XLSX = require('xlsx');

var mailOptions = {
    from: '"CMT Parga - depuradora" <no-reply@galiclick.com>', // sender address
    to: 'uha95@mundo-r.com', // list of receivers
    subject: 'De Prueba ✔', // Subject line
    text: 'De Prueba 🐴', // plaintext body
    html: '<b>Hello world 🐴</b>' // html body
};



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
var Datastore = require('nedb')
    , db = new Datastore({ filename: __dirname + '/db.json', autoload: true });
//  set up server and socketServer listener functions:
app.use(express.static('public'));					// serve files from the public folder
app.use('/scripts', express.static(__dirname + '/node_modules/'));
var sess;
app.get('/:name', serveFiles, function(req,res){
    sess=req.session;
    /*
    * Here we have assign the 'session' to 'sess'.
    * Now we can create any number of session variable we want.
    * in PHP we do as $_SESSION['var name'].
    * Here we do like this.
    */
    sess.data; // equivalent to $_SESSION['email'] in PHP.
  });
// transporter.verify(function(error, success) {
//    if (error) {
//         console.log(error);
//    } else {
//         console.log('Server is ready to take our messages');
//         transporter.sendMail(mailOptions, function(error, info){
//           if(error){
//               return console.log(error);
//           }
//           console.log('Message sent: ' + info.response);
//       });
//    }
// });

var a = moment().format();
db.find({ "hora": { $lt: a } }, {"altura": 1, "hora": 1, "_id": 0}, function (err, docs) {
  var arr = [];
  docs.forEach(function(value) {
      arr.push([value.altura, moment(value.hora).format("HH:mm:ss")])
  });
  console.log(arr);
  var ws_name = "SheetJS";
  var wb = new Workbook(), ws = sheet_from_array_of_arrays(arr);
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;
  //XLSX.writeFile(wb, 'test.xlsx');
  tmp.file({ mode: 0644, prefix: 'prefix-', postfix: '.xlsx' }, function _tempFileCreated(err, path, fd) {
    if (err) throw err;
    XLSX.writeFile(wb, path);
    // mailOptions['attachments'] = [{path: path}];
    // transporter.sendMail(mailOptions, function(error, info){
    //   if(error){
    //       return console.log(error);
    //   }
    //   console.log('Message sent: ' + info.response);
    // });
    console.log("File: ", path);
    console.log("Filedescriptor: ", fd);
  });

});

/* write file */

app.use(session({secret: 'ssshhhhh', saveUninitialized: true, resave: true}));

// listener for all static file requests
socketServer.on('connection', openSocket);	// listener for websocket data

function serveFiles(request, response) {
	var fileName = request.params.name;				// get the file name from the request
	response.sendFile(fileName, {"root": __dirname});							// send the file
}

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
		var a = moment().format();
		var datos = data.split("%");
		var altura = parseFloat(datos[0]);
		var document = { altura: parseInt(altura), hora: a};
		db.insert(document, function (err, newDoc) {
		});
		//console.log(data);
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

function datenum(v, date1904) {
  if(date1904) v+=1462;
  var epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
  var ws = {};
  var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
  for(var R = 0; R != data.length; ++R) {
    for(var C = 0; C != data[R].length; ++C) {
      if(range.s.r > R) range.s.r = R;
      if(range.s.c > C) range.s.c = C;
      if(range.e.r < R) range.e.r = R;
      if(range.e.c < C) range.e.c = C;
      var cell = {v: data[R][C] };
      if(cell.v == null) continue;
      var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

      if(typeof cell.v === 'number') cell.t = 'n';
      else if(typeof cell.v === 'boolean') cell.t = 'b';
      else if(cell.v instanceof Date) {
        cell.t = 'n'; cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      }
      else cell.t = 's';

      ws[cell_ref] = cell;
    }
  }
  if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  return ws;
}

/* original data */


function Workbook() {
  if(!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}


/* add worksheet to workbook */

