const router = require('express').Router()
const petShop = require('../controller/petShop')
const multer = require('multer')

var storage = multer.diskStorage({
    filename: function (req, file, cb) {
        let ext = file.originalname.substring(
            file.originalname.lastIndexOf("."),
            file.originalname.length
        )
        cb(null, Date.now() + ext);
    },
    destination: function (req, file, cb) {
        // console.log(file)
        cb(null, './gambar')
    }
})


var upload = multer({storage: storage}).single("gambar")

router.post("/input",upload, (req, res) => {
    petShop.inputData(req.body, req.file.filename)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

router.get("/getdata", (req, res) => {
    petShop.getDataPetshop()
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

router.get("/getdata/:id", (req, res) => {
    petShop.getDataPetshopId(req.params.id)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

router.put("/ubah/:id",upload, (req, res) => {
    petShop.updateData(req.body, req.params.id)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

router.put("/ubahpetshop/:id/",upload, (req, res) => {
    petShop.updateDataPetshop(req.body, req.params.id)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

router.put("/ubahpetshop/:id/:hari",upload, (req, res) => {
    petShop.updateDataPet(req.body, req.params.id, req.params.hari)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

router.put("/ubahgambar/:id", upload, (req, res) => {
    petShop.updateDataGambar(req.file.filename, req.params.id)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

router.post("/getjarak/:radius", (req, res) => {
    petShop.getJarakPetshop(req.body, req.params.radius)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})


module.exports = router
