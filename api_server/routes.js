module.exports = function(router) {
var beerController = require('./controllers/beer');
var userController = require('./controllers/user');

router
  .get('/beers', beerController.getBeers)
  .post('/beers', beerController.postBeers)
  .get('/beers/:beer_id', beerController.getBeer)
  .put('/beers/:beer_id', beerController.putBeer)
  .delete('/beers/:beer_id', beerController.deleteBeer)
  .post('/users', userController.postUsers)
  .get('/users', userController.getUsers);
};
