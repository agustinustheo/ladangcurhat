'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

const UserSchema = mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
})

// Have to use es5 syntax, otherwise won't work
UserSchema.pre('save', function(next) {
  const user = this
  bcrypt.hash(user.password, SALT_WORK_FACTOR, function(err, hash) {
    if(err) { return next(err) }
    user.password = hash
    next()
  })
})
// Have to use es5 syntax, otherwise won't work
UserSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if(err) { return err }
    callback(null, isMatch)
  })
}

const User = mongoose.model('User', UserSchema)
module.exports = User