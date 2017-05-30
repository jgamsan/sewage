var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyUSB0', {
    databits: 8,
    parity: 'none'
});
port.on('data', function (data) {
  console.log('Data: ' + data);
});
