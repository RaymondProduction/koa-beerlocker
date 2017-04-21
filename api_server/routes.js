module.exports = function(router) {

  // authentication
  require('./controllers/auth')
  const passport = require('koa-passport')

  var beerController = require('./controllers/beer');
  var userController = require('./controllers/user');

  router
    .get('/login',
      passport.authenticate('local', {
        successRedirect: '/beers',
        failureRedirect: '/'
      })
    )
    .get('/beers', beerController.getBeers)
    .post('/beers', beerController.postBeers)
    .get('/beers/:beer_id', beerController.getBeer)
    .put('/beers/:beer_id', beerController.putBeer)
    .delete('/beers/:beer_id', beerController.deleteBeer)
    .post('/users', userController.postUsers)
    .get('/users', userController.getUsers);
};
