const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema({
  title: String,
  fName: String,
  lName: String,
  desig: String,
  coEmail: String,
  personalEmail: String,
  mobile1: String,
  mobile2: String,
  leftCompany: Boolean,

  gender: String,
  band: String,
  qualifications: String,
  pan: String,
  dob: Date,
  dateOfJoining: Date,
  dateOfLeaving: Date,
  experienceStartDate: Date,
  ctc: Number,

  addr1: String,
  addr2: String,
  city: String,
  state: String,
  pincode: String,
  contactPersonName: String,
  contactPersonMobile: String,

  userName: String,

});

module.exports = mongoose.model('Employee', employeeSchema)
