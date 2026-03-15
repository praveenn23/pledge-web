const nodemailer = require('nodemailer');

const sendCertificateEmail = async (email, name, certificateId) => {
  if (!email || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`📧 Skipping email send: Missing config or recipient. (User: ${email})`);
    return false;
  }

  try {
    console.log(`⏳ Attempting to send certificate email to: ${email}`);
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const link = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify/${certificateId}`;

    const info = await transporter.sendMail({
      from: `"Chandigarh University & Mazanya Foundation" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🏆 Your Water Conservation Pledge Certificate – CU & Mazanya',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 12px; overflow: hidden;">
          <div style="background: #003366; padding: 30px; text-align: center;">
            <img src="https://www.cuchd.in/includes/assets/images/header-footer/cu-logo-white.webp" height="60" alt="CU Logo" style="display: inline-block; margin-right: 15px;"/>
            <img src="https://www.mazanyafoundation.com/_next/image?url=%2Ffooter_logo.png&w=640&q=75" height="60" alt="Mazanya Logo" style="display: inline-block; background: white; padding: 4px; border-radius: 4px;"/>
            <h1 style="color: #FFD600; margin: 20px 0 0; font-size: 24px;">National Water Conservation Pledge</h1>
            <p style="color: #9ec5fe; margin: 5px 0 0; font-size: 14px;">Chandigarh University & Mazanya Foundation Initiative</p>
          </div>
          <div style="padding: 40px; background: #ffffff; color: #333;">
            <p style="font-size: 18px;">Dear <strong>${name}</strong>,</p>
            <p style="font-size: 16px; line-height: 1.6;">Congratulations! Your <strong>Water Conservation Pledge Certificate</strong> has been generated successfully.</p>
            <p style="font-size: 16px; line-height: 1.6;">Thank you for taking this responsible step towards a water-secure future. Your commitment counts!</p>
            
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
              <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Certificate ID</p>
              <p style="margin: 5px 0 0; color: #003366; font-size: 20px; font-weight: bold; font-family: monospace;">${certificateId}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${link}" style="background: #003366; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                View & Download Certificate
              </a>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="color: #999; font-size: 12px; text-align: center;">Or copy this link: <a href="${link}" style="color: #003366;">${link}</a></p>
            <p style="color: #666; font-size: 13px; text-align: center; font-style: italic;">💧 Save Water, Save Life. Every drop counts! 💧</p>
          </div>
          <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 12px; color: #64748b;">© ${new Date().getFullYear()} Chandigarh University & Mazanya Foundation. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    console.log(`✅ Certificate email sent to ${email} (Message ID: ${info.messageId})`);
    return true;
  } catch (err) {
    console.error(`❌ Email sending failed for ${email}:`, err);
    return false;
  }
};

const sendOTPEmail = async (email, otp) => {
  if (!email || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`📧 Skipping OTP email: Missing config or recipient. (User: ${email})`);
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"CU & Mazanya Verification" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔑 Your Verification OTP - Water Conservation Pledge',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 12px; overflow: hidden; text-align: center;">
          <div style="background: #003366; padding: 20px;">
            <h2 style="color: #FFD600; margin: 0;">Verification Code</h2>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px; color: #333;">Your One-Time Password (OTP) for the <strong>Water Conservation Pledge</strong> is:</p>
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #003366;">${otp}</span>
            </div>
            <p style="font-size: 14px; color: #666;">This code is valid for <strong>5 minutes</strong>. Please do not share this code with anyone.</p>
          </div>
          <div style="background: #f8fafc; padding: 15px; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #999; margin: 0;">Chandigarh University & Mazanya Foundation Initiative</p>
          </div>
        </div>
      `,
    });

    console.log(`📧 OTP email sent to ${email}`);
    return true;
  } catch (err) {
    console.error(`❌ OTP email failed for ${email}:`, err);
    return false;
  }
};

module.exports = { sendCertificateEmail, sendOTPEmail };
