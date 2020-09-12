const history = require('../model/history')
const response = require('../config/response')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
var distance = require('google-distance');
distance.apiKey = 'AIzaSyAukviuPQ_-gjcT7tM4dTwO1K_Kgqc-5WQ';

exports.inputHistory = (data) =>
    new Promise(async (resolve, reject)=>{
        const newHistory = new history({
            idPetShop : data.id,
            macAddress: data.macAddress
        })
        history.findOne({
            idPetShop: ObjectId(data.id)
        }).then(res => {
            if (res){
                reject(response.commonErrorMsg('Id Sudah Ada'))
            }else {
                newHistory.save()
                    .then(r=>{
                        resolve(response.commonSuccessMsg('Ok'))
                    }).catch(err => {
                    reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
                })
            }
        })
    })

exports.getHistoryJarakPetshop = (data) =>
    new Promise(async (resolve, reject)=>{
        await history.aggregate([
            {
                $match: {
                    macAddress: data.macAddress
                }
            },
            {
                $lookup:
                    {
                        from: "petshops",
                        localField: "idPetShop",
                        foreignField: "_id",
                        as: "data"
                    }
            },
            {
                $unwind: "$data"
            }
        ]).sort({_id: -1})
            .then(async r =>{
                let datas = []
                let originLatLong = data.lat + "," + data.lon
                for (i in r){
                    let latLongDesti = r[i].data.lat + "," + r[i].data.lon
                    let jarak = await getData(originLatLong, latLongDesti).then()
                    datas.push({
                        gambar: r[i].data.gambar,
                        namaPetshop: r[i].data.namaPetshop,
                        _id: r[i].data._id,
                        noTelp: r[i].data.noTelp,
                        jamBuka: r[i].data.jamBuka,
                        produk: r[i].data.produk,
                        jasa: r[i].data.jasa,
                        jarak: jarak,
                        lat: r[i].data.lat,
                        lon: r[i].data.lon
                    })
                }
                resolve(response.commonResult(datas))
            }).catch(err => {
                response.commonErrorMsg('Mohon Maaf Terjadi Kesalahan Pada Server')
            })
    })

const getData = (latLongOrigin, latLongDesti) =>
    new Promise(async (resolve, reject)=>{
        await distance.get(
            {
                index: 1,
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
