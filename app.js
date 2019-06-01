const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const testRouter = require('./routes/test');
const signupRouter = require('./routes/sign_up');
const signinRouter = require('./routes/sign_in');
const mainRouter = require('./routes/main');
const payRouter = require('./routes/pay');

let redisClient = redis.createClient(6379, '127.0.0.1');
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: "clearlove7",
  resave: true,
  saveUninitialized:true,
  store:new redisStore({client:redisClient})
  //cookie:{secret:true}//这里设为true时，是https协议使用的
  //注意在实验时这里的secret要设为false，因为本地用的是http协议
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/test', testRouter);
app.use('/signup', signupRouter);
app.use('/signin', signinRouter);
app.use('/main', mainRouter);
app.use('/pay', payRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
