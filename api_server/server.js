
// API - Server

// Load required packages
var mongoose = require('mongoose');

// Connect to the beerlocker MongoDB
mongoose.connect('mongodb://localhost:27017/beerlocker');

// Create our Koa application
var Koa = require('koa');
var app = new Koa();
// Create our Koa router
var Router = require('koa-router');
var router = new Router({
  prefix: '/api'
});

// Use the body-parser package in our application
var bodyParser = require('koa-bodyparser');


app.use(bodyParser());

// Why doesn't it work!!!?
/*
app.use(async ctx => {
  // the parsed body will store in ctx.request.body
  // if nothing was parsed, body will be an empty object {}
  ctx.input_body = ctx.request.body;
});
*/
var routes = require('./routes');

routes(router);


app
  .use(router.routes())
  .use(router.allowedMethods());

// will parse application/x-javascript type body as a JSON string


// Start the server
app.listen(4000);
