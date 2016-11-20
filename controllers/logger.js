const colors = require('colors');

const types = {
  error: 1,
  debug: 2,
  log: 3
}

exports.types = types;

exports.log = (msg, type) => {
  switch (type){
    case types.error:
      console.log(msg.red)
      break;
    case types.debug:
      console.log(msg.yellow);
      break;
    case types.log:
      console.log(msg.green);
      break;
    default:
      console.log(msg);
      break;
  }
}

exports.requests = (req, res, next) => {
  console.log(`${req.method}`.green + `: '${req.originalUrl}' \t ${new Date().toString()}`);
  next();
}
