var express = require('express');
var router = express.Router();

var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

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
  res.send('File uploaded!');
});

module.exports = router;
