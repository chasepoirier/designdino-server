import express from "express";
import path from "path";
import logger from 'morgan'

import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import Promise from "bluebird";


// Routes
import auth from "./routes/auth";
import users from "./routes/users";
import profiles from './routes/profiles';

dotenv.config();
const app = express();


let cors = require('cors')
let corsOptions = {
  origin: process.env.HOST
}

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URL, { useMongoClient: true });

app.use(bodyParser.json());
app.use(logger('dev'));
app.use(bodyParser.json());

app.use(cors(corsOptions));

app.use('/auth', auth);
app.use('/users', users);
app.use('/profiles', profiles);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/', function(req, res, next) {
  res.send('Welcome to the designdino API');
});


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
  res.status(err.status || 500).json({err: err});
  console.log(err);
  res.send(err);
});

module.exports = app;
