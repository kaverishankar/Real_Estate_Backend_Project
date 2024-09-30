import express from 'express';
import { transporter} from '../db-utils/mail-utils.js'; // Import your Nodemailer configuration

const MailRouter = express.Router();

MailRouter.post('/send-interest-email', async (req, res) => {
  const { sellerInfo, productInfo } = req.body;

  const mailOptions = {
    from: 'kaverishankar0101@gmail.com',
    to: sellerInfo.email,
    subject: `Interest in Property: ${productInfo.name}`,
    text: `
      Hello ${sellerInfo.name},

      Buyer has shown interest in your property "${productInfo.name}".

      Property Details:
      Name: ${productInfo.name}
      Price: $${productInfo.price}
      Description: ${productInfo.description}

      Please get in touch with the buyer.

      Best regards,
      Real Estate Platform
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

export default MailRouter;
