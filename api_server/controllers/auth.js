// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');
var Client = require('../models/client');
var BearerStrategy = require('passport-http-bearer').Strategy;
var Token = require('../models/token');
var DigestStrategy = require('passport-http').DigestStrategy;
var LocalStrategy = require('passport-local').Strategy;

passport.use(new BearerStrategy(
  function(accessToken, callback) {
    Token.findOne({
      value: accessToken,
    }, function(err, token) {
      if (err) {
        return callback(err);
      }

      // No token found
      if (!token) {
        return callback(null, false);
      }

      User.findOne({
        _id: token.userId,
      }, function(err, user) {
        if (err) {
          return callback(err);
        }

        // No user found
        if (!user) {
          return callback(null, false);
        }

        // Simple example with no scope
        callback(null, user, {
          scope: '*',
        });
      });
    });
  }
));

passport.use(new LocalStrategy(
  function(username, password, callback) {
    User.findOne({
      username: username,
    }, function(err, user) {
      if (err) {
        return callback(err);
      }

      // No user found with that username
      if (!user) {
        return callback(null, false);
      }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) {
          return callback(err);
        }

        // Password did not match
        if (!isMatch) {
          return callback(null, false);
        }

        // Success
        return callback(null, user);
      });
    });
  }
));


passport.use(new DigestStrategy({
    qop: 'auth',
  },
  function(username, callback) {
    User.findOne({
      username: username,
    }, function(err, user) {
      if (err) {
        return callback(err);
      }

      // No user found with that username
      if (!user) {
        return callback(null, false);
      }

      // Success
      return callback(null, user, user.password);
    });
  },
  function(params, callback) {
    // validate nonces as necessary
    callback(null, true);
  }
));

passport.use(new BasicStrategy(
  function(username, password, callback) {
    User.findOne({
      username: username,
    }, function(err, user) {
      if (err) {
        return callback(err);
      }

      // No user found with that username
      if (!user) {
        return callback(null, false);
      }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) {
          return callback(err);
        }

        // Password did not match
        if (!isMatch) {
          return callback(null, false);
        }

        // Success
        return callback(null, user);
      });
    });
  }
));

passport.use('client-basic', new BasicStrategy(
  function(username, password, callback) {
    Client.findOne({
      id: username,
    }, function(err, client) {
      if (err) {
        return callback(err);
      }

      // No client found with that id or bad password
      if (!client || client.secret !== password) {
        return callback(null, false);
      }

      // Success
      return callback(null, client);
    });
  }
));

// exports.isAuthenticated = passport.authenticate('basic', { session : false });

exports.isClientAuthenticated = passport.authenticate('client-basic', {
  session: false,
});

exports.isBearerAuthenticated = passport.authenticate('bearer', {
  session: false,
});

exports.isAuthenticated = passport.authenticate(['local', 'bearer'], {
  session: false,
});
