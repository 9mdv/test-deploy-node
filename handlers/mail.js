const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice'); // Inlines CSS
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

// Mailtrap.io setup
const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// // Test email sending
// transport.sendMail({
//   from: 'Mike Check <mike@gmail.com>',
//   to: 'testreceiver@example.com',
//   subject: 'Just trying things out!',
//   html: 'Hey <strong>waddup</strong> dude!',
//   text: 'Hey **waddup** dude!'
// });

const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(
    `${__dirname}/../views/email/${filename}.pug`,
    options
  );
  // console.log(html);
  const inlined = juice(html);
  // return html;
  return inlined;
};

exports.send = async options => {
  const html = generateHTML(options.filename, options);
  const text = htmlToText.fromString(html);
  const mailOptions = {
    from: `Mike Check <mike@gmail.com>`,
    to: options.user.email,
    subject: options.subject,
    html,
    text
  };
  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
};
