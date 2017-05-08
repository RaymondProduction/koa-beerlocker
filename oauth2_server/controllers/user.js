// Load required packages
var User = require('../models/user');
// Create endpoint /api/client for POST
exports.postUser = function(ctx, next) {
  // Create a new instance of the Client model
  var user = new User({
    username: ctx.request.body.username,
    password: ctx.request.body.password,
    email : ctx.request.body.email,
    firstname : ctx.request.body.firstname,
    lastname : ctx.request.body.lastname,
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

exports.getUser = function(ctx) {
  var fs = require('fs');
  ctx.type = 'html'
  ctx.body = fs.createReadStream('views/user.html');
};
