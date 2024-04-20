var express = require('express');
var router = express.Router();

var path = require('path');
var multer  = require('multer');

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
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/upload', function(req, res, next) {
  res.send(`
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="myFile">
      <button type="submit">Upload</button>
    </form>
  `);
});

router.post('/upload', upload.single('myFile'), function(req, res, next) {
  // req.file is the 'myFile' file
  // req.body will hold the text fields, if there were any
  console.log(req.file);
  res.send('File uploaded!');
});

module.exports = router;