const mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const userSchema = mongoose.Schema({
    namaPetshop: {
        type: String
    },
    alamat : {
        type: String
    },
    jamBuka : [
        {
            hari: {type: String},
            jam: {type: String}
        }
    ],
    noTelp: {
        type : String
    },
    gambar: Array,
    produk: [
        {
            namaProduk: {type: String},
            hargaProduk: {type: String}
        }
    ],
    jasa: [
        {
            namaJasa: {type: String},
            hargaJasa: {type: String}
        }
    ],
    lat: String,
    lon: String,
    idUser: ObjectId

})

module.exports = mongoose.model('petShop', userSchema)
