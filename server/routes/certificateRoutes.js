const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');
const { sendCertificateEmail } = require('../utils/emailUtils');

/**
 * GET /api/certificate/:certificateId
 * Get certificate data
 */
router.get('/:certificateId', async (req, res) => {
  try {
    const { certificateId } = req.params;

    const { data, error } = await supabase
      .from('pledges')
      .select('*')
      .eq('certificate_id', certificateId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    if (!data.otp_verified) {
      return res.status(403).json({ error: 'Certificate not yet verified' });
    }

    res.json(data);
  } catch (err) {
    console.error('Get certificate error:', err);
    res.status(500).json({ error: 'Failed to fetch certificate' });
  }
});

/**
 * POST /api/certificate/send-mobile
 * Send certificate link via SMS (Placeholder logic)
 */
router.post('/send-mobile', async (req, res) => {
  try {
    const { certificateId } = req.body;
    const { data, error } = await supabase
      .from('pledges')
      .select('mobile, name')
      .eq('certificate_id', certificateId)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Certificate not found' });

    const link = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify/${certificateId}`;
    
    // In many cases we just log this for now, actual SMS would require a provider API
    console.log(`📱 Certificate link requested for ${data.mobile}: ${link}`);

    res.json({ success: true, message: `Certificate link sent to +91${data.mobile}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send to mobile', message: err.message });
  }
});

/**
 * POST /api/certificate/send-email
 * Retrigger certificate email
 */
router.post('/send-email', async (req, res) => {
  try {
    const { certificateId } = req.body;
    const { data, error } = await supabase
      .from('pledges')
      .select('email, name, mobile')
      .eq('certificate_id', certificateId)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Certificate not found' });
    if (!data.email) return res.status(400).json({ error: 'No email address on record' });

    const sent = await sendCertificateEmail(data.email, data.name, certificateId);

    if (sent) {
      res.json({ success: true, message: `Certificate sent to ${data.email}` });
    } else {
      res.status(500).json({ error: 'Failed to send email. Check server logs.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email', message: err.message });
  }
});

module.exports = router;
