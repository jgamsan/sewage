/**
 * Created by jose on 5/4/16.
 */
var moment = require('moment');
var Datastore = require('nedb')
    , db = new Datastore({ filename: __dirname + '/db.json', autoload: true });
var a = moment().format();
console.log(a);

var document = { Shift: "Late"
    , StartTime: a
    , EndTime: a
};

// add the generated data to datafile
db.insert(document, function (err, newDoc) {
});

db.find({ "StartTime": { $lt: a } }, function (err, docs) {
    console.log(docs);
});