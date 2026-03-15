import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-hot-toast";

import { GovHeader, GovFooter, StepBar } from "../components/GovShared";
import CertificateTemplate from "../components/CertificateTemplate";
import { getCertificate, sendCertificateEmail as apiSendEmail } from "../services/api";

export default function Certificate() {
  const navigate = useNavigate();
  const certRef = useRef(null);

  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);

  const certificateId = sessionStorage.getItem("certificateId");

  const handleResendEmail = async () => {
    if (!certificateId) return;
    setSendingEmail(true);
    try {
      await apiSendEmail(certificateId);
      toast.success("Email sent successfully!");
    } catch (err) {
      console.error("Email resend failed:", err);
      toast.error(err.response?.data?.error || "Failed to resend email");
    } finally {
      setSendingEmail(false);
    }
  };

  useEffect(() => {
    if (!certificateId) {
      toast.error("Certificate not found.");
      navigate("/");
    }

    async function fetchCertificate() {
      try {
        const res = await getCertificate(certificateId);
        setCertData(res.data);
      } catch (err) {
        toast.error("Failed to load certificate");
      }

      setLoading(false);
    }

    fetchCertificate();
  }, [certificateId, navigate]);

  const handleDownload = async () => {
    if (!certRef.current) return;

    const canvas = await html2canvas(certRef.current, {
      scale: window.devicePixelRatio || 2
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "px", [
      canvas.width,
      canvas.height
    ]);

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`water-conservation-certificate-${certificateId}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(certificateId);
    toast.success("Certificate ID copied");
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <GovHeader subtitle="Certificate" />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading certificate...</p>
        </div>
        <GovFooter />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <GovHeader subtitle="Your Certificate" />

      <div className="container" style={{ padding: '32px 16px' }}>

        <StepBar current={3} />

        <div className="cert-success-banner no-print">
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎉</div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '4px' }}>Congratulations!</h2>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>You have successfully taken the National Water Conservation Pledge.</p>
        </div>

        {/* Certificate Preview */}
        <div className="cert-container" id="cert-print">
          <div style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            <CertificateTemplate ref={certRef} certData={certData} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="cert-actions no-print">
          <button onClick={handleDownload} className="cert-btn cert-btn-blue" style={{ gridColumn: 'span 2' }}>
            <span style={{ fontSize: '20px' }}>⬇️</span> Download PDF
          </button>

          <button onClick={handlePrint} className="cert-btn cert-btn-gray" style={{ gridColumn: 'span 1' }}>
            <span style={{ fontSize: '20px' }}>🖨️</span> Print
          </button>

          <button onClick={handleResendEmail} disabled={sendingEmail} className="cert-btn cert-btn-orange" style={{ gridColumn: 'span 1' }}>
            <span style={{ fontSize: '20px' }}>📧</span> {sendingEmail ? '...' : 'Email'}
          </button>

          <button onClick={() => navigate("/")} className="cert-btn cert-btn-green" style={{ gridColumn: 'span 2' }}>
            <span style={{ fontSize: '20px' }}>🏠</span> Go Home
          </button>
        </div>

        {/* ID Info block */}
        <div className="id-box no-print">
          <div>
            <p className="id-box-label">Certificate ID</p>
            <p className="id-box-val">{certificateId}</p>
          </div>
          <button onClick={handleCopy} className="btn-copy">
            Copy ID
          </button>
        </div>

      </div>

      <div className="no-print">
        <GovFooter />
      </div>
    </div>
  );
}