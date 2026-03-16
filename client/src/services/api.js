import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const registerPledge = (data) => api.post('/pledge/register', data);
export const sendOTP = (email) => api.post('/otp/send', { email });
export const verifyOTP = (email, otp, pledgeId) => api.post('/otp/verify', { email, otp, pledgeId });
export const completePledge = (pledgeId) => api.post('/pledge/complete', { pledgeId });
export const getCertificate = (certificateId) => api.get(`/certificate/${certificateId}`);
export const sendCertificateMobile = (certificateId) => api.post('/certificate/send-mobile', { certificateId });
export const sendCertificateEmail = (certificateId) => api.post('/certificate/send-email', { certificateId });

export default api;
