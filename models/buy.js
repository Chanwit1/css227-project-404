var mongoose = require('mongoose');

var buySchema = new mongoose.Schema({
    Mname: String,
    image: String,
    dateb: String,
    theaterb: String,
    timeb: String,
    sit:[String],
    name:String,
    price:Number
});

module.exports = mongoose.model('Buy', buySchema);