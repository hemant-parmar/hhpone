const mongoose = require('mongoose');

const refreshTokenSchema = mongoose.Schema ({
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
  token: String,
  expires: Date,
  created: { type: Date, default: Date.now },
  createdByIp: String,
  revoked: Date,
  revokedByIp: String,
  replacedByToken: String
});

refreshTokenSchema.virtual('isExpired').get(() => {
  return Date.now >= this.expires;
});

refreshTokenSchema.virtual('isActive').get(() => {
  return !this.revoked && !this.isExpired;
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema)
