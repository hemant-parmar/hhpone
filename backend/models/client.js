const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
  compName: String,
  addr1: String,
  addr2: String,
  city: String,
  state: String,
  pincode: String,
  phone1: String,
  phone2: String,
  corpOffice: {
    locationName: String,
    addr1: String,
    addr2: String,
    city: String,
    state: String,
    pincode: String,
    phone1: String,
    phone2: String
  },
  compCat: String,
  compSubcat: String,
  compClass: String,
  dateInc: Date,
  email: String,
  website: String,
  PAN: String,
  GSTN: String,
  CIN: String,
  LLPIN: String,
  ROC: String,
  regNo: String,
  TAN: String,
  contacts: [{
    title: String,
    fName: String,
    lName: String,
    desig: String,
    email: String,
    mobile1: String,
    mobile2: String
  }],
  directors: [{
    title: String,
    fName: String,
    lName: String,
    desig: String,
    email: String,
    mobile1: String,
    mobile2: String,
    addr1: String,
    addr2: String,
    city: String,
    state: String,
    pincode: String,
    dateAppointed: Date,
    din: String,
    dpin: String,
    pan: String,
    isDscReg: Boolean,
    dscExpiryDate: Date,
    endDate: Date,
  }]
});

module.exports = mongoose.model('Client', clientSchema);