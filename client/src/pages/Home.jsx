import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GovHeader, GovFooter } from "../components/GovShared";
import CertIdModal from "../components/CertIdModal";

export default function Home() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    { label: "Citizens Pledged", value: "2,54,892" },
    { label: "States Covered", value: "28" },
    { label: "Lives Impacted", value: "1.2M+" }
  ];

  const handleStart = () => {
    navigate("/pledge-form");
  };

  const handleIdSubmit = (id) => {
    setIsModalOpen(false);
    navigate(`/verify/${id}`);
  };

  return (
    <div className="page-wrapper">
      <GovHeader subtitle="National Water Conservation Pledge" />

      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">
            Take the National Water Conservation Pledge
          </h1>
          <p className="hero-desc">
            Join millions of responsible citizens committed to making
            India water-secure. Take the pledge today and receive your
            official Water Conservation Certificate.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <button onClick={handleStart} className="btn-primary">
              Take the Pledge
            </button>
            <button 
              onClick={() => setIsModalOpen(true)} 
              style={{ color: '#fff', fontSize: '14px', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}
            >
              Already taken the pledge? Download certificate
            </button>
          </div>
        </div>
      </section>

      <CertIdModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleIdSubmit}
      />

      <section style={{ padding: '0 0 24px' }}>
        <div className="stats-grid border-bottom" style={{ borderBottom: '1px solid #e5e7eb', maxWidth: '100%' }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-card">
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="why-section">
        <div className="container">
          <h2 className="why-title">Why Water Conservation Matters</h2>
          <div className="why-grid">
            <div className="why-card">
              <h3>Save Every Drop</h3>
              <p>Fix leaks, close taps when not in use, and use water sparingly in daily chores.</p>
            </div>
            <div className="why-card">
              <h3>Harvest Rainwater</h3>
              <p>Adopt rainwater harvesting systems to recharge groundwater levels and natural sources.</p>
            </div>
            <div className="why-card">
              <h3>Spread Awareness</h3>
              <p>Encourage friends and family to practice water conservation and stop water wastage.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Be a Responsible Citizen</h2>
          <p className="cta-desc">Take the Water Conservation Pledge and contribute towards a sustainable future.</p>
          <button onClick={handleStart} className="btn-dark">
            Start Pledge
          </button>
        </div>
      </section>

      <GovFooter />
    </div>
  );
}