module.exports = function(router) {

  // authentication
  const authController = require('./controllers/auth')

  var beerController = require('./controllers/beer');
  var userController = require('./controllers/user');

  router
    .post('/custom', authController.postCustom)
    .get('/', authController.getMain)
    .post('/login', authController.postLoginVerify)
    .get('/logout', authController.getLogout)
    .get('/beers', beerController.getBeers)
    .post('/beers', beerController.postBeers)
    .get('/beers/:beer_id', beerController.getBeer)
    .put('/beers/:beer_id', beerController.putBeer)
    .delete('/beers/:beer_id', beerController.deleteBeer)
    .post('/users', userController.postUsers)
    .get('/users', userController.getUsers);
};
