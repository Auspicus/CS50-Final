var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var fibonacci = require('bindings')('fibonacci');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'web')));

app.post('/execute', (req, res) => {
  try {
    fibonacci((time) => {
      res.json({
        result: time,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.toString()
    });
    return;
  }
});

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
  var statusCode = err.status || 500;
  res.status(statusCode);
  res.send(statusCode + ' error');
});

module.exports = app;
