// API - Server

// Load required packages
var mongoose = require('mongoose');
var beerController = require('./controllers/beer');
var userController = require('./controllers/user');

// Connect to the beerlocker MongoDB
mongoose.connect('mongodb://localhost:27017/beerlocker');

// Create our Koa application
var Koa = require('koa');
var app = new Koa();
// Create our Koa router
var Router = require('koa-router');
var router = new Router();

// Use the body-parser package in our application
var bodyParser = require('koa-bodyparser');

// will parse application/x-javascript type body as a JSON string
app.use(bodyParser({
  extendTypes: {
    json: ['application/x-javascript']
  }
}));

app.use(async ctx => {
  // the parsed body will store in ctx.request.body
  // if nothing was parsed, body will be an empty object {}
  ctx.body = ctx.request.body;
});

router
  .get('/beers',beerController.getBeers)
  .post('/beers',beerController.postBeers)
  .get('/beers/:beer_id',beerController.getBeer)
  .put('/beers/:beer_id',beerController.putBeer)
  .delete('/beers/:beer_id',beerController.deleteBeer)
  .post('/users',userController.postUsers)
  .get('/users',userController.getUsers);


app
  .use(router.routes())
  .use(router.allowedMethods());

// Start the server
app.listen(3000);
