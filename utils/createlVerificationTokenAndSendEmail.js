const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sendEmail = require('./email')

const createEmailVerificationAndSendEmail = async(req, user) =>{
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedVerificationToken = bcrypt.hashSync(verificationToken, 12);
    const verification_url = `${req.protocol}://${req.get('host')}/api/v1/auth/verify-email/${user.email}/${verificationToken}`;
    user.verification_token = hashedVerificationToken;
    await user.save();
    await sendEmail({
        email: user.email,
        subject: 'Verify your email address',
        message: `Please click on the link below to verify your email address. \n\n ${verification_url}`,
    });
};

module.exports = createEmailVerificationAndSendEmail;