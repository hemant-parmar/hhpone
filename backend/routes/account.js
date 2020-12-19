const express = require('express');
const router = express.Router();

const authorize = require('../middleware/authorize');
const AccountController = require('../controllers/account');
const Role = require('../helpers/role');

router.post('/authenticate', AccountController.authenticateSchema, AccountController.authenticate);

router.post('/refresh-token', AccountController.refreshToken);

router.post('/revoke-token', authorize(),
            AccountController.revokeTokenSchema, AccountController.revokeToken);

router.post('/register', AccountController.registerSchema, AccountController.register);

router.post('/verify-email', AccountController.verifyEmailSchema, AccountController.verifyEmail);

router.post('/forgot-password', AccountController.forgotPasswordSchema, AccountController.forgotPassword);

router.post('/validate-reset-token',
            AccountController.validateResetTokenSchema, AccountController.validateResetToken);

router.post('/reset-password', AccountController.resetPasswordSchema, AccountController.resetPassword);

router.get('/', authorize(Role.Admin), AccountController.getAll);

router.get('/:id', authorize(), AccountController.getById);

router.post('/', AccountController.createSchema, AccountController.create);
// authorize(Role.Admin),

router.put('/:id', authorize(), AccountController.updateSchema, AccountController.update);

router.delete('/:id', authorize(), AccountController._delete);


module.exports = router;
