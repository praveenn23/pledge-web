const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const supabase = require('../utils/supabase');

/**
 * POST /api/pledge/register
 * Register a new pledge
 */
router.post('/register', async (req, res) => {
  try {
    const { title, name, gender, dob, pincode, state, district, email, mobile, consent } = req.body;

    // Validation
    if (!name || !mobile || !state || !gender) {
      return res.status(400).json({ error: 'Name, mobile, state, and gender are required' });
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({ error: 'Invalid mobile number' });
    }

    // Check for existing registration
    const { data: existing, error: checkError } = await supabase
      .from('pledges')
      .select('id, certificate_id, pledge_taken')
      .or(`mobile.eq.${mobile}${email ? `,email.eq.${email}` : ''}`)
      .eq('pledge_taken', true)
      .limit(1);

    if (checkError) {
      console.error('Check existing error:', checkError);
    }

    if (existing && existing.length > 0) {
      return res.status(400).json({ 
        error: 'Duplicate Registration', 
        message: 'You have already taken the pledge. Please use the "Download existing certificate" option on the home page.',
        certificateId: existing[0].certificate_id
      });
    }

    const pledgeId = crypto.randomUUID();

    const { data, error } = await supabase
      .from('pledges')
      .insert([{
        id: pledgeId,
        title, name, gender, dob, pincode, state, district,
        email: email || null,
        mobile,
        otp_verified: false,
        pledge_taken: false,
        certificate_id: null,
        consent: consent || false,
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      pledgeId: data.id,
      message: 'Registration successful',
    });
  } catch (err) {
    console.error('Register pledge error:', err);
    res.status(500).json({ error: 'Registration failed', message: err.message });
  }
});

/**
 * POST /api/pledge/complete
 * Mark pledge as complete
 */
router.post('/complete', async (req, res) => {
  try {
    const { pledgeId } = req.body;
    if (!pledgeId) return res.status(400).json({ error: 'pledgeId is required' });

    const { error } = await supabase
      .from('pledges')
      .update({ pledge_taken: true })
      .eq('id', pledgeId);

    if (error) throw error;
    res.json({ success: true, message: 'Pledge marked as complete' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to complete pledge', message: err.message });
  }
});

module.exports = router;
