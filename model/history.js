const mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const history = mongoose.Schema({
    idPetShop: ObjectId
})

module.exports = mongoose.model('history', history)
