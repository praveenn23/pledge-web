// In-memory OTP store for demo (use Redis in production)
const otpStore = new Map();

/**
 * Generate a 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const { sendOTPEmail: sendEmailHelper } = require('./emailUtils');

/**
 * Save OTP for identifier (email/mobile)
 */
function saveOTP(identifier, otp) {
  otpStore.set(identifier, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
}

/**
 * Verify OTP for identifier
 */
function verifyOTP(identifier, otp) {
  const record = otpStore.get(identifier);
  if (!record) return { valid: false, reason: 'OTP not found. Please request a new OTP.' };
  if (Date.now() > record.expiresAt) {
    otpStore.delete(identifier);
    return { valid: false, reason: 'OTP expired. Please request a new OTP.' };
  }
  if (record.otp !== otp) return { valid: false, reason: 'Invalid OTP. Please try again.' };
  otpStore.delete(identifier);
  return { valid: true };
}

/**
 * Send OTP via Email
 */
async function sendOTPEmail(email, otp) {
  console.log(`📧 Sending OTP ${otp} to ${email}`);
  if (process.env.OTP_PROVIDER === 'demo') {
    console.log(`🔑 DEMO OTP for ${email}: ${otp}`);
  }
  return await sendEmailHelper(email, otp);
}

/**
 * Send OTP via SMS (deprecated but kept for compatibility if needed)
 */
async function sendOTPSMS(mobile, otp) {
  const provider = process.env.OTP_PROVIDER || 'demo';
  console.log(`📱 Sending OTP ${otp} to +91${mobile} via ${provider}`);

  if (provider === 'demo') {
    // Demo mode: just log OTP
    console.log(`🔑 DEMO OTP for ${mobile}: ${otp}`);
    return { success: true, demo: true };
  }

  if (provider === 'twilio') {
    const twilio = require('twilio')(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    const message = await twilio.messages.create({
      body: `Your Water Conservation Pledge OTP is: ${otp}. Valid for 5 minutes. - Chandigarh University & Mazanya Foundation`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${mobile}`,
    });
    return { success: true, sid: message.sid };
  }

  if (provider === 'fast2sms') {
    const axios = require('axios');
    const res = await axios.post('https://www.fast2sms.com/dev/bulkV2', {
      route: 'otp',
      variables_values: otp,
      numbers: mobile,
    }, {
      headers: { authorization: process.env.FAST2SMS_API_KEY }
    });
    return { success: true, data: res.data };
  }

  throw new Error(`Unknown OTP provider: ${provider}`);
}

module.exports = { generateOTP, saveOTP, verifyOTP, sendOTPEmail, sendOTPSMS };
