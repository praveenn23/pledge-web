const express = require('express');
const router = express.Router();
const { generateOTP, saveOTP, sendOTPEmail } = require('../utils/otpUtils');
const { sendCertificateEmail } = require('../utils/emailUtils');

/**
 * POST /api/otp/send
 * Send OTP to email address
 */
router.post('/send', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const otp = generateOTP();
    saveOTP(email, otp);
    await sendOTPEmail(email, otp);

    res.json({
      success: true,
      message: `OTP sent to ${email}`,
      ...(process.env.OTP_PROVIDER === 'demo' ? { demoOtp: otp } : {}),
    });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ error: 'Failed to send OTP', message: err.message });
  }
});

/**
 * POST /api/otp/verify
 * Verify OTP using email
 */
router.post('/verify', async (req, res) => {
  try {
    const { email, otp, pledgeId } = req.body;
    if (!email || !otp || !pledgeId) {
      return res.status(400).json({ error: 'email, otp, and pledgeId are required' });
    }

    const isDemoOtp = otp === '123456' && process.env.OTP_PROVIDER === 'demo';
    
    const { verifyOTP: verify } = require('../utils/otpUtils');
    const result = isDemoOtp ? { valid: true } : verify(email, otp);

    if (!result.valid) {
      return res.status(400).json({ error: result.reason || 'Invalid OTP' });
    }

    // Update pledge as OTP verified
    const supabase = require('../utils/supabase');
    const crypto = require('crypto');
    const certificateId = `WCP-${new Date().getFullYear()}-${crypto.randomUUID().toUpperCase().slice(0, 8)}`;

    const { error } = await supabase
      .from('pledges')
      .update({
        otp_verified: true,
        pledge_taken: true,
        certificate_id: certificateId,
      })
      .eq('id', pledgeId);

    if (error) {
      console.error(`❌ Database update failed for pledgeId ${pledgeId}:`, error);
      throw error;
    }

    console.log(`✅ Database updated for ${pledgeId}. Generated ID: ${certificateId}`);

    // Fetch user details to send email
    const { data: pledgeData, error: fetchError } = await supabase
      .from('pledges')
      .select('email, name')
      .eq('id', pledgeId)
      .single();

    if (fetchError) {
      console.error(`❌ Failed to fetch pledge data for email: ${fetchError.message}`);
    } else if (pledgeData && pledgeData.email) {
      console.log(`📧 Automatically triggering email to: ${pledgeData.email}`);
      // Send email asynchronously so as not to block response
      sendCertificateEmail(pledgeData.email, pledgeData.name, certificateId)
        .then(sent => {
          if (sent) console.log(`✅ Async email sent successfully to ${pledgeData.email}`);
          else console.error(`❌ Async email FAILED to ${pledgeData.email}`);
        })
        .catch(err => console.error("❌ Auto-email catch error:", err));
    } else {
      console.log(`⚠️ Skip email: No email on record for pledge ${pledgeId}`);
    }

    res.json({ success: true, certificateId, message: 'Pledge completed successfully!' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ error: 'OTP verification failed', message: err.message });
  }
});

module.exports = router;
