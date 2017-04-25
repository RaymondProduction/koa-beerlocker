// API - Server

// Load required packages
var mongoose = require('mongoose');

// Connect to the beerlocker MongoDB
mongoose.connect('mongodb://localhost:27017/beerlocker');

// Create our Koa application
var Koa = require('koa');
var app = new Koa();


// var router = new Router({
//   prefix: '/api'
// });

// trust proxy
app.proxy = true

// sessions
var convert = require('koa-convert')
var session = require('koa-generic-session')
app.keys = ['your-session-secret']
app.use(convert(session()));

// Use the body-parser package in our application
var bodyParser = require('koa-bodyparser');

// Create our Koa router
var Router = require('koa-router');
var router = new Router();



app.use(bodyParser());

// Why doesn't it work!!!?
/*
app.use(async ctx => {
  // the parsed body will store in ctx.request.body
  // if nothing was parsed, body will be an empty object {}
  ctx.input_body = ctx.request.body;
});
*/

// authentication
require('./controllers/auth')
var passport = require('koa-passport')
app.use(passport.initialize())
app.use(passport.session())
var routes = require('./routes');

routes(router);

app
  .use(router.routes())
  .use(router.allowedMethods())
    // Require authentication for now
  .use(function(ctx, next) {
    if (ctx.isAuthenticated()) {
      return next()
    } else {
      ctx.redirect('/')
    }
  });


// Start the server
app.listen(4000);
