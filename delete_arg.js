var sqlite3 = require('sqlite3').verbose(),
db = new sqlite3.Database('sewage');

var query = "DELETE FROM lecturas WHERE hora BETWEEN '" + process.argv[2] + "' AND '" + process.argv[3] + "';";

db.serialize(function() {
  db.run(query, function(err, rows)
    {
    if(err) {
      throw err;
    }
    else {
      console.log("Borrado perfectamente");
    }
  });
});
