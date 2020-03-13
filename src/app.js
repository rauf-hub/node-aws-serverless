const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const error = require('./middleware/error');

const app = express();

const routes = require('./routes');
const models = require('./models');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());

models.sequelize
  .sync()
  .then(() => {
    console.log('Database working');
  })
  .catch(err => {
    console.log(err, 'Something went wrong with the Database Update!');
  });

// API calls
app.use('/', routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
