import nodemailer from "nodemailer";



let from = '"Welcome to Design Dino" <info@designdino.com>';

// const setup = function;
let setup = '';

if(process.env.NODE_ENV) {
  
  from = "chase.n.poirier@gmail.com"

  var transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
          user: 'chase.n.poirier@gmail.com',
          pass: '#Trapac15'
      }
  });

} else {

  setup = function() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
}

export function sendConfirmationEmail(user) {
  const tranport = setup();
  const email = {
    from,
    to: user.email,
    subject: "Welcome to Design Dino",
    html: `
    To start digging for fossils. Please, confirm your email.

    <a href="${user.generateConfirmationUrl()}">${user.generateConfirmationUrl()}</a>
    `
  };

  tranport.sendMail(email);
}

export function sendResetPasswordEmail(user) {
  const tranport = setup();
  const email = {
    from,
    to: user.email,
    subject: "Reset Password",
    text: `
    To reset password follow this link

    ${user.generateResetPasswordLink()}
    `
  };

  tranport.sendMail(email);
}
