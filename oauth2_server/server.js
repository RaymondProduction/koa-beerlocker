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
 var router = new Router({
   prefix: '/oauth2'
 });

// Enable body parsing.
app.use(bodyparser());

// See https://github.com/thomseddon/node-oauth2-server for specification.
app.oauth = oauthserver({
  grants: ['password'],
  debug: true,
  model: require('./models/model')
});

var clientController = require('./controllers/client');

// Register `/token` POST path on oauth router (i.e. `/oauth2/token`).
router
  .post('/token', app.oauth.grant())
  .post('/clients', clientController.postClients)
  .get('/', function(ctx, next) {
    ctx.body = 'Start OAuth2';
  });

app
  .use(router.routes())
  .use(router.allowedMethods());

// Register `/token` POST path on oauth router (i.e. `/oauth2/token`).



// Start koa server.
app.listen(3000);
