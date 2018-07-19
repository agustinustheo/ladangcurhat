const User = require('../db/models/User')
const jwt = require('jsonwebtoken')
// Temporary secret key TODO: Use process.env to store secret key
const secretKey = require('./tempSecretKey');


module.exports = function(req, res) {
  const { username, password } = req.body;
  if(!username || !password) {
    return res.status(422).send({ error: 'You must provide username and password' })
  }
  User.findOne({ username: username }, (err, existingUser) => {
    if(err) {
      return res.status(422).send({ 
        error: err,
      })
    }

    if(existingUser) {
      return res.status(409).send({
        error: 'username is in use'
      })
    }

    const user = new User({
      username: username,
      password: password,
    })

    user.save((err, savedUser) => {
      if(err) {
        return res.status(500).send({
          error: err,
        })
      } else {
        jwt.sign({ user }, secretKey, (err, token) => {
          const result = err ? err : token
          res.status(201).send({
            _id: savedUser._id,
            username: savedUser.username,
            token,
          })
        })
      }
    })
  })
}