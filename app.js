const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const checkip = require('check-ip-address');

const port = process.argv[2] || 443;
const insecurePort = process.argv[3] || 1337;
var insecureServer;

const fs = require("fs");
const https = require('https');
const certsPath = path.join(__dirname, 'certs');
var options = {
    key : fs.readFileSync(path.join(certsPath, 'grupocfapp.key')),
    ca :  fs.readFileSync(path.join(certsPath, 'gd_bundle-g2-g1.crt')),
    cert: fs.readFileSync(path.join(certsPath, '78fa81a6daf77206.crt')),
    requestCert: false
, rejectUnauthorized: false
}

const index = require('./routes/index');
const users = require('./routes/users');

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

require('./config/passport')(passport); // pass passport for configuration
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'everylikepeople' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(express.static(path.join(__dirname, 'public')));

// routes ======================================================================
require('./config/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./config/POST.js')(app, passport);

// Take error Messsages
app.use(function(err,req, res, next){
    res.writeHead(err.status || 500,{
        'WWW-Authenticate': 'Basic',
        'Content-Type': 'text/plain'
    });
    res.end(err.message);
})

app.use('/', index);
app.use('/users', users);

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
server = https.createServer(options, app).listen('443', function () {
    console.log('listening on port 443')

})


insecureServer = http.createServer();
insecureServer.on('request', function (req, res) {
     //TODO also redirect websocket upgrades
      try {
         var rep = req.headers.host.replace(/:\d+/, ':' + port)
      }
      catch(err) {
          console.log(err)
          var rep = 'grupocfapp.com';
      }
        res.setHeader(
        'Location'
        , 'https://' + rep + req.url
        );

    res.statusCode = 302;
    res.end();
});
insecureServer.listen(insecurePort , "0.0.0.0", function () {
    console.log("\nRedirecting all http traffic to https\n");
});
//app.listen();
//module.exports = app;
