
import nodemailer from 'nodemailer';

export async function wrappedSendMail(mailOptions: any) {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODE_MAILER_EMAIL!,
        pass: process.env.NODE_MAILER_GMAIL_APP_PASSWORD!,
      },
    })

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("error is " + error);
        resolve(false); // or use rejcet(false) but then you will have to handle errors
      }
      else {
        console.log('Email sent: ' + info.response);
        resolve(true);
      }
    });
  })
}