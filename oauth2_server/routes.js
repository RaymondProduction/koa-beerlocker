module.exports = function(router) {

  // authentication
  const authController = require('./controllers/auth')
//  const passport = require('koa-passport')

var clientController = require('./controllers/client');

  router
    .post('/clients', clientController.postClients)
    .get('/clients', clientController.getClients)
    .post('/custom', authController.postCustom)
    .get('/', authController.getMain)
    .post('/login', authController.postLoginVerify)
    .get('/logout', authController.getLogout);
};
