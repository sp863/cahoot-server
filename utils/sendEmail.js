const nodemailer = require("nodemailer");
const envKeys = require("../config/envConfig");

exports.sendInviteEmail = async (to, projectName, sentBy, invitationUrl) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: envKeys.CAHOOT_EMAIL,
      pass: envKeys.CAHOOT_EMAIL_PASSWORD,
      clientId: envKeys.GOOGLE_CLIENT_ID,
      clientSecret: envKeys.GOOGLE_SECRET_KEY,
      refreshToken: envKeys.GOOGLE_REFRESH_TOKEN,
    },
  });

  const subject = `Invitation to Project - ${projectName}`;
  const html = `<h1>Invitation to Project - ${projectName} from ${sentBy}</h1>
  <p>Please accept this invitation to our project by clicking on the following link.</p>
  <a href=${invitationUrl}> Click here</a>
  </div>`;
  const mailOptions = {
    from: envKeys.CAHOOT_EMAIL,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("email sent successfully");
  } catch (error) {
    console.log("email not sent!");
    console.log(error);
    return error;
  }
};
