const Joi = require('joi');

const validateRequest = require('../middleware/validate-request');
const accountService = require('./account.service');
const Account = require('../models/account');

exports.authenticateSchema = (req, res, next) => {
  const schema = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required()
  });
  validateRequest(req, next, schema);
}

exports.authenticate = (req, res, next) => {
  const { userName, password } = req.body;
  const ipAddress = req.ip;
  accountService.authenticate({userName, password, ipAddress})
    .then(({refreshToken, ...account}) => {                        // ?...account
      setTokenCookie(res, refreshToken);
      res.json(account);
    })
    .catch(next);   // ?
}

exports.refreshToken = (req, res, next) => {
  const token = req.cookies.refreshToken;
  const ipAddress = req.ip;
  accountService.refreshToken({token, ipAddress})
    .then(({refreshToken, ...account}) => {                  // ? how ...account
      setTokenCookie(res, refreshToken);
      res.json(account);
    })
    .catch(next);    // ?
}

exports.revokeTokenSchema = (req, res, next) => {
  const schema = Joi.object({
    token: Joi.string().empty('')
  });
  validateRequest(req, next, schema);  // ?
}

exports.revokeToken = (req, res, next) => {
  // accept token from request body or cookie
  const token = req.body.token || req.cookies.refreshToken;
  const ipAddress = req.ip;

  if(!token) return res.status(400).json({ message: 'Token is required'});

  // users can revoke their own tokens and admins can revoke any tokens
  if(!req.user.ownsToken(token) && req.user.role !== Role.Admin ) {
    return res.status(401).json({ message: 'Unauthorized - acct ctlr revokeTkn'});
  }

  accountService.revokeToken({token, ipAddress})
    .then(() => res.json({ message: 'Token revoked'}))
    .catch(next);
}

exports.registerSchema = (req, res, next) => {
  const schema = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    employeeId: Joi.string().required()
  });
  validateRequest(req, next, schema);
}

exports.register = (req, res, next) => {
  accountService.register(req.body, req.get('origin'))
    .then(() => {
      res.json({ message: 'Registration successful. The registered user needs to complete email verification.'})
    })
    .catch(next);
}

exports.verifyEmailSchema = (req, res, next) => {
  const schema = Joi.object({
    token: Joi.string().required()
  });
  validateRequest(req, next, schema);
}

exports.verifyEmail = (req, res, next) => {
  accountService.verifyEmail(req.body)
    .then(() => {
      res.json({message: 'Verification successful. You can now login.'})
    })
    .catch(next);
}

exports.forgotPasswordSchema = (res, req, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required()
  });
  validateRequest(req, next, schema);
}

exports.forgotPassword = (req, res, next) => {
  accountService.forgotPassword(req.body, req.get('origin'))
    .then(() => {
      res.json({
        message: 'Please check your email for password reset instructions'
      });
    })
    .catch(next);
}

exports.validateResetTokenSchema = (req, res, next) => {
  const schema = Joi.object({
    token: Joi.string().required()
  });
  validateRequest(req, next, schema);
}

exports.validateResetToken = (req, res, next) => {
  accountService.validateResetToken(req.body)
    .then(() => {
      res.json({ message: 'Token is valid' });
    })
    .catch(next);
}

exports.resetPasswordSchema = (req, res, next) => {
  const schema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
  });
  validateRequest(req, next, schema);
}

exports.resetPassword = (req, res, next) => {
  accountService.resetPassword(req.body)
    .then(() => {
      res.json({ message: 'Password reset successful. You can login using the new password' })
    })
    .catch(next);
}

exports.getAll = (req, res, next) => {
  accountService.getAll()
    .then(accounts => res.json(accounts))
    .catch(next);
}

exports.getById = (req, res, next) => {
  // users can get their own account and admins can get any account
  if(req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: 'Unauthorized - account ctlr getById'})
  }

  accountService.getById(req.params.id)
    .then(account => account ? res.json(account) : res.sendStatus(404))
    .catch(next);
}

exports.createSchema = (req, res, next) => {
  const schema = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    employeeId: Joi.string().required(),
    employeeName: Joi.string().required(),
    email: Joi.string().required(),
    role: Joi.string().valid(Role.Admin, Role.User).required()
  });
  validateRequest(req, next, schema);
}

exports.create = (req, res, next) => {
  accountService.create(req.body)
    .then(account => res.json(account))
    .catch(next);
}

exports.updateSchema = (req, res, next) => {
  const schemaRules = {
    userName: Joi.string().required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    employeeId: Joi.string().required()
  };

  // only admins can update role
  if(req.user.role === Role.Admin) {
    schemaRules.role = Joi.string().valid(Role.Admin, Role.User).empty('');
  }

  const schema = Joi.object(schemaRules).with('password', 'confirmpassword');
  validateRequest(req, next, schema);
}

exports.update = (req, res, next) => {
  // users can update their own account and admins can update any account
  if(req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ messahe: 'Unauthorized - acct ctlr update'});
  }
  accountService.update(req.params.is, req.body)
    .then(account => res.json(account))
    .catch(next);
}

exports._delete = (req, res, next) => {
  // only admins can delete account
  // if user shd be able to delete their account then add: req.params.id !== req.user.id &&
  // to the if condition
  if(req.user.role !== Role.Admin) {
    return res.status(401).json({ message: 'Unauthorized - acct ctlr delete'})
  }
  accountService.delete(req.params.id)
    .then(() => res.json({ message: 'Account Deleted'}))
    .catch(next);
}


// helper function
function setTokenCookie(res, token) {
  // create cookie with refresh token that expires in 7 days
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7*24*60*60*1000)
  };
  res.cookie('refreshToken', token, cookieOptions);           ///?
}
