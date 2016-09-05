var mongoose = require('mongoose');
var componentSchema = new mongoose.Schema({
  altura: Number,
  hora: Date
});

module.exports = mongoose.model('Lectura', componentSchema);
