// Load required packages
var User = require('../models/user');

// Create endpoint /api/users for POST
exports.postUsers = function(ctx, next) {
    console.log('=>',ctx.request.body.username);
  var user = new User({
    username: ctx.request.body.username,
    password: ctx.request.body.password,
    id : ctx.request.body.id,
  });

  return user.save(function(err) {
      //if (err)
        //res.send(err);
      ctx.body = {
        message: 'New beer drinker added to the locker room!'
      };
      return next();
  });
};

// Create endpoint /api/users for GET
exports.getUsers = function(ctx, next) {
  return User.find(function(err, users) {
    //if (err)
    //  res.send(err);
    ctx.body = users;
    return next();
  });
};
