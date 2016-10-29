const monk = require('monk');

const HOSTNAME = '127.0.0.1';
const PORT = '27017';
const CONN_STR = `mongodb://${HOSTNAME}:${PORT}/tabsstate`;
const COLL_NAME = 'users';

exports.connect = (next) => {
  const db = monk(CONN_STR);
  db.then(() => {
    console.log('connected to mongo server');
    next(null, db);
  })
  .catch((err) => {
    console.log(`error connecting to mongo server ${err}`);
    next(err);
  })
}

exports.getUserList = (db, next) => {
  const collection = db.get(COLL_NAME);
  collection.find({})
    .then((users) => {
      next(null, users)
    })
    .catch((err) => {
      console.log(err);
      next(err);
    })
}

exports.getUser = (db, id, next) => {
  const collection = db.get(COLL_NAME);
  collection.find({uuid: id})
    .then((user) => {
      next(null, user)
    })
    .catch((err) => {
      console.log(err);
      next(err);
    })
}

exports.createUser = (db, _user, next) => {
  const collection = db.get(COLL_NAME);
  collection.insert(_user)
    .then((user) => {
      next(null, user);
    })
    .catch((err) => {
      console.log('error creating user');
      next(err);
    })
}
