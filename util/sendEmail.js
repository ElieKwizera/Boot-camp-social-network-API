const nodemailer = require('nodemailer');

const sendEmail = async options =>
{

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL, // generated ethereal user
            pass: process.env.SMTP_PASSWORD // generated ethereal password
        }
    });


    const message = {
        from: `${process.env.SMTP_EMAIL}`,
        to:options.email,
        subject: options.subject,
        text:options.message
    };

    const info = await transporter.sendMail(message);

};

module.exports = sendEmail;

