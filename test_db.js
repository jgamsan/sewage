var sqlite3 = require('sqlite3').verbose(),
db = new sqlite3.Database('sewage');

var query = "SELECT hora, altura FROM lecturas where hora between '" + process.argv[2] + "' AND '" + process.argv[3] + "';";

db.serialize(function() {
  db.all(query, function(err, rows)
    {
    if(err) {
      throw err;
    }
    else {
      console.log(rows);
    }
  });
});
