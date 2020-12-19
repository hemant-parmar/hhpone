const mongoose = require('mongoose');

const compLocationSchema = mongoose.Schema({
  locationName: String,
  addr1: String,
  addr2: String,
  city: String,
  state: String,
  pincode: String,
  phone1: String,
  phone2: String
});

module.exports = mongoose.model('CompLocation', compLocationSchema);
