var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');

var index = require('./routes/index');
var users = require('./routes/users');
var helper = require('./routes/helper');

mongoose.connect('mongodb://test:test@ds129402.mlab.com:29402/myins');

require('./config/passport');

var app = express();

// to use layout, partials, node.js 3x
app.use(partials());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  next();
})

app.use('/', index);
app.use('/user', users);
app.use('/helper', helper);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// server connection, could it deployed on port 4000
var http = require('http').Server(app);
var io = require('socket.io')(http);

var userNumber = 0;
// connection Dic
var connectionList = {};
var offlineMessages = {};

io.on('connection', function(socket){
  userNumber += 1;
  console.log(userNumber.toString() + ' user connected');
  var socketId = socket.id;
  connectionList[socketId] = { socket: socket };

  socket.on('join', function (data) {
    var username = data.username;
    connectionList[socketId].username = username;
    console.log('welcome, ' + username);
    console.log(offlineMessages);
    if (username in offlineMessages) {
        offlineMessages[username].forEach(function(msg) {
          socket.emit('chat message', msg);
        });
        delete offlineMessages[username];
    }
  });

  socket.on('disconnect', function(){
    userNumber -= 1;
    console.log(userNumber.toString() + ' user connected.');
    console.log(connectionList[socketId].username + ' has left.');
    delete connectionList[socketId];
  });

  socket.on('chat message', function(msg) {
    console.log('message to: ' + msg.to);
    for (var id in connectionList) {
      var connection = connectionList[id];
      console.log('username ' + connection.username);
      if (connection.username === msg.to) {
        connection.socket.emit('chat message', msg.from + ' to ' + msg.to + ': ' + msg.msg);
        // socket.emit('chat message', msg.from + ' to ' + msg.to + ': ' + msg.msg);
        return;
      }
    }
    if (msg.to in offlineMessages) {
      offlineMessages[msg.to].push(msg.from + ' to ' + msg.to + ': ' + msg.msg);
    }
    else {
      offlineMessages[msg.to] = [msg.from + ' to ' + msg.to + ': ' + msg.msg];
    }
    console.log(offlineMessages);
  });
});

http.listen(4000, function(){
  console.log('listening on *:4000');
});

module.exports = app;

// get time
function getTime() {
  var date = new Date();
  var datevalues = [
    date.getFullYear(),
    date.getMonth()+1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ];
  return datevalues[0]+'-'+datevalues[1]+'-'+ datevalues[2]+'  '+datevalues[3]+':'+datevalues[4]; // 2017-3-12 12:28
}
