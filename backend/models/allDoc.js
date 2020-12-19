const mongoose = require('mongoose');

const allDocSchema = mongoose.Schema({
  docId: {type: String, required: true},
  docName: {type: String, required: true},
  docParam: {type: String, required: true},
  docDate: {type: Date, required: true},
  userId: {type: String, required: true},
  userName: {type: String, required: true},
  clientId: {type: String, required: true},
  compName: {type: String, required: true},
});

module.exports = mongoose.model('allDoc', allDocSchema);
