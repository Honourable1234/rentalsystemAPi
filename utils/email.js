const nodemailer = require('nodemailer');

const sendEmail = async (options) =>{
    const transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: '<omobolaji119@gmail.com> Ogunsola Omobolaji',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    await transport.sendMail(mailOptions)
}

module.exports = sendEmail;