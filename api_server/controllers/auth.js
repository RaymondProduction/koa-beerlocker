// Контроллер авторизации
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


// Извлечь юзера из БД по имени
// функция асинхронная, внутри создан промис
// который переходит в состояние "успешно завершено"
// если пользователь найден.
var fetchUserByName = async function(username) {
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
      return resolve(user);
    });
  });
  return await promise;
}

// Извлечь юзера по _id
var fetchUserById = async function(_id) {
  var promise = new Promise(function(resolve, reject) {
    User.findOne({
      _id: _id
    }, function(err, user) {

      if (err) {
        return reject(err);
      }
      // No user found with that _id
      // Пользователь с этим _id не найден
      if (!user) {
        return reject(null);
      }
      // Success
      return resolve(user);
    });
  });
  return await promise;
}


// Этот метод нужен чтобы passport получил
// идентификатор (ключ) для сессии
// Расширенное пояснение
// http://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
passport.serializeUser(function(user, done) {
    done(null, user._id)
  })
  // Этот метод нужен чтобы passport получил
  // объект "пользователь" для сессии по ключу
passport.deserializeUser(async function(_id, done) {
  try {
    var user = await fetchUserById(_id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

const LocalStrategy = require('passport-local').Strategy
passport.use(new LocalStrategy(function(username, password, done) {
  fetchUserByName(username)
    .then(user => {
      user.verifyPassword(password, function(err, isMatch) {
        if (err) {
          return done(null, false)
        }
        //Password did not match
        // Пароль не совпадает
        if (!isMatch) {
          return done(null, false);
        }
        // Success
        return done(null, user);
      });
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

// Для того чтоб взять из URL параметр в виде
// http://127.0.0.1:3000?code=100 используем query
// отправка кода с помощью koa-ejs
exports.getCode = async function(ctx) {
  // await ctx.render('gettoken', {
  //   title: 'GET TOKEN',
  //   client_id: 1,
  //   user_id: 1,
  //   code: 100,
  //   redirect_uri: 'http://127.0.0.1:4000/',
  // });
  console.log(ctx.query.code);
  var request = require('request');
  request.post({
      url: 'http://127.0.0.1:3000/token',
      form: {
        title: 'GET TOKEN',
        client_id: 1,
        user_id: 1,
        code: 100,
        redirect_uri: 'http://127.0.0.1:4000/',
      }
    },
    function(error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', body); // Print the HTML for the Google homepage.
    });

  //ctx.body = ctx.query.code;
}

exports.postLoginVerify = passport.authenticate('local', {
  successRedirect: '/beers',
  failureRedirect: '/'
})

// ???
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
