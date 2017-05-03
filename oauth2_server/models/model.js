/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Schema definitions.
 */

mongoose.model('OAuthTokens', new Schema({
  accessToken: {
    type: String
  },
  accessTokenExpiresOn: {
    type: Date
  },
  clientId: {
    type: String
  },
  refreshToken: {
    type: String
  },
  refreshTokenExpiresOn: {
    type: Date
  },
  userId: {
    type: String
  }
}));

mongoose.model('OAuthClients', new Schema({
  clientId: {
    type: String
  },
  clientSecret: {
    type: String
  },
  redirectUris: {
    type: Array
  }
}));

mongoose.model('OAuthUsers', new Schema({
  email: {
    type: String,
    default: ''
  },
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  password: {
    type: String
  },
  username: {
    type: String
  }
}));

var OAuthTokensModel = mongoose.model('OAuthTokens');
var OAuthClientsModel = mongoose.model('OAuthClients');
var OAuthUsersModel = mongoose.model('OAuthUsers');

module.exports.OAuthClientsModel = function() {
  return OAuthClientsModel;
}

module.exports.OAuthTokensModel = function() {
  return OAuthTokensModel;
}

module.exports.OAuthUsersModel = function() {
  return OAuthUsersModel;
}


/**
 * Get access token.
 */

module.exports.getAccessToken = function*(bearerToken) {
  console.log('in getAccessToken (bearerToken: ' + bearerToken + ')');

  return yield OAuthTokensModel.findOne({
    accessToken: bearerToken
  });
};

/**
 * Get client.
 */

module.exports.getClient = function*(clientId, clientSecret) {
  console.log('in getClient (clientId: ' + clientId + ', clientSecret: ' + clientSecret + ')');

  return yield OAuthClientsModel.findOne({
    clientId: clientId,
    clientSecret: clientSecret
  });
};

/**
 * Get refresh token.
 */

module.exports.getRefreshToken = function*(refreshToken) {
  console.log('in getRefreshToken (refreshToken: ' + refreshToken + ')');

  return yield OAuthTokensModel.findOne({
    refreshToken: refreshToken
  });
};

/*
 * Get user.
 */

module.exports.getUser = function*(username, password) {
  console.log('in getUser (username: ' + username + ', password: ' + password + ')');

  return yield OAuthUsersModel.findOne({
    username: username,
    password: password
  });
};

/**
 * Save client.
 */

module.exports.saveClient = function(ctx, next) {
  console.log('in save Client (token)');

  var oauthClient = new OAuthClientsModel({
    clientId: ctx.request.body.clientId,
    clientSecret: ctx.request.body.clientSecret,
    redirectUris: [
      ctx.request.body.redirectUri,
      ctx.request.body.redirectUri2,
    ],
  });

  return oauthClient.save(function(err) {
    //if (err)
    //res.send(err);
    ctx.body = {
      message: 'Added new clinet in the base!'
    };
    return next();
  });
};

/**
 * Save token.
 */

module.exports.saveToken = function*(token, client, user) {
  console.log('in saveToken (token: ' + token + ')');

  var accessToken = new OAuthTokensModel({
    accessToken: token.accessToken,
    accessTokenExpiresOn: token.accessTokenExpiresOn,
    clientId: client.id,
    refreshToken: token.refreshToken,
    refreshTokenExpiresOn: token.refreshTokenExpiresOn,
    userId: user.id
  });

  return yield accessToken.save();
};
