const signale = require('signale')
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/config.js');
const expressValidator = require('express-validator');
const session = require('express-session');
// const express=require('express');
const app=express();
app.use(express.json({
  type: ['application/json', 'text/plain']
}))

//importing router
const userRouter = require('./app/routes/user-router.js');

//initialising express
// const app = express();

//database Connection
mongoose.connect(config.mongodb.dbURI)
  .then(() => {
    signale.success('*****Database Connection Successfull******');
  }).catch(err => {
    signale.fatal(new Error(err));
    signale.warn('Could not connect to Database. Exiting now...');
    process.exit();
  })
let db = mongoose.connection

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// console.log(path);
app.use(express.static(path.resolve(config.dir.ADMIN_BASE_DIR,'public')));


//middlewares for expressValidator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));
// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  secret: config.session.secretString,
  resave: true,
  saveUninitialized: false
}))

//sessionChecker middlewares
let sessionChecker = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/user/login')
  } else {
    next()
  }
}

//global vari for all routes
app.get('*', (req, res, next) => {
  res.locals.user = req.session.user || null
  next()
})

//Home Route
app.get('/', (req, res) => {
  res.render('home');
})


app.get('/logout', sessionChecker, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return next(err)
    }
    return res.redirect('/')
  })
})

app.use('/user', userRouter);

app.get('*', (req, res) => {
  res.send('ERROR 404. PAGE NOT FOUND')
})

app.listen(3000, () => {
  signale.success('Server Started on port: 3000');
})