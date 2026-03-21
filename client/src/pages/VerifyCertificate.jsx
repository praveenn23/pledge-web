import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GovHeader, GovFooter } from "../components/GovShared";
import CertificateTemplate from "../components/CertificateTemplate";
import { getCertificate, sendCertificateEmail as apiSendEmail } from "../services/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-hot-toast";
import { useRef } from "react";

export default function VerifyCertificate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const certRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [cert, setCert] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    async function verify() {
      try {
        const res = await getCertificate(id);
        setCert(res.data);
      } catch (err) {
        setCert(null);
      }
      setLoading(false);
    }
    verify();
  }, [id]);

  return (
    <div className="page-wrapper">
      <GovHeader subtitle="Verify Certificate" />

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
        {loading ? (
          <div className="verify-box">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                width: "64px", height: "64px",
                border: "4px solid var(--gov-blue)",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginBottom: "16px"
              }} />
              <p style={{ color: "var(--gov-blue)", fontWeight: "600", fontSize: "18px" }}>Verifying...</p>
            </div>
          </div>
        ) : cert ? (
          <div style={{ width: "100%", maxWidth: "1200px" }}>
            <div className="cert-success-banner no-print" style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>✅ Valid Certificate</div>
              <p style={{ fontSize: "14px", opacity: 0.9 }}>This certificate is authentic and registered with Chandigarh University.</p>
            </div>

            <div className="cert-container" id="cert-print">
              <div style={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
                <CertificateTemplate ref={certRef} certData={cert} />
              </div>
            </div>

            <div className="cert-actions no-print" style={{ marginTop: "24px" }}>
              <button 
                onClick={async () => {
                  const canvas = await html2canvas(certRef.current, { scale: 2 });
                  const imgData = canvas.toDataURL("image/png");
                  const pdf = new jsPDF("landscape", "px", [canvas.width, canvas.height]);
                  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
                  pdf.save(`certificate-${id}.pdf`);
                }}
                className="cert-btn cert-btn-blue" 
                style={{ gridColumn: "span 2" }}
              >
                <span style={{ fontSize: "20px" }}>⬇️</span> Download PDF
              </button>

              <button onClick={() => window.print()} className="cert-btn cert-btn-gray" style={{ gridColumn: "span 1" }}>
                <span style={{ fontSize: "20px" }}>🖨️</span> Print
              </button>

              <button 
                disabled={sendingEmail}
                onClick={async () => {
                  setSendingEmail(true);
                  try {
                    await apiSendEmail(id);
                    toast.success("Email sent!");
                  } catch (err) {
                    toast.error("Failed to send email");
                  } finally {
                    setSendingEmail(false);
                  }
                }}
                className="cert-btn cert-btn-orange" 
                style={{ gridColumn: "span 1" }}
              >
                <span style={{ fontSize: "20px" }}>📧</span> {sendingEmail ? "..." : "Email"}
              </button>

              <button onClick={() => navigate("/")} className="cert-btn cert-btn-green" style={{ gridColumn: "span 2" }}>
                <span style={{ fontSize: "20px" }}>🏠</span> Go Home
              </button>
            </div>

            <div className="id-box no-print" style={{ marginTop: "24px" }}>
              <div>
                <p className="id-box-label">Verified Certificate ID</p>
                <p className="id-box-val">{id}</p>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(id);
                  toast.success("ID Copied");
                }} 
                className="btn-copy"
              >
                Copy ID
              </button>
            </div>
          </div>
        ) : (
          <div className="verify-box">
            <div className="verify-icon-invalid">✕</div>
            <h2 style={{ fontSize: "24px", fontWeight: "900", color: "#dc2626", marginBottom: "8px" }}>
              Invalid Certificate
            </h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
              We couldn't find a record for this certificate ID. It may be mistyped or does not exist.
            </p>
            <button
              onClick={() => navigate("/")}
              style={{ width: "100%", background: "#e5e7eb", color: "#374151", fontWeight: "700", padding: "12px", borderRadius: "12px", transition: "background 0.2s" }}
              onMouseOver={(e) => e.target.style.background = "#d1d5db"}
              onMouseOut={(e) => e.target.style.background = "#e5e7eb"}
            >
              Go to Homepage
            </button>
          </div>
        )}
      </div>

      <GovFooter />
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
