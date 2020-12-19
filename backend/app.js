const path = require("path")
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const accountRoutes = require('./routes/account');
const clientsRoutes = require('./routes/clients');
const employeesRoutes = require('./routes/employees');
const errorHandler = require('./middleware/error-handler');

const app = express();   //creating an express app
// express app is a chain of middlewares
// each middleware can be used by using methods like app.use(), app.get(), app.post(), etc

// a middleware in its simplest form can be defined as follows, which takes a function as arg
// this function takes three args- request, response and next
// if you add next() to the function body, the request is passed on to the
// .. next middleware in line (code parses from top down)
// If not, then the code execution ends within that middleware
//   ...where ideally a response to that request should be sent
// Sending a response within a middleware also ends the request in that middleware
// If you do not call next() in a middleware and also not send a response then
//  ..the server will keep trying to find a response and then timeout after sometime

mongoose.connect('mongodb+srv://' + process.env.MONGO_ATLAS_SUBSTRING + '@cluster0.o5eao.mongodb.net/hhpONE?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to database.');
  })
  .catch(() => {
    console.log('Database connection failed.');
  });

app.use(bodyParser.json());
// adding body-parser middleware for all requests (no path is added to the app.use)

app.use(bodyParser.urlencoded({extended: false}));
// this is useful only if you have urlencoded data - i.e parsing Url for query params

app.use(cookieParser());

// use the below code when deploying integrated node-angular app. You will need to import "path"
app.use("/", express.static(path.join(__dirname, "angular")));


// adding middleware to allow CORS, by setting Headers in the response
// THIS IS NOT REQUIRED IF you are deploying integrated Node-Angular app
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Allowing requests from all origins, i.e. '*'

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-client-key, x-client-token, x-client-secret');
  // setting the Headers that can be added in request. Mentioned in the comma separated list
  // more headers can be added or removed as reqd

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  // setting the http request methods that will be allowed

  next();
  // adding next() for the request to carry on to the next middleware below
});

app.use('/api/auth', accountRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/employees', employeesRoutes);

// use the below code when deploying integrated node-angular app
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});

// global error handler
app.use(errorHandler);

module.exports = app;
