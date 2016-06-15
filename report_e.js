/**
 * Created by jose on 15/6/16.
 */
var sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database('sewage');

var altura_maxima = 247;
var linea_minima = 152;
var linea_maxima = 192;
var linea_critica = 215;
var moment = require('moment');
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
var mailOptions = {
    from: '"CMT Parga - depuradora" <no-reply@galiclick.com>', // sender address
    to: 'uha95@mundo-r.com', // list of receivers
    subject: 'Informe Diario Depuradora CMT Parga ✔', // Subject line
    text: 'Informe Lecturas de la Depuradra CMT Parga correspondiente al dia ' + moment().subtract(1, 'days').format("DD-MM-YYYY"), // plaintext body
};

var tmp = require('tmp');
var fs = require('fs');

tmp.file({ mode: 0644, prefix: 'depuradora-', postfix: '.xls' }, function _tempFileCreated(err, path, fd) {
    var writeStream = fs.createWriteStream(path);
    var cadena = '';
    var header=["Hora", "Lectura", "Linea Minima", "Linea Maxima", "Linea Critica"].join('\t') + "\n";

    db.serialize(function() {
        cadena = cadena + header;
        db.each("SELECT hora, altura FROM lecturas", function (err, row) {
            var row2 = [moment(row.hora).format("HH:mm:ss"), altura_maxima - row.altura, linea_minima, linea_maxima, linea_critica].map(String).join('\t');
            var row1 = row2.concat('\n');
            console.log(row1);
            cadena = cadena.concat(row1);
        });
        writeStream.write(cadena);
        writeStream.close();
        console.log(cadena);
    })
    db.close();
    mailOptions['attachments'] = [{path: path}];
    /*transporter.sendMail(mailOptions, function(error){
        if(error){ }
        else {console.log("Enviado .....");}
    });*/
});
