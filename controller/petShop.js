const petShop = require('../model/petShop.js')
const response = require('../config/response')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const haversine = require('haversine')
var distance = require('google-distance');
distance.apiKey = 'AIzaSyBj1Jt7lZarIkV7kFj9zepz3E2P1UdWFek';

exports.inputData = (data, gambar) =>
    new Promise(async (resolve, reject)=>{
        const newPetshop = new petShop({
            namaPetshop : data.namaPetshop,
            alamat: data.alamat,
            noTelp:  data.noTelp,
            gambar: gambar,
            lat: data.lat,
            lon: data.lon
        })
        newPetshop.save()
            .then(r=>{
                resolve(response.commonSuccessMsgWithId('Berhasil menginput data', newPetshop._id))
            }).catch(err => {
                reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
        })
    })

exports.updateData = (data, id) =>
    new Promise(async (resolve, reject)=>{
        console.log(id)
        petShop.update(
                {
                    _id: ObjectId(id)
                }, { $addToSet: data }
            )
            .then(r=>{
                resolve(response.commonSuccessMsg('Berhasil merubah data'))
            }).catch(err => {
            reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
        })
    })


exports.updateDataGambar = (data, id) =>
    new Promise(async (resolve, reject)=>{
        console.log(data)
        petShop.update(
            {
                _id: ObjectId(id)
            }, { $push: {gambar: data} }
        )
            .then(r=>{
                resolve(response.commonSuccessMsg('Berhasil merubah data'))
            }).catch(err => {
            reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
        })
    })

exports.getDataPetshop = () =>
    new Promise(async (resolve, reject)=>{
        await petShop.find()
            .then(r =>{
                resolve(response.commonResult(r))
            }).catch(err => {
            response.commonErrorMsg('Mohon Maaf Terjadi Kesalahan Pada Server')
        })
    })

exports.getJarakPetshop = (data, radius) =>
    new Promise(async (resolve, reject)=>{
        await petShop.find()
            .then(async r =>{
                let datas = []
                let originLatLong = data.lat + "," + data.lon
                for (i in r){
                    let latLongDesti = r[i].lat + "," + r[i].lon
                    let jarak = await getData(originLatLong, latLongDesti).then()
                    let rad = jarak.distance.replace("km", "")
                    if(Number(rad) <= Number(radius)){
                        datas.push({
                            gambar: r[i].gambar,
                            namaPetshop: r[i].namaPetshop,
                            _id: r[i]._id,
                            alamat: r[i].alamat,
                            noTelp: r[i].noTelp,
                            jamBuka: r[i].jamBuka,
                            produk: r[i].produk,
                            jasa: r[i].jasa,
                            jarak: jarak,
                            lat: r[i].lat,
                            lon: r[i].lon
                        })
                    }
                    if (Number(radius) === 0){
                        datas.push({
                            gambar: r[i].gambar,
                            namaPetshop: r[i].namaPetshop,
                            _id: r[i]._id,
                            alamat: r[i].alamat,
                            noTelp: r[i].noTelp,
                            jamBuka: r[i].jamBuka,
                            produk: r[i].produk,
                            jasa: r[i].jasa,
                            jarak: jarak,
                            lat: r[i].lat,
                            lon: r[i].lon
                        })
                    }
                }
                resolve(response.commonResult(datas.sort(compare)))
            }).catch(err => {
                response.commonErrorMsg('Mohon Maaf Terjadi Kesalahan Pada Server')
            })
    })

const getData = (latLongOrigin, latLongDesti) =>
    new Promise(async (resolve, reject)=>{
        await distance.get(
            {
                origin: latLongOrigin,
                destination: latLongDesti
            },
            function(err, data) {
                if (err) {return console.log(err);}
                else {
                    resolve(data)
                }

            });
    })


const compare = (a, b) => {
    const jarakA = a.jarak.distance.toUpperCase();
    const jarakB = b.jarak.distance.toUpperCase();

    let comparison = 0;
    if (jarakA > jarakB) {
        comparison = 1;
    } else if (jarakA < jarakB) {
        comparison = -1;
    }
    return comparison;
}


