const http = require("http");  //http is part of node package
const debug = require("debug")("node-angular");  //debug is part of node package

const app = require("./app");  //importing express app created in app.js

// this function ensures that the port number recd from environment variable is a valid number
const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

// this error function manages if any error ocurred and exits gracefully fm node.js server
const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// this function notifies if all is okay and server is listening
const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");
// using the hosted node.js server port, i.e. process.env.PORT - while in production environment
//  OR if that is not set, then use localhost port 3000

app.set("port", port);  //setting the port for express app

const server = http.createServer(app); //creating server using express app
server.on("error", onError);        //If an error occurs on creating the server onError fn will execute
server.on("listening", onListening); //If server is created onListening fn will execute
server.listen(port);  //server is now running and listening for requests
