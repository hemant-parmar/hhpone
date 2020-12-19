const mongoose = require('mongoose');

const bmNoticeSchema = mongoose.Schema({
  userId: {type: String, required: true},
  userName: {type: String, required: true},
  clientId: {type: String, required: true},
  compName: {type: String, required: true},
  bmSrNo: {type: String, required: true},
  bmDate: {type: Date, required: true},
  bmTime: {type: String, required: true},
  bmShortNotice: Boolean,
  bmAddr: {type: String, required: true},
  compLawMatters: [{topic: String}],
  financeMatters: [{topic: String}],
  regulatoryMatters: [{topic: String}],
  businessMatters: [{topic: String}],
  signPlace: {type: String, required: true},
  signDate: Date,
  invitees:  [{
    id: {type: String, required: true},
  }]

});

module.exports = mongoose.model('bmNotice', bmNoticeSchema);
