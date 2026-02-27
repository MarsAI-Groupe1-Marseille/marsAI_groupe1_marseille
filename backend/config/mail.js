const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: parseInt(process.env.EMAIL_PORT, 10) === 465, // true pour 465, false pour 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production' 
    }

});

module.exports = transporter;