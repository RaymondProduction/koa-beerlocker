const passport = require('koa-passport')
var fs = require('fs')

var fetchUser = (() => {
  var user = {
    id: 1,
    username: 'test',
    password: 'test'
  }
  return async function() {
    return user
  }
})()

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
  fetchUser()
    .then(user => {
      if (username === user.username && password === user.password) {
        done(null, user)
      } else {
        done(null, false)
      }
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
