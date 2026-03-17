import React, { forwardRef, useEffect, useRef } from "react";
import QRCode from "qrcode";

const CertificateTemplate = forwardRef(({ certData }, ref) => {
  const qrRef = useRef(null);

  useEffect(() => {
    if (!certData?.certificateId || !qrRef.current) return;

    const verifyUrl = `${window.location.origin}/verify/${certData.certificateId}`;

    QRCode.toCanvas(qrRef.current, verifyUrl, {
      width: 90,
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
    <div
      ref={ref}
      style={{
        width: "900px",
        padding: "40px",
        background: "#fff",
        fontFamily: "serif",
        border: "10px solid #003366",
        position: "relative"
      }}
    >
      {/* Watermark */}
      <div
        style={{
          position: "absolute",
          opacity: 0.04,
          fontSize: "300px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none"
        }}
      >
        <img src="https://www.cuchd.in/includes/assets/images/header-footer/cu-logo-white.webp" alt="Watermark" style={{ width: "250px", opacity: 0.15, filter: "invert(1) grayscale(100%) blur(0.5px)" }} />
      </div>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "32px", alignItems: "center" }}>
          <img src="https://www.cuchd.in/includes/assets/images/header-footer/cu-logo-white.webp" alt="Chandigarh University" style={{ height: "64px", objectFit: "contain", filter: "invert(1) grayscale(100%) blur(0.5px)" }} />
          <img src="https://i.ibb.co/dwrk71Jr/abc-1.png" alt="Mazanya Foundation" style={{ height: "64px", objectFit: "contain" }} />
        </div>

        <p style={{ margin: "4px 0", fontSize: "13px" }}>
          &nbsp;
        </p>

        <h1
          style={{
            marginTop: "12px",
            color: "#B22222",
            letterSpacing: "2px"
          }}
        >
          CERTIFICATE OF PLEDGE
        </h1>
      </div>

      {/* Body */}
      <div
        style={{
          fontSize: "14px",
          lineHeight: "1.8",
          textAlign: "center",
          padding: "0 30px"
        }}
      >
        <p>This is to certify that</p>

        <h2
          style={{
            margin: "8px 0",
            color: "#003366",
            borderBottom: "2px solid #003366",
            display: "inline-block",
            padding: "4px 12px"
          }}
        >
          {certData.name}
        </h2>

        <p>
          has taken the <b>National Water Conservation Pledge</b> and committed
          {` ${pronoun}`} to conserve water, avoid wastage,
          and promote water conservation awareness
          for the wellbeing of all citizens.
        </p>
      </div>

      {/* Info Grid */}
      <div
        style={{
          marginTop: "40px",
          display: "grid",
          gridTemplateColumns: "repeat(3,minmax(0,1fr))",
          gap: "20px",
          alignItems: "center"
        }}
      >
        {/* Certificate Info */}
        <div style={{ fontSize: "12px" }}>
          <p>
            <b>Certificate ID:</b>
          </p>
          <p>{certData.certificateId}</p>

          <p style={{ marginTop: "10px" }}>
            <b>Date Issued:</b>
          </p>
          <p>{today}</p>
        </div>

        {/* QR */}
        <div style={{ textAlign: "center" }}>
          <canvas ref={qrRef} />

          <p style={{ fontSize: "10px", marginTop: "6px" }}>
            Scan to verify certificate
          </p>
        </div>

        {/* Signature */}
        <div style={{ textAlign: "center", fontSize: "12px" }}>
          <div style={{
            fontFamily: "'Brush Script MT', cursive",
            fontSize: "24px",
            color: "#000",
            marginBottom: "4px",
            borderBottom: "1px solid #ccc",
            display: "inline-block",
            padding: "0 20px"
          }}>
            Registrar
          </div>

          <p style={{ marginTop: "6px" }}>
            Authorized Signatory
          </p>

          <p style={{ fontSize: "11px", color: "#444" }}>
            Chandigarh University
          </p>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "30px",
          textAlign: "center",
          fontSize: "10px",
          color: "#555"
        }}
      >
        This certificate was issued digitally via the MyGov citizen
        engagement platform.
      </div>
    </div>
  );
});

export default CertificateTemplate;