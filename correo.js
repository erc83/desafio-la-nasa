const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user:"espinoza.eric.portafolio@gmail.com",
        pass: process.env.EMAIL_PASSWORD,
    },
});

const send = function ({ email, name}, estado, nuevo) {
    return new Promise(async (resolve, reject) => {
        let html = nuevo
        ? `<h6> Hola, ${name}, gracias por registrarte en la NASA,
        revisaremos tu historial y te notificaremos cuando estés validado para subir fotos
        de extraterrestres.</h6>`
        : !estado
        ? `<h6>Hola, ${name}, haz sido deshabilitado para subir fotos.</h6>`
        : `<h6>Hola, ${name}, felicitaciones! Haz sido validado para subir fotos de extraterrestres.</h6>`;

        let mailOptions = {
            from: "nodemailerADL@gmail.com",
            to: email,
            bcc: "espinoza.eric@gmail.com",
            subject: `¡Saludos desde LA NASA!`,
            html,
        };

        transporter.sendMail(mailOptions, (err, data) => {
            if(err){
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
};

module.exports = send