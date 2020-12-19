const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const Account = require('../models/account');
const RefreshToken = require('../models/refresh-token');
const sendEmail = require('../helpers/send-email');

module.exports = {
  authenticate, refreshToken, revokeToken, register, verifyEmail, forgotPassword,
  validateResetToken, resetPassword, getAll, getById, create, update, _delete
}

async function authenticate ({userName, password, ipAddress}) {
  const account = await Account.findOne( { userName: userName });

  if(!account || !account.isVerified || !bcrypt.compareSync(password, account.passwordHash)) {
    throw 'Email or Password is incorrect';
  }

  // authentication successful so generate jwt and refresh tokens
  const jwtToken = generateJwtToken(account);
  const refreshToken = generateRefreshToken(account, ipAddress);

  // save refresh token
  await refreshToken.save();

  // return basic details and tokens
  return {
    ...basicDetails(account),
    jwtToken,
    refreshToken: refreshToken.token
  };
}

async function refreshToken({token, ipAddress}) {
  const refreshToken = await getRefreshToken(token);
  const { account } = refreshToken;

  // replace old refresh token with a new one and save
  const newRefreshToken = generateRefreshToken(account, ipAddress);
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  refreshToken.replacedByToken = newRefreshToken.token;
  await refreshToken.save();
  await newRefreshToken.save();

  // generate new jwt
  const jwtToken = generateJwtToken(account);

  // return basic details and tokens
  return {
    ...basicDetails(account),
    jwtToken,
    refreshToken: newRefreshToken.token
  };
}

async function revokeToken({token, ipAddress}) {
  const refreshToken = await getRefreshToken(token);

  // revoke token and save
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  await refreshToken.save();
}

async function register(params, origin) {
  // validate
  if(await Account.findOne({userName: params.userName})) {
    // send already registered error in email to prevent account enumeration
    return await sendAlreadyRegisteredEmail(params.email, origin);
  }

  // create account object
  const account = new Account(params);

  // first registered account is an admin
  // const isFirstAccount = (await db.Account.countDocuments({})) === 0;
  // account.role = isFirstAccount ? Role.Admin : Role.User;
  account.verificationToken = randomTokenString();

  // hash password
  account.passwordHash = hash(params.password);

  account.isPrimary = false;

  // save account
  await account.save();

  // send email
  await sendVerificationEmail(account, origin);
}

async function verifyEmail({token}) {
  const account = await Account.findOne({verificationToken: token});

  if(!account) throw 'Verification failed'

  account.verified = Date.now();
  account.verificationToken = undefined;
  await account.save();
}

async function forgotPassword({userName}, origin) {
  const account = await Account.findOne({ userName });

  // always return ok response to prevent email enumeration
  if(!account) return;

  // create reset token that expires after 24 hours
  account.resetToken = {
    token: randomTokenString(),
    expires: new Date(Date.now() + 24*60*60*1000)
  };
  await account.save();

  // send email
  await sendPasswordResetEmail(account, origin);
}

async function validateResetToken({token}) {
  const account = await Account.findOne({
    'resetToken.token': token,
    'resetToken.expires': { $gt: Date.now() }
  });

  if(!account) throw 'Invalid Token';
}

async function resetPassword({token, password}) {
  const account = await Account.findOne({
    'resetToken.token': token,
    'resetToken.expires': { $gt: Date.now() }
  });
  if(!account) throw 'Invalid Token';

  // update password and remove reset token
  account.passwordHash = hash(password);
  account.passwordReset = Date.now();
  account.resetToken = undefined;
  await account.save();
}

async function getAll() {
  const accounts = Account.find();
  return accounts.map(x => basicDetails(x));
}

async function getById(id) {
  const account = await getAccount(id);
  return basicDetails(account);
}

