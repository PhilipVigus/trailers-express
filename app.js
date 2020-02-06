'use strict';
require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require("./routes/index");
const trailersToWatchRouter = require("./routes/trailersToWatch");
const shortlistRouter = require("./routes/shortlist");

const app = express();

console.log(process.env.DB_PATH);
mongoose.connect(process.env.DB_PATH, { useNewUrlParser: true });
const dbConnection = mongoose.connection;

// bind to the error event, so that errors get printed to console
dbConnection.on("error", console.error.bind(console, 'MongoDB connection error:'));

setupViewEngine();
setupMiddleware();

function setupViewEngine() {
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');
}

function setupMiddleware() {
  
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  setupRoutes();
  setupErrorHandler();

  function setupRoutes() {
    app.use('/', indexRouter);
    app.use('/trailers-to-watch', trailersToWatchRouter);
    app.use('/shortlist', shortlistRouter);
  }
  
  function setupErrorHandler() {
    
    // catch 404 errors and forward to error handler
    app.use(function(req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function(err, req, res, next) {
      res.locals.message = err.message;

      // ensures error details are only set if we're in the development environment
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      res.status(err.status || 500);
      res.render('error');
    });
  }
}


module.exports = app;
