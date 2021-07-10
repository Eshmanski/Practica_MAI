const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  isActivated: {
    type: Boolean,
    default: false
  },
  email: {
    type: String,
    required: true,
  },
  name: String,
  password: {
    type: String,
    required: true,
  },
});

module.exports = model('User', userSchema);
