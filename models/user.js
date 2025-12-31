const mongooes = require("mongoose")
const Schema = mongooes.Schema;
const passportLocal = require("passport-local-mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
});

userSchema.plugin(passportLocal, {
  usernameField: 'email',

});
module.exports = mongooes.model('User', userSchema);
