var pg = require('pg');
var jsonfile = require('jsonfile');
var util = require ('util');

var conString = "postgres://gestioncampo:H&940>2!Fknr5(m19@localhost/example_node";

var file = 'data.json';
var lista = [];
jsonfile.readFile(file, function(err, obj) {
  console.dir(obj);
  lista = obj;
});


pg.connect(conString, function(err, client, done) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  for(var i = 0; i < 20; i++) {

    client.query("INSERT INTO distributors VALUES ($1, $2)",[lista[i].hora, lista[i].altura], function(err, result) {
      if(err) {
        return console.error('error en insert data', err);
      }
      console.log("creado satisfactoriamente");
      //output: 1
    });
  }
  done();
});
