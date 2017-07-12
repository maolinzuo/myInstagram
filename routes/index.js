var express = require('express');
var router = express.Router();
var fs = require('fs');
var Product = require('../models/product');
var User = require('../models/user');

var multer = require('multer');

var upload = multer({ dest: 'public/uploads/' });

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  Product.find(function(err, docs) {
    productChunks = [];
    for (var i = 0; i < docs.length ; i ++) {
      productChunks.push(docs.slice(i, i+1));
    }
    productChunks.sort(function (a, b) {
      return parseInt(b[0].timeStamp) - parseInt(a[0].timeStamp);
    });
    res.render('index', { productChunks: productChunks, username: req.user.email });
  });
});

router.get('/mail', isLoggedIn, function(req, res, next) {
  var id = req.session.passport.user;
  User.findById(id, function(err, user) {
    if (!err) {
      res.render('chat', {username : user.email});
    }
  })
});

/* file upload */
router.post('/upload', upload.single('imgInp'), function(req, res, next){
  var file = req.file;
  var timeStamp = new Date().getTime();
  if (file) {
    console.log('/upload')
    console.log(req.body);
    var filename = file.destination + file.filename;
    console.log(filename);
    var newFilename = filename + '.' + file.mimetype.split(/\//)[1];
    fs.rename( filename, newFilename, function(err) {
      if ( err ) console.log('ERROR: ' + err);
      else {
        console.log('upload success');
        console.log(newFilename);
        var id = req.session.passport.user;
        User.findById(id, function(err, user) {
          if (!err) {
            new Product({
              imagePath: '/uploads/' + file.filename + '.' + file.mimetype.split(/\//)[1],
              username: user.email,
              description: req.body.description,
              timeStamp: timeStamp
            }).save(function(err, result) {
              if (err) {
                  console.log('save error:' + err);
              } else {
                  console.log('save success');
              }
            });
          }
        })
      }
    });
  }
  res.redirect('/');
});

router.get('/upload', isLoggedIn, function(req, res, next){
  res.render('upload');
});

router.get('/getallusers', function(req, res, next){
    User.find(function(err, docs){
      docs.forEach(function(ele){
        console.log(ele);
      });
      res.send(docs);
    });
});

router.post('/update/', upload.any(), function(req, res){
  Product.findById({_id:req.body.id}, function (err, doc){
    doc.description = req.body.description;
    doc.timeStamp = new Date().getTime();
    doc.save();
  });
  res.redirect('/user/profile');
});

router.delete('/delete/:id', function(req, res){
  //delete the requested item from mongodb
  console.log(req.params.id);
  Product.findByIdAndRemove({_id:req.params.id}, function(err, docs) {
    console.log(docs);
    if(err) {
      res.json(err);
    } else {
      res.json(docs);
    }
  });
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/user/signin');
}
