const mongoose = require('mongoose');

const personSchema = mongoose.Schema({
  title: String,
  fName: String,
  lName: String,
  desig: String,
  email: String,
  mobile1: String,
  mobile2: String
});

module.exports = mongoose.model('Person', personSchema)