async function create(params) {
  // validate
  if(await Account.findOne({userName: params.userName})) {
    throw 'User name "' + params.userName +'" is already registered';
  }

  if(await Account.findOne({employeeId: params.employeeId})) {
    throw 'Employee: "' + params.employeeName +'" is already registered';
  }

  console.log(params);
  const account = new Account(params);
  account.verified = Date.now();

  // hash pw
  account.passwordHash = hash(password);

  //save account
  await account.save();

  return basicDetails(account);
}

async function update(id, params) {
  const account = await getAccount(id);

  // validate if user name was changed
  if(params.userName && account.userName !== params.userName &&
      await Account.findOne({userName: params.userName})) {
        throw 'User name "' + params.userName + '" is already taken.';
  }

  // hash pw if it was entered
  if(params.password) {
    params.passwordHash = hash(params.password);
  }

  // copy params to account and save
  Object.assign(account, params);
  account.updated = Date.now();
  await account.save();

  return basicDetails(account);
}

async function _delete(id) {
  const account = getAccount(id);
  await account.remove();
}

// helper functions

async function getAccount(id) {
  const account = await Account.findById(id);
  if(!account) throw 'User account not found';
  return account;
}

async function getRefreshToken(token) {
  const refreshToken = await (await RefreshToken.findOne({ token})).populate('account');
  if(!refreshToken || !refreshToken.isActive) throw 'Invalid Token';
  return refreshToken;
}

function hash(password) {
  return bcrypt.hashSync(password, 10);
}

function generateJwtToken(account) {
  // create a jwt token containing the account id that expires in 15 minutes
  return jwt.sign({sub: account.id, id: account.id}, process.env.JWT_KEY, { expiresIn: '10m' });
}

function generateRefreshToken(account, ipAddress) {
  // create a refresh token that expires in 7 days
  return new RefreshToken({
    account: account.id,
    token: randomTokenString(),
    expires: new Date(Date.now() + 7*24*60*60*1000),
    createdByIp: ipAddress
  });
}

function randomTokenString() {
  return crypto.randomBytes(40).toString('hex');
}

function basicDetails(account) {
  const { id, userName, email, role, created, updated, isVerified } =account;
  return { id, userName, email, role, created, updated, isVerified };
}

async function sendVerificationEmail(account, origin) {
  let message;
  if(origin) {
    const verifyUrl = `${origin}/auth/verify-email?token=${account.verificationToken}`;
    message = `<p>Please click the below link to verify your email address:</p>
    <p><a href="${verifyUrl}">${verifyUrl}</a></p>`;
  } else {

  }

  await sendEmail({
    to: account.email,
    subject: 'Sign-up verification required',
    html: `<h3>Verify your email</h3>
          <p>Thanks for registering</p>
          ${message}`
  });
}

//// CHECK THIS WOULD BE FOR userName and not email.
//// check if email is being supplied as argument from calling function
async function sendAlreadyRegisteredEmail(email, origin) {
  let message;
  if (origin) {
      message = `<p>If you don't know your password please visit the <a href="${origin}/auth/forgot-password">forgot password</a> page.</p>`;
  } else {
      // message = `<p>If you don't know your password you can reset it via the <code>/auth/forgot-password</code> api route.</p>`;
  }

  await sendEmail({
      to: email,
      subject: 'Sign-up Verification - Email Already Registered',
      html: `<h4>Email Already Registered</h4>
             <p>Your email <strong>${email}</strong> is already registered.</p>
             ${message}`
  });
}

async function sendPasswordResetEmail(account, origin) {
  let message;
  if (origin) {
      const resetUrl = `${origin}/auth/reset-password?token=${account.resetToken.token}`;
      message = `<p>Please click the below link to reset your password, the link will be valid for 24 hours:</p>
                 <p><a href="${resetUrl}">${resetUrl}</a></p>`;
  } else {
      // message = `<p>Please use the below token to reset your password with the <code>/account/reset-password</code> api route:</p>
      //            <p><code>${account.resetToken.token}</code></p>`;
  }

  await sendEmail({
      to: account.email,
      subject: 'Reset Password',
      html: `<h4>Reset Password</h4>
             ${message}`
  });
}

