// Load required packages
model = require('../models/model');
var Client = model.OAuthClientsModel();

// Create endpoint /api/client for POST
exports.postClient = function(ctx, next) {
  return model.saveClient(ctx, next);
};

// Create endpoint /api/clients for GET
exports.getClients = function(ctx, res) {
  // Use the Client model to find all clients
  return Client.find({
    userId: ctx.request.user._id
  }, function(err, clients) {
    // if (err)
    //   res.send(err);

    ctx.body = clients;
    return next();
  });
};

exports.getClient = function(ctx) {
  var fs = require('fs');
  ctx.type = 'html'
  ctx.body = fs.createReadStream('views/client.html');
};
