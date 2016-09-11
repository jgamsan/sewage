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
var moment = require('moment');
var tmp = require('tmp');
XLSX = require('xlsx');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/sewage');
var Lectura = require('./models/lecturas');
var altura_maxima = 247;
var linea_minima = 152;
var linea_maxima = 192;
var linea_critica = 215;

var mailOptions = {
  from: '"CMT Parga - depuradora" <no-reply@galiclick.com>', // sender address
  to: 'uha95@mundo-r.com, jgamsan@et.mde.es, eperlah@et.mde.es', // list of receivers
  subject: 'Informe Diario Depuradora CMT Parga ✔', // Subject line
  text: 'Informe Lecturas de la Depuradra CMT Parga correspondiente al dia ' + moment().subtract(1, 'days').format("DD-MM-YYYY"), // plaintext body
};

a = moment().startOf('day').subtract(1, 'days').format();
b = moment().endOf('day').subtract(1, 'days').format();

var arr = [];

Lectura.find({ hora: { $gt: a, $lt: b } }, function (err, docs) {
  docs.forEach(function (row) {
    arr.push([moment(row.hora).format("HH:mm:ss"), altura_maxima - row.altura, linea_minima, linea_maxima, linea_critica]);
  });
  var ws_name = moment().startOf('day').subtract(1, 'days').format("YYYY-MM-DD").toString();
  var wb = new Workbook(), ws = sheet_from_array_of_arrays(arr);
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;
  tmp.file({ mode: 0644, prefix: 'depuradora-', postfix: '.xlsx' }, function _tempFileCreated(err, path, fd) {
    if (err) throw err;
    XLSX.writeFile(wb, path);
    mailOptions['attachments'] = [{path: path}];
    transporter.sendMail(mailOptions, function(error, info) {
      if(error){ }
    });
  });
});


Lectura.remove({hora: {$lt: b}}, function(error) {
  if (error) {}
});

process.exit(0);
