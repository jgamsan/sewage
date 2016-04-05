var jsonfile = require('jsonfile');
var util = require ('util');
var moment = require('moment');
var sleep = require('sleep');


var file = 'data.json';
var lista = [];
for(var i = 0; i < 20; i++) {
  var obj = {hora: moment().format(), altura: Math.random()};
  lista.push(obj);
  sleep.sleep(1);
}
jsonfile.writeFile(file, lista, function (err) {
  console.error(err)
})
