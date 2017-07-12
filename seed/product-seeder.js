var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.Promise = require('bluebird')

// database connection
var db = mongoose.connect('mongodb://127.0.0.1:27017/shopping');

db.connection.on("error", function (error) {  
    console.log("fail to connect：" + error); 
}); 

db.connection.on("open", function () {  
    console.log("success to connect"); 
});

var products = [
    new Product({
        imagePath: 'https://i.ytimg.com/vi/Yp3IoC01drc/maxresdefault.jpg',
        title: 'Gothic',
        description: 'this is a long story',
        price: 10
   }),
   new Product({
       imagePath: 'https://i.ytimg.com/vi/Yp3IoC01drc/maxresdefault.jpg',
       title: 'Gothic',
       description: 'this is a long story',
       price: 10
   })
];

var done = 0
for (var i = 0; i < products.length; i++) {
    products[i].save(function(err, result) {
        done = done + 1;
        if (done == products.length) {
            exit();
        }
        if (err) {
            console.log('save error:' + err);
        } else {
            console.log('save success');
        }
    });
}

function exit() {
    mongoose.disconnect();
}