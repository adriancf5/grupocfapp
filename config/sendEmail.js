    //Send email
//"http://blog.nodeknockout.com/post/34641712180/sending-email-from-nodejs"

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var datos = require('./config.js')
var de = datos.emailDefault;
var contra = datos.password;
var name = datos.nameDefault;


module.exports.sendEmail = function (para, asunto, texto, Fhtml) {

    var transporter = nodemailer.createTransport(smtpTransport({
        host: 'mail.grupocf.com.mx',
        port: 587,
        auth: {
            user: de,
            pass: contra
        }
    }))
    var mailOptions = {
        from: name + ' <' + de + '> ',
        to: para,
        subject: asunto,
        text: texto,
        html: Fhtml
    };
    
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        } else {
            console.log("Message sent: " + info.message )
        }
        //console.log('Message sent: ' + info.reponse);
    })
}
