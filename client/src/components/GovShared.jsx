// Central shared UI components for Government style layout

const STEPS = ['Register', 'Take Pledge', 'OTP Verify', 'Certificate'];

export const IndiaEmblem = ({ size = 64, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 120"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Emblem of India"
  >
    <defs>
      <radialGradient id="eg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFD600" />
        <stop offset="100%" stopColor="#FF8C00" />
      </radialGradient>
    </defs>
    <ellipse cx="50" cy="72" rx="28" ry="6" fill="#c8a34a" opacity=".4" />
    <circle cx="50" cy="45" r="22" fill="none" stroke="url(#eg)" strokeWidth="3" />
    <circle cx="50" cy="45" r="4.5" fill="url(#eg)" />
    {[...Array(24)].map((_, i) => {
      const a = (i * 15 - 90) * Math.PI / 180;
      return (
        <line
          key={i}
          x1={50 + 5 * Math.cos(a)}
          y1={45 + 5 * Math.sin(a)}
          x2={50 + 20 * Math.cos(a)}
          y2={45 + 20 * Math.sin(a)}
          stroke="url(#eg)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      );
    })}
    <g fill="#c8a34a">
      <ellipse cx="42" cy="60" rx="6" ry="9" />
      <ellipse cx="58" cy="60" rx="6" ry="9" />
      <ellipse cx="42" cy="52" rx="5" ry="5" />
      <ellipse cx="58" cy="52" rx="5" ry="5" />
      <ellipse cx="50" cy="58" rx="4" ry="5" />
    </g>
    <rect x="22" y="80" width="56" height="10" rx="2" fill="url(#eg)" opacity=".85" />
    <text
      x="50"
      y="89"
      textAnchor="middle"
      fontSize="6"
      fill="#003366"
      fontWeight="bold"
      fontFamily="Arial"
    >
      सत्यमेव जयते
    </text>
  </svg>
);

export const GovHeader = ({ subtitle = 'Water Conservation Pledge' }) => (
  <header className="gov-header">
    <div className="tricolor-bar" />
    <div className="gov-header-top">
      <div className="container gov-header-inner">
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <img src="https://www.cuchd.in/includes/assets/images/header-footer/cu-logo-white.webp" alt="Chandigarh University Logo" style={{ height: "48px", objectFit: "contain" }} />
          <img src="https://www.mazanyafoundation.com/_next/image?url=%2Ffooter_logo.png&w=640&q=75" alt="Mazanya Foundation Logo" style={{ height: "48px", objectFit: "contain", backgroundColor: "white", padding: "4px", borderRadius: "4px" }} />
        </div>
        <div className="gov-header-title">
          <p className="gov-header-govtext">Chandigarh University</p>
          <h1 className="gov-header-maintitle">{subtitle}</h1>
          <p className="gov-header-subtitle">
            {/* In collaboration with MyGov India */}
          </p>
        </div>
        <div className="gov-header-right">
          <span style={{color: 'var(--gov-yellow)', fontSize: '12px', fontWeight: 'bold'}}>
             {/* Reserved for MyGov Logo */}
          </span>
          <span style={{color: '#93c5fd', fontSize: '10px'}}>Citizen Engagement Platform</span>
        </div>
      </div>
    </div>
    <div className="gov-header-banner">
      <p>💧 World Water Day (19-23 March) — Save Every Drop 💧</p>
    </div>
  </header>
);

export const StepBar = ({ current = 0 }) => (
  <div className="step-bar" role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={STEPS.length}>
    {STEPS.map((label, i) => {
      const isCompleted = i < current;
      const isActive = i === current;
      return (
        <div key={i} className="step-item">
          <div className="step-circle-container">
            <div className={`step-circle ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
              {isCompleted ? '✓' : i + 1}
            </div>
            <span className={`step-label ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`step-line ${isCompleted ? 'completed' : ''}`} />
          )}
        </div>
      );
    })}
  </div>
);

export const GovFooter = () => (
  <footer className="gov-footer">
    <div className="tricolor-bar" />
    <div className="container gov-footer-inner">
      <div style={{ display: "flex", justifyContent: "center", gap: "24px", alignItems: "center", marginBottom: "12px" }}>
        <img src="https://www.cuchd.in/includes/assets/images/header-footer/cu-logo-white.webp" alt="Chandigarh University Logo" style={{ height: "40px", objectFit: "contain" }} />
        <img src="https://www.mazanyafoundation.com/_next/image?url=%2Ffooter_logo.png&w=640&q=75" alt="Mazanya Foundation Logo" style={{ height: "40px", objectFit: "contain", backgroundColor: "white", padding: "4px", borderRadius: "4px" }} />
      </div>
      <p className="gov-footer-govtext">Chandigarh University &amp; Mazanya Foundation</p>
      <p style={{color: '#93c5fd', fontSize: '12px', marginTop: '4px'}}>
        &nbsp;
      </p>
      <div className="gov-footer-links">
        <span>Privacy Policy</span>
        <span>•</span>
        <span>Terms of Use</span>
        <span>•</span>
        <span>Contact Us</span>
      </div>
      <p style={{color: '#3b82f6', fontSize: '10px', marginTop: '16px'}}>
        © {new Date().getFullYear()} Praveen Kumar. All rights reserved.
      </p>
    </div>
  </footer>
);