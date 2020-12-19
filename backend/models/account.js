const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
  userName: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  verificationToken: String,
  verified: Date,
  resetToken: {
    token: String,
    expires: Date
  },
  passwordReset: Date,
  created: { type: Date, default: Date.now },
  updated: Date,
  isPrimary: Boolean
})

accountSchema.virtual('isVerified').get(() => {
  return !!(this.verified || this.passwordReset);
});

accountSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.passwordHash;
  }
});

module.exports = mongoose.model('Account', accountSchema)
