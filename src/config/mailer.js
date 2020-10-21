import nodeMailer from 'nodemailer';

let adminEmail = 'vucuong25994@gmail.com';
let adminPassword = 'Makc@123';
let mailHost = 'smtp.gmail.com';
let mailPort = 587;

let sendMail = (to, subject, htmlContent) => {
    let transporter = nodeMailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: false, // use SSL - TLS
        auth: {
            user: adminEmail, // generated ethereal user
            pass: adminPassword, // generated ethereal password
        },
    });
    let options = {
        from: adminEmail,
        to: to,
        subject: subject,
        html: htmlContent
    };

    return transporter.sendMail(options); // this default return a Promise
};
module.exports = sendMail;