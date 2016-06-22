var sqlite3 = require('sqlite3').verbose(),
db = new sqlite3.Database('sewage');
var moment = require('moment');

a = moment().startOf('day').subtract(1, 'days').add(19, 'hours').format();
b = moment().startOf('day').subtract(1, 'days').add(19, 'hours').add(20, 'minutes').format();
query = 'SELECT hora, altura FROM lecturas;';
db.serialize(function() {
  db.each(query, function(err, row) {
    console.log(row.hora + ": " + row.altura);
  });
});

