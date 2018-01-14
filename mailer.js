import nodemailer from "nodemailer";

if(process.env.NODE_ENV){}

const from = '"Welcome to Design Dino" <info@designdino.com>';

function setup() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

export function sendConfirmationEmail(user) {
  const tranport = setup();
  const email = {
    from,
    to: user.email,
    subject: "Welcome to Design Dino",
    text: `
    To start digging for fossils. Please, confirm your email.

    ${user.generateConfirmationUrl()}
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
