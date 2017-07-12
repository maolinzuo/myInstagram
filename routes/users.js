var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Product = require('../models/product');

// csurf middleware
var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function(req, res, next) {
  var username = req.user.email || '';
  Product.find({username: username}, function(err, docs) {
  productChunks = docs;
  productChunks.sort(function (a, b) {
    return parseInt(b.timeStamp) - parseInt(a.timeStamp);
  });
  console.log(productChunks);
  console.log(username);
  res.render('user/profile', { data: productChunks, username: username});
});
});

router.get('/logout', isLoggedIn, function (req, res, next){
  console.log('loggingout');
  req.logout();
  res.redirect('/');
});

router.use('/', notLoggedIn, function(req, res, next) {
  next();
});

router.get('/signup', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

router.get('/signin', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true
}));

module.exports = router;

// protect the users and check it, middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
