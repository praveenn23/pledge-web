import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerPledge } from '../services/api';
import { GovHeader, GovFooter, StepBar } from '../components/GovShared';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu',
  'Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Delhi','Jammu and Kashmir',
  'Ladakh','Lakshadweep','Puducherry',
];
const DISTRICTS = {
  'Maharashtra': ['Mumbai','Pune','Nagpur','Nashik','Aurangabad','Solapur','Other'],
  'Delhi': ['Central Delhi','East Delhi','New Delhi','North Delhi','South Delhi','West Delhi'],
  'Karnataka': ['Bengaluru Urban','Mysuru','Mangaluru','Belagavi','Davangere','Hubballi-Dharwad'],
  'Tamil Nadu': ['Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem','Tirunelveli'],
  'Uttar Pradesh': ['Lucknow','Kanpur','Ghaziabad','Agra','Meerut','Varanasi','Prayagraj'],
};

const InputField = ({ label, required, children, hint }) => (
  <div className="input-group">
    <label className="input-label">
      {label}{required && <span className="input-required">*</span>}
    </label>
    {children}
    {hint && <p style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px' }}>{hint}</p>}
  </div>
);

export default function PledgeForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title:'', name:'', gender:'', dob:'', pincode:'',
    state:'', district:'', email:'', mobile:'', consent: false,
  });

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'state') setForm(p => ({ ...p, state: value, district: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.mobile || !form.state || !form.gender || !form.title || !form.email) {
      return toast.error('Please fill all required fields marked with *');
    }
    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      return toast.error('Enter a valid 10-digit mobile number starting with 6-9');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return toast.error('Enter a valid email address');
    }
    setLoading(true);
    try {
      const res = await registerPledge(form);
      sessionStorage.setItem('pledgeId', res.data.pledgeId);
      sessionStorage.setItem('pledgeForm', JSON.stringify(form));
      toast.success('Registration saved! Proceeding to pledge reading...');
      navigate('/read-pledge');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(msg, { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <GovHeader />

      <div className="form-container">
        <div className="text-center" style={{ marginBottom: '24px' }}>
          <span style={{ display:'inline-block', background:'var(--gov-blue)', color:'var(--gov-yellow)', fontSize:'10px', fontWeight:900, letterSpacing:'0.25em', padding:'6px 20px', borderRadius:'20px', textTransform:'uppercase' }}>
            Step 1 of 4
          </span>
          <h2 style={{ fontSize:'32px', fontWeight:900, color:'var(--gov-blue)', marginTop:'12px' }}>Registration Form</h2>
          <p style={{ color:'#6b7280', fontSize:'14px', marginTop:'4px' }}>Fill in your details to take the Water Conservation Pledge</p>
        </div>

        <StepBar current={0} />

        <div className="form-card">
          <div className="form-header">
            <div className="form-header-icon">📋</div>
            <div>
              <h3 className="form-header-title">Participant Details</h3>
              <p className="form-header-sub">All fields marked <span className="input-required">*</span> are mandatory</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="form-body">
            <div className="form-grid form-grid-4">
              <div style={{ gridColumn: 'span 1' }}>
                <InputField label="Title" required>
                  <select name="title" value={form.title} onChange={set} required className="input-field">
                    <option value="">—</option>
                    {['Mr.','Mrs.','Ms.','Dr.','Prof.','Shri','Smt.'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </InputField>
              </div>
              <div className="col-span-3">
                <InputField label="Full Name" required>
                  <input name="name" value={form.name} onChange={set} required className="input-field" placeholder="Enter your full name as per ID" />
                </InputField>
              </div>
            </div>

            <div className="form-grid form-grid-2">
              <InputField label="Gender" required>
                <select name="gender" value={form.gender} onChange={set} required className="input-field">
                  <option value="">Select Gender</option>
                  <option>Male</option><option>Female</option><option>Others</option>
                </select>
              </InputField>
              <InputField label="Date of Birth" required>
                <input type="date" name="dob" value={form.dob} onChange={set} required className="input-field" max={new Date().toISOString().split('T')[0]} />
              </InputField>
            </div>

            <div className="form-grid form-grid-3">
              <InputField label="Pin Code" required hint="6-digit postal code">
                <input name="pincode" value={form.pincode} onChange={set} required className="input-field" placeholder="110001" maxLength={6} pattern="\d{6}" />
              </InputField>
              <InputField label="State / UT" required>
                <select name="state" value={form.state} onChange={set} required className="input-field">
                  <option value="">Select State</option>
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </InputField>
              <InputField label="District">
                <select name="district" value={form.district} onChange={set} disabled={!form.state} className="input-field">
                  <option value="">Select District</option>
                  {(DISTRICTS[form.state] || ['Other']).map(d => <option key={d}>{d}</option>)}
                </select>
              </InputField>
            </div>

            <div className="form-grid form-grid-2">
              <InputField label="Mobile Number" required>
                <div className="mobile-input-wrap">
                  <span className="mobile-prefix">🇮🇳 +91</span>
                  <input name="mobile" value={form.mobile} onChange={set} required className="input-field" placeholder="98XXXXXXXX" maxLength={10} />
                </div>
              </InputField>
              <InputField label="Email ID" required hint="OTP will be sent to this email">
                <input type="email" name="email" value={form.email} onChange={set} required className="input-field" placeholder="you@example.com" />
              </InputField>
            </div>

            <div className="info-note">
              <span style={{ fontSize: '20px' }}>📧</span>
              <p>Your OTP will be sent to the email address provided above. Please ensure you have access to this inbox.</p>
            </div>

            <label htmlFor="consent" className="consent-box">
              <input type="checkbox" id="consent" name="consent" checked={form.consent} onChange={set} />
              <span className="consent-text">
                Details given above can be used to create <strong style={{ color: 'var(--gov-blue)' }}>My account</strong> on
                my behalf. I consent to the use of my data in accordance with Chandigarh University's data privacy policy.
              </span>
            </label>

            <button type="submit" disabled={loading} className="btn-submit">
              {loading
                ? <><span style={{ animation: 'spin 1s linear infinite' }}>⏳</span> Saving your details…</>
                : <>Proceed to Pledge Reading &nbsp;→</>}
            </button>
          </form>
        </div>
      </div>

      <GovFooter />
    </div>
  );
}
