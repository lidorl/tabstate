const dbConnector = require('./mongodb-connector.js');
const uuid = require('uuid');

//get a list of all the users
exports.getUsers = (req, res, next) => {
  dbConnector.getUserList(req.db , (err, users) => {
    (!err)
      res.send(users);
  });
}

// get a specific user
exports.getUser = (req, res, next) => {
  if (req.params.id){
    dbConnector.getUser(req.db, req.params.id, (err, user) => {
      if (!err)
        res.send(user);
    })
  }
};

// create a new user and get the user object
exports.createUser = (req, res, next) => {
  const user_uuid = uuid.v4(); //generate random uuid
  const user_obj = {
    uuid: user_uuid,
    data: {},
    createdOn: new Date()
  }
  dbConnector.createUser(req.db, user_obj, (err, user) => {
    if (!err)
      res.send(user);
    else {
      console.log(err);
      res.send(`{ err: ${err}}`);
    }
  })
}

// update a users data object
exports.updateUser = (req, res, next) => {
  const id = req.params.id;
  const data = req.body.data;
  console.log(`uuid: ${id}, data: ${data}`);
  // dbConnector.updateUser(req.db, { uuid: id, data: data}, (err,user) => {
  //   if (!err)
  //     res.send('OK');
  //   else {
  //     console.log('error updating user: ' + err);
  //     res.send(`{ err: ${err} }`);
  //   }
  // })
};
