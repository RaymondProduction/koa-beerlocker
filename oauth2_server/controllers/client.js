// Load required packages
var Client = require('../models/client');

// Create endpoint /api/client for POST
exports.postClients = function(ctx, next) {
  // Create a new instance of the Client model
  var client = new Client();
  // Set the client properties that came from the POST data
  client.name = ctx.request.body.name;
  client.id = ctx.request.body.id;
  client.secret = ctx.request.body.secret;
 // client.userId = ctx.request.user._id;
  client.userId = ctx.request.user.idd;
  return client.save(function(err) {
    //if (err)
    //res.send(err);
    ctx.body = {
      message: 'New beer drinker added to the locker room!'
    };
    return next();
  });
};

// Create endpoint /api/clients for GET
exports.getClients = function(ctx, res) {
  // Use the Client model to find all clients
  return Client.find({ userId: ctx.request.user._id }, function(err, clients) {
    // if (err)
    //   res.send(err);

    ctx.body = clients;
    return next();
  });
};
