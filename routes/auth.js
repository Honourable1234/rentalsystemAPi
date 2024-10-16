const express = require('express');
const{
    register,
    login,
    verifyEmailAddress,
    resendEmailVerificationURL,
} = require('./../controller/auth');
const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/resend', resendEmailVerificationURL);
router.get('/verify-email/:email/:verificationToken', verifyEmailAddress);

module.exports = router;