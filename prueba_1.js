var sqlite3 = require('sqlite3').verbose(),
db = new sqlite3.Database('sewage');
var moment = require('moment');

a = moment().startOf('day').subtract(1, 'days').add(19, 'hours').format();
b = moment().startOf('day').subtract(1, 'days').add(19, 'hours').add(20, 'minutes').format();

//query = "SELECT hora, altura FROM lecturas where datetime(hora) between " + "datetime(" + String(a) + ")" + " AND datetime(" + String(b) + ");";

query = 'SELECT hora, altura FROM lecturas;';
//query = 'SELECT hora, altura FROM lecturas;';

db.serialize(function() {
  db.each(query, function(err, row) {
    console.log(row.hora + ": " + row.altura);
  });
});

var fs = require('fs');
var writeStream = fs.createWriteStream("file.xls");


writeStream.write("Sl No"+"\t"+" Age"+"\t"+"Name"+"\n"+"0"+"\t"+String(21)+"\t"+"Rob"+"\n"+"1"+"\t"+" 22"+"\t"+"bob"+"\n");

writeStream.close();
