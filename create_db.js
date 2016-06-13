var sqlite3 = require('sqlite3').verbose(),
db = new sqlite3.Database('sewage');


db.serialize(function() {
  db.run("DROP TABLE IF EXISTS lecturas");
  db.run("CREATE TABLE IF NOT EXISTS lecturas (id INTEGER PRIMARY KEY AUTOINCREMENT, hora DATE, altura INTEGER)");
  console.log("La tabla lecturas ha sido correctamente creada");
});

db.close();
