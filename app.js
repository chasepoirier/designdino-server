

import express from "express";
import path from "path";
import logger from 'morgan'

import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import Promise from "bluebird";

import index from './routes/index';
import auth from "./routes/auth";
import users from "./routes/users";

dotenv.config();
const app = express();


let cors = require('cors')
let corsOptions = {
  origin: process.env.HOST
}

// mongoose.Promise = Promise;
// mongoose.connect('mongodb://localhost/designdino', { useMongoClient: true });

app.use(bodyParser.json());
app.use(logger('dev'));
app.use(bodyParser.json());


app.use(cors(corsOptions));

app.use('/api', index);
app.use('/api/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
