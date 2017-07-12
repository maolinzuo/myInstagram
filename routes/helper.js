var express = require('express');
var router = express.Router();
var fs = require('fs');
var Product = require('../models/product');
var User = require('../models/user');

router.post('/thumbups', function (req, res, next) {
  var oid = req.body.oid;
  console.log(oid);
  var username = req.body.username;
  Product.update({_id: oid},{$addToSet:{thumbups: username}}, function(err){
      if(err){
          res.send(500);
          console.log(err);
      }
  });
  Product.findById(oid, function(err, product) {
    var temp = product.thumbups.length;
    console.log(temp);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(temp.toString());
    return;
  })
});

router.post('/addcomment', function (req, res, next) {
  var oid = req.body.oid;
  console.log(oid);
  var username = req.body.username;
  var description = req.body.description;
  console.log(description);
  res.end(username+': '+description);
  Product.update({_id: oid},{$addToSet:{comments: {username: username, description: description}}}, function(err){
      if(err){
          res.send(500);
          console.log(err);
      }
  });
  return;
  // Product.update({_id: oid},{$addToSet:{thumbups: username}}, function(err){
  //     if(err){
  //         res.send(500);
  //         console.log(err);
  //     }
  // });
  // Product.findById(oid, function(err, product) {
  //   var temp = product.thumbups.length;
  //   console.log(temp);
  //   res.writeHead(200, { 'Content-Type': 'text/plain' });
  //   res.end(temp.toString());
  //   return;
  // })
});

module.exports = router;
