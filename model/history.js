const mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const history = mongoose.Schema({
    idPetShop: ObjectId,
    macAddress: String
})

module.exports = mongoose.model('history', history)
