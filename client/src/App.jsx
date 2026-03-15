import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import PledgeForm from './pages/PledgeForm';
import ReadPledge from './pages/ReadPledge';
import OTPVerification from './pages/OTPVerification';
import Certificate from './pages/Certificate';
import VerifyCertificate from './pages/VerifyCertificate';

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pledge-form" element={<PledgeForm />} />
        <Route path="/read-pledge" element={<ReadPledge />} />
        <Route path="/otp-verify" element={<OTPVerification />} />
        <Route path="/certificate" element={<Certificate />} />
        <Route path="/verify/:id" element={<VerifyCertificate />} />
      </Routes>
    </Router>
  );
}

export default App;
