const { Schema, model} = require('mongoose')

const leadShema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: String,
  tel: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ['to_do', 'in_progress', 'done'],
    default: 'to_do'
  }
});

module.exports = model('Lead', leadShema);
