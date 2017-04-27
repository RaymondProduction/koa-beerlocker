// OAuth Server

var mongoose = require('mongoose');

// Connect to the beerlocker MongoDB
var uristring = 'mongodb://localhost:27017/oauth';
mongoose.connect('mongodb://localhost:27017/oauth', function(err, res) {
  if (err) {
    console.log('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log('Succeeded connected to: ' + uristring);
  }
});


var Router = require('koa-router');
var bodyparser = require('koa-bodyparser');
var Koa = require('koa');
var mount = require('koa-mount');
var oauthserver = require('koa-oauth-server');

// Create a new koa app.
var app = new Koa();

// Create a router for oauth.
var router = new Router();

// Enable body parsing.
app.use(bodyparser());

// See https://github.com/thomseddon/node-oauth2-server for specification.
app.oauth = oauthserver({
  grants: ['password'],
  debug: true,
  model: require('./models/model')
});

// Mount `oauth2` route prefix.
app.use(mount('/oauth2', router.middleware()));

// Register `/token` POST path on oauth router (i.e. `/oauth2/token`).

var clientController = require('./controllers/client');

router
.post('/token', app.oauth.grant())
.post('/clients', clientController.postClients)
.get('/clients', clientController.getClients);

// Start koa server.
app.listen(3000);
