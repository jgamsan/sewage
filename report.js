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
var altura_maxima = 247;
var linea_minima = 202;
var linea_maxima = 212;
var mailOptions = {
    from: '"CMT Parga - depuradora" <no-reply@galiclick.com>', // sender address
    to: 'uha95@mundo-r.com', // list of receivers
    subject: 'De Prueba ✔', // Subject line
    text: 'De Prueba 🐴', // plaintext body
    html: '<b>Hello world 🐴</b>' // html body
};

var moment = require('moment');
var Datastore = require('nedb')
    , db = new Datastore({ filename: __dirname + '/db.json', autoload: true });

//var a = moment().format();
a = moment().startOf('day').add(12, 'hours').subtract(1, 'days').format();
b = moment().startOf('day').add(12, 'hours').format();
db.find({ "hora": { $lte: a, $gte: b } }, {"altura": 1, "hora": 1, "_id": 0}, function (err, docs) {
  var arr = [];
  docs.forEach(function(value) {
      arr.push([moment(value.hora).format("HH:mm:ss"), altura_maxima - value.altura, linea_minima, linea_maxima])
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
    mailOptions['attachments'] = [{path: path}];
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });
    console.log("File: ", path);
    console.log("Filedescriptor: ", fd);
    console.log(moment().startOf('year'));
  });

});

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
