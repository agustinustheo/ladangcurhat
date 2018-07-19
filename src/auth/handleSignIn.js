const User = require('../db/models/User');
const jwt = require('jsonwebtoken')
// Temporary secret key TODO: Use process.env to store secret key
const secretKey = require('./tempSecretKey');

module.exports = function(req, res) {
  const { username, password } = req.body;
  if(!username || !password) {
    return res.status(422).send({ error: 'You must provide username and password' })
  }

  User.findOne({ username: username }, function(err, user){
    if(err) { res.status(500).send({ err }) }
    else if(!user){ res.status(404).send({ err }) }
    //compare passwords
    else { 
      user.comparePassword(password, function(err, isMatch){
        if(err) { res.status(500).send({ err }) }
        if(!isMatch){ res.status(401).send({ err }) }
        //if Passwords match, send username, id, and token
        jwt.sign({ user }, secretKey, (err, token) => {
          const result = err ? err : token
          res.status(200).send({
            _id: user._id,
            username: user.username,
            token,
          });
        });
      });
    }
  });
}
