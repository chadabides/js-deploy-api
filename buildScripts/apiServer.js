/* eslint-disable no-unused-vars */
import 'babel-polyfill';
import express from 'express';
import path from 'path';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import mongoose from 'mongoose';
//import other libs
import moviesRoute from '../src/server/routes/movie';
import {default as log} from '../src/server/core/logger';
//Add logger info
let logger = new log();
// sets config options on winston
logger.cfg({consoleLevel: 'debug',fileLevel: 'error'});
// Import Database Connection here
import {default as Database} from  "../src/server/data/db";



const app = express();
app.use('/favicon.ico', express.static('./src/server/public/favicon.ico'));
app.use(compression());
app.use(cors());


process.env.NODE_ENV = 'production';

/** Database Connections go Here */
Database.connect().then(() => {
logger.log("Database is connected")
}).
catch((error)=>{
  logger.log(error, 'error')
});


app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

app.use(methodOverride())

app.use(logger.dev);

/** Mount Api's Here */
app.use('/admin', (req, res) => {
  res.send('Api Server is loaded for admin');
});
 /** Mount Routes Here */

//mount movie store module here
app.use('/movies', moviesRoute);

// production error handler will log errors
app.use(function (err, req, res, next) {
  logger.log(err ,'error');
});
let port = (process.env.PORT || 5000);
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(port, function(err) {
  logger.log(`api started on port ${port}` ,'info');
  if (err) {
    logger.log(err);
  }
});
