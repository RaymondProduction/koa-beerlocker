// Load required packages
var User = require('../models/user');
// Create endpoint /api/client for POST
exports.postUser = function(ctx, next) {
  // Create a new instance of the Client model
  var user = new User({
    username: ctx.request.body.username,
    password: ctx.request.body.password,
    id : ctx.request.body.id,
  });



  return user.save(function(err) {
    //if (err)
    //res.send(err);
    ctx.body = {
      message: 'Added new user in the base!'
    };
    return next();
  });
};
