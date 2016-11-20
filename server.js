const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//controllers
const controllers = require('./controllers');
const dbConnector = controllers.dbConnector;
//consts
const PORT = 3000;

app.use(logger.requests); // log all incoming requests
app.user( (req, res, next) => {
    req.logger = logger;
    next();
});
// add the db object to every request object
app.use((req, res, next) => {
  req.db = app.get('db');
  next();
})

app.use((req, res, next) => {
  console.log(`${req.method} : ${req.ip} : ${req.originalUrl}`);
  next();
})

// enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/users/list', controllers.users.getUsers);   // get all the users
app.get('/users/find/:id', controllers.users.getUser); //find a user by uuid
app.get('/users/create/', controllers.users.createUser); // create a new user and return the user object
app.post('/users/update/:id', jsonParser, controllers.users.updateUser); //update users data

//connect to DB
dbConnector.connect((err,db) => {
  //if DB is connected, init the server
  if (!err) {
    app.set('db', db); // set global
    app.listen(PORT, () =>{
      console.log(`listening on port ${PORT}`);
    })
  }
})
