const passport = require('koa-passport');
var User = require('../models/user');
var fs = require('fs');

// var fetchUser = (() => {
//   var user = {
//     id: 1,
//     username: 'test',
//     password: 'test'
//   }
//   return async function() {
//     return user
//   }
// })()


var fetchUser = async function(username) {
  var promise = new Promise(function(resolve, reject) {
    User.findOne({
      username: username
    }, function(err, user) {

      if (err) {
        return reject(err);
      }
      // No user found with that username
      if (!user) {
        return reject(null);
      }
      // Success
      console.log('!!!=>', user.username, ' ', user.password);
      console.log('!!!=>', username);
      return resolve(user);
    });
  });
  console.log('Yes!!');
  return await promise;
}



passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(async function(id, done) {
  try {
    var user = await fetchUser()
    done(null, user)
  } catch (err) {
    done(err)
  }
})

const LocalStrategy = require('passport-local').Strategy
passport.use(new LocalStrategy(function(username, password, done) {
  fetchUser(username)
    .then(user => {
      user.verifyPassword(password, function(err, isMatch) {
        if (err) {
          return done(null, false)
        }

        //Password did not match
        if (!isMatch) {
          return done(null, false);
        }

        // Success
        return done(null, user);
      });
      console.log('2=>', user.username, ' ', user.password);
      // if (username === user.username && password === user.password) {
      //   done(null, user)
      // } else {
      //   done(null, false)
      // }
    })
    .catch(err => done(err))
}))

exports.getLogout = function(ctx) {
  ctx.logout();
  ctx.redirect('/');
}

exports.getMain = function(ctx) {
  ctx.type = 'html'
  ctx.body = fs.createReadStream('views/login.html')
}

// ???
exports.postLoginVerify = passport.authenticate('local', {
  successRedirect: '/beers',
  failureRedirect: '/'
})

exports.postCustom = function(ctx, next) {
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
}
