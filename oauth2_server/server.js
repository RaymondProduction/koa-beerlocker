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
//var mount = require('koa-mount');
var oauthserver = require('koa-oauth-server');

// Create a new koa app.
var app = new Koa();
const authController = require('./controllers/auth');


// Create a router for oauth.
// var router = new Router({
//   prefix: '/oauth2'
// });

var router = new Router();

const render = require('koa-ejs');
const path = require('path');
// Set view engine to koa-ejs
render(app, {
  root: path.join(__dirname, 'views'),
  layout: 'dialog',
  viewExt: 'ejs',
  cache: false,
  debug: true
});

/*
app.use(async function (ctx) {
  await ctx.render('dialog', {title : 'test'});
});

*/

// Enable body parsing.
app.use(bodyparser());

// See https://github.com/thomseddon/node-oauth2-server for specification.
app.oauth = oauthserver({
  grants: ['password'],
  debug: true,
  model: require('./models/model')
});

var clientController = require('./controllers/client');
var userController = require('./controllers/user');

var passport = require('koa-passport')
app.use(passport.initialize())
app.use(passport.session())

// Register `/token` POST path on oauth router (i.e. `/oauth2/token`).
router
  .post('/token', app.oauth.grant())
  .post('/user', userController.postUser)
  .post('/client', clientController.postClient)
  .get('/', authController.getMain)
  .get('/dialog', authController.getDialog)
  .post('/user', userController.postUser)
  .post('/login', authController.postLoginVerify)
  .get('/client',  clientController.getClient)
  .get('/user',  userController.getUser);

app
  .use(router.routes())
  .use(router.allowedMethods())
// Require authentication for now
/*
.use(function(ctx, next) {
  if (ctx.isAuthenticated()) {
    return next()
  } else {
    ctx.redirect('/')
  }
});
*/
// Register `/token` POST path on oauth router (i.e. `/oauth2/token`).



// Start koa server.
app.listen(3000);
