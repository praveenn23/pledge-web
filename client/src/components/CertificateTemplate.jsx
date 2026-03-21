import React, { forwardRef, useEffect, useRef } from "react";
import QRCode from "qrcode";
import "./CertificateTemplate.css";

const CertificateTemplate = forwardRef(({ certData }, ref) => {
  const qrRef = useRef(null);

  useEffect(() => {
    if (!certData?.certificateId || !qrRef.current) return;

    const verifyUrl = `${window.location.origin}/verify/${certData.certificateId}`;

    QRCode.toCanvas(qrRef.current, verifyUrl, {
      width: 70,
      margin: 1
    });
  }, [certData]);

  if (!certData) return null;

  const pronoun =
    certData.gender === "Female"
      ? "herself"
      : certData.gender === "Others"
      ? "themselves"
      : "himself";

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  return (
    <div className="certificate-wrapper">
      <div ref={ref} className="certificate">
        <div className="border-outer"></div>
        <div className="border-teal-left"></div>
        <div className="border-teal-right"></div>
        <div className="border-inner"></div>
        <div className="gold-line"></div>

        <div className="watermark">
          <svg viewBox="0 0 1080 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" stroke="#007a99" strokeWidth="1.4">
              <path d="M0 60 Q270 20 540 60 Q810 100 1080 60"/>
              <path d="M0 95 Q270 55 540 95 Q810 135 1080 95"/>
              <path d="M0 130 Q270 90 540 130 Q810 170 1080 130"/>
              <path d="M0 165 Q270 125 540 165 Q810 205 1080 165"/>
              <path d="M0 290 Q270 250 540 290 Q810 330 1080 290"/>
              <path d="M0 325 Q270 285 540 325 Q810 365 1080 325"/>
              <path d="M0 360 Q270 320 540 360 Q810 400 1080 360"/>
              <path d="M0 460 Q270 420 540 460 Q810 500 1080 460"/>
              <path d="M0 495 Q270 455 540 495 Q810 535 1080 495"/>
              <path d="M0 530 Q270 490 540 530 Q810 570 1080 530"/>
            </g>
          </svg>
        </div>

        <svg className="corner tl" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 8 L8 50" stroke="#14385a" strokeWidth="2" fill="none"/>
          <path d="M8 8 L50 8" stroke="#14385a" strokeWidth="2" fill="none"/>
          <path d="M8 8 L40 40" stroke="#c9a84c" strokeWidth="0.8" fill="none" opacity="0.7"/>
          <circle cx="8" cy="8" r="3.5" fill="#c9a84c"/>
          <circle cx="8" cy="50" r="2" fill="#007a99"/>
          <circle cx="50" cy="8" r="2" fill="#007a99"/>
          <path d="M15 15 Q24 11 32 15 Q24 19 15 15Z" fill="#007a99" opacity="0.5"/>
        </svg>
        <svg className="corner tr" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 8 L8 50" stroke="#14385a" strokeWidth="2" fill="none"/>
          <path d="M8 8 L50 8" stroke="#14385a" strokeWidth="2" fill="none"/>
          <path d="M8 8 L40 40" stroke="#c9a84c" strokeWidth="0.8" fill="none" opacity="0.7"/>
          <circle cx="8" cy="8" r="3.5" fill="#c9a84c"/>
          <circle cx="8" cy="50" r="2" fill="#007a99"/>
          <circle cx="50" cy="8" r="2" fill="#007a99"/>
          <path d="M15 15 Q24 11 32 15 Q24 19 15 15Z" fill="#007a99" opacity="0.5"/>
        </svg>
        <svg className="corner bl" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 8 L8 50" stroke="#14385a" strokeWidth="2" fill="none"/>
          <path d="M8 8 L50 8" stroke="#14385a" strokeWidth="2" fill="none"/>
          <path d="M8 8 L40 40" stroke="#c9a84c" strokeWidth="0.8" fill="none" opacity="0.7"/>
          <circle cx="8" cy="8" r="3.5" fill="#c9a84c"/>
          <circle cx="8" cy="50" r="2" fill="#007a99"/>
          <circle cx="50" cy="8" r="2" fill="#007a99"/>
          <path d="M15 15 Q24 11 32 15 Q24 19 15 15Z" fill="#007a99" opacity="0.5"/>
        </svg>
        <svg className="corner br" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 8 L8 50" stroke="#14385a" strokeWidth="2" fill="none"/>
          <path d="M8 8 L50 8" stroke="#14385a" strokeWidth="2" fill="none"/>
          <path d="M8 8 L40 40" stroke="#c9a84c" strokeWidth="0.8" fill="none" opacity="0.7"/>
          <circle cx="8" cy="8" r="3.5" fill="#c9a84c"/>
          <circle cx="8" cy="50" r="2" fill="#007a99"/>
          <circle cx="50" cy="8" r="2" fill="#007a99"/>
          <path d="M15 15 Q24 11 32 15 Q24 19 15 15Z" fill="#007a99" opacity="0.5"/>
        </svg>

        <div className="content">
          <div className="logos-row">
            <img className="logo-img" src="https://i.ibb.co/fYF8MyR0/chandigarh-university-logo-cu-freelogovectors-net-400x142.png" alt="Chandigarh University" style={{ filter: "invert(1) grayscale(100%)" }} />
            <img className="logo-img mazanya" src="https://i.ibb.co/dwrk71Jr/abc-1.png" alt="Mazanya" />
          </div>

          <div className="divider">
            <div className="divider-line"></div>
            <div className="divider-diamond"></div>
            <div className="divider-dot"></div>
            <div className="divider-diamond"></div>
            <div className="divider-line"></div>
          </div>

          <div className="pre-title">National Water Conservation</div>
          <div className="cert-title">Certificate of Pledge</div>

          <div className="ripple-wrap">
            <svg className="ripple-bg" width="80" height="20" viewBox="0 0 80 20">
              <path d="M0 10 Q10 0 20 10 T40 10 T60 10 T80 10" fill="none" stroke="#00b4cc" strokeWidth="2"/>
            </svg>
          </div>

          <div className="awarded-to">This is to certify that</div>

          <div className="name-row">
            <div className="name-ornament">~</div>
            <div className="name-line">
              <h2>{certData.name}</h2>
            </div>
            <div className="name-ornament">~</div>
          </div>

          <div className="body-text">
            has taken the <b>National Water Conservation Pledge</b> and committed {pronoun} to conserve water, avoid wastage, and promote water conservation awareness for the wellbeing of all citizens.
          </div>

          <div className="footer-rule"></div>

          <div className="footer">
            <div className="footer-left">
              <div><span className="label">Certificate ID:</span> <span className="val-line">{certData.certificateId}</span></div>
              <div><span className="label">Date:</span> <span className="val-line">{today}</span></div>
            </div>

            <div className="footer-right">
              <div style={{ textAlign: "center" }}>
                <canvas ref={qrRef} />
                <p style={{ fontSize: "10px", marginTop: "6px" }}>Scan to verify certificate</p>
              </div>

              <div className="registrar-block">
                <div className="sign-line"></div>
                <div className="registrar-title">Registrar</div>
                <div className="registrar-org">Chandigarh University</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
});

export default CertificateTemplate;