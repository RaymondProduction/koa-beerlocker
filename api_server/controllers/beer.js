// Load required packages
var Beer = require('../models/beer');

// Create endpoint /api/beers for POSTS
exports.postBeers = function(ctx, next) {
  // Create a new instance of the Beer model
  var beer = new Beer();

  // Set the beer properties that came from the POST data

  beer.name = ctx.request.body.name;
  beer.type = ctx.request.body.type;
  beer.quantity = ctx.request.body.quantity;

  // Save the beer and check for errors
  return beer.save(function(err) {
    if (err)
      res.send(err);
    ctx.body = {
      message: 'Beer added to the locker!',
      data: beer
    };
    return next();
  });
};

// Create endpoint /api/beers for GET
exports.getBeers = function(ctx, next) {
  // Use the Beer model to find all beer
  return Beer.find(function(err, beers) {
    // if (err)
    //res.send(err);

    debugger;

    ctx.body = beers;
    return next();
  });
};


// Create endpoint /api/beers/:beer_id for GET
exports.getBeer = function(ctx, next) {
  // Use the Beer model to find a specific beer
  return Beer.findById(ctx.params.beer_id, function(err, beer) {
    if (err) {
      //res.send(err);
    }
    ctx.body = beer;
    return next();
  });
};

// Create endpoint /api/beers/:beer_id for PUT
exports.putBeer = function(ctx, next) {

  // Use the Beer model to find a specific beer
  return Beer.findById(ctx.params.beer_id, function(err, beer) {
    if (err)
      res.send(err);

    // Update the existing beer quantity
    beer.quantity = ctx.request.body.quantity;
    // Save the beer and check for errors
    return beer.save(function(err) {
    //  if (err)
    //    res.send(err);
      ctx.body = beer;

      return next();
    });

  });

};

// Create endpoint /api/beers/:beer_id for DELETE
exports.deleteBeer = function(ctx, next) {
  // Use the Beer model to find a specific beer and remove it
  return Beer.findByIdAndRemove(ctx.params.beer_id, function(err) {
    if (err)
      res.send(err);

    ctx.body = {
      message: 'Beer removed from the locker!'
    };
    return next();
  });
};
