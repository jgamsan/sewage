
var SerialPort = require('serialport');
var buffer = new Buffer(6);
buffer[0] = 0xAA;
buffer[1] = 0x00;
buffer[2] = 0x01;
buffer[3] = 0x00;
buffer[4] = 0x00;
buffer[5] = 0xAB;
//var port = new SerialPort('/dev/ttyUSB0');

var port = new SerialPort('/dev/ttyUSB0');

port.on('data', function (data) {
  console.log('Data: ' + data);
});

port.on('open', function() {
  port.write(buffer, function(err) {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('message written');
  });
});

// open errors will be emitted as an error event
