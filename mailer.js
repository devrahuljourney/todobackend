const nodemailer = require("nodemailer");
const { eventNames } = require("./modals/User");
require("dotenv").config();

const mailerTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

module.exports = mailerTransport;
