const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//controllers
const controllers = require('./controllers');
const dbConnector = controllers.dbConnector;
//consts
const PORT = 3000;

// add the db object to every request object
app.use((req, res, next) => {
  req.db = app.get('db');
  next();
})

app.get('/users/list', controllers.users.getUsers);   // get all the users
app.get('/users/find/:id', controllers.users.getUser); //find a user by uuid
app.get('/users/create/', controllers.users.createUser); // create a new user and return the user object
app.post('/users/update/:id', jsonParser, controllers.users.updateUser); //update a users data

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
