var sqlite3 = require('sqlite3').verbose(),
db = new sqlite3.Database('sewage'),
SEWAGE = {};


SEWAGE.insertLectura = function(readData)
{
  var stmt = db.prepare("INSERT INTO lecturas VALUES (?,?,?)");
  stmt.run(null,readData.hora,readData.altura);
  stmt.finalize();
}

SEWAGE.readLecturas = function(callback)
{
  db.all("SELECT hora, altura FROM lecturas", function(err, rows) {
    if(err)
     {
      throw err;
     }
    else
     {
      callback(null, rows);
     }
  });
}

module.exports = SEWAGE;
