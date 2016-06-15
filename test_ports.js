var serialport = require('serialport'),     // include the serialport library
SerialPort  = serialport.SerialPort,      // make a local instance of serial
portName = process.argv[2],               // get the port name from the command line
portConfig = {
  baudRate: 9600,
  // call myPort.on('data') when a newline is received:
  parser: serialport.parsers.readline('\n')
};

// open the serial port:
var myPort = new SerialPort(portName, portConfig, function(error) {
  //console.log(error);
});

if (myPort.isOpen()) {
    console.log('Puerto Abierto');
} else {
    console.log('Puerto Cerrado');
    myPort.open(function (err) {
      if (err) {
        return console.log('Error opening port: ', err.message);
      } else {
        console.log("Puerto Abierto");
        process.exit(code);
      }
    })
}

myPort.on('disconnect', function() {
    console.log("Port is disconnected");
});

myPort.on('error', function() {
    console.log('Error in port');
});
