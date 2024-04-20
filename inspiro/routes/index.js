var express = require('express');
var router = express.Router();

const openAIController = require('../controllers/openAIController');

var path = require('path');
var multer = require('multer');

// Configure multer to use the original filename
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Inspiro' });
});

router.post('/upload', upload.single('myFile'), function (req, res, next) {
    // req.file is the 'myFile' file
    // req.body will hold the text fields, if there were any
    console.log(req.file);
    res.send('File uploaded!');
});

router.post('/inspiro-generate', openAIController.handleMessage);

module.exports = router;