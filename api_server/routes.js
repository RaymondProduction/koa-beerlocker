module.exports = function(router) {

  // authentication
  require('./controllers/auth')
  const passport = require('koa-passport')
  const fs = require('fs')

  var beerController = require('./controllers/beer');
  var userController = require('./controllers/user');

  router
    .post('/custom', function(ctx, next) {
      return passport.authenticate('local', function(err, user, info, status) {
        if (user === false) {
          ctx.body = {
            success: false
          }
          ctx.throw(401)
        } else {
          ctx.body = {
            success: true
          }
          return ctx.login(user)
        }
      })(ctx, next)
    })
    .get('/', function(ctx) {
      ctx.type = 'html'
      ctx.body = fs.createReadStream('views/login.html')
    })
    .post('/login',
      passport.authenticate('local', {
        successRedirect: '/beers',
        failureRedirect: '/'
      })
    )
    .get('/logout', function(ctx) {
      ctx.logout()
      ctx.redirect('/')
    })
    .get('/beers', beerController.getBeers)
    .post('/beers', beerController.postBeers)
    .get('/beers/:beer_id', beerController.getBeer)
    .put('/beers/:beer_id', beerController.putBeer)
    .delete('/beers/:beer_id', beerController.deleteBeer)
    .post('/users', userController.postUsers)
    .get('/users', userController.getUsers);
};
