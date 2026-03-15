import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GovHeader, GovFooter, StepBar, IndiaEmblem } from "../components/GovShared";
import { toast } from "react-hot-toast";
import { sendOTP } from "../services/api";

export default function ReadPledge() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const pledgeId = sessionStorage.getItem("pledgeId");
  const form = JSON.parse(sessionStorage.getItem("pledgeForm") || "{}");

  const name = form.name || "Citizen";
  const email = form.email || "";

  useEffect(() => {
    if (!pledgeId || !email) {
      toast.error("Session missing. Please register first.");
      navigate("/");
    }
  }, [pledgeId, email, navigate]);

  const handlePledgeTaken = async () => {
    setLoading(true);
    try {
      await sendOTP(email);
      toast.success(`OTP sent to ${email}`);
      navigate("/otp-verify");
    } catch (err) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper read-pledge-bg">
      <GovHeader subtitle="Read Pledge" />

      <div className="form-container" style={{ padding: "40px 16px" }}>
        
        <StepBar current={1} />

        <div className="pledge-dark-card">
          <div className="pledge-dark-header">
            <div style={{ display: "flex", justifyContent: "center", gap: "24px", alignItems: "center", marginBottom: "16px" }}>
              <img src="https://www.cuchd.in/includes/assets/images/header-footer/cu-logo-white.webp" alt="Chandigarh University" style={{ height: "60px", objectFit: "contain" }} />
              <img src="https://www.mazanyafoundation.com/_next/image?url=%2Ffooter_logo.png&w=640&q=75" alt="Mazanya Foundation" style={{ height: "60px", objectFit: "contain", backgroundColor: "white", padding: "4px", borderRadius: "8px" }} />
            </div>
            <p className="pledge-dark-govtext">Chandigarh University &amp; Mazanya Foundation</p>
            <h2 className="pledge-dark-title">National Water Conservation Pledge</h2>
            <div style={{
              width: "120px", height: "4px", background: "var(--gov-yellow)",
              margin: "24px auto 0", borderRadius: "2px"
            }} />
          </div>

          <div style={{ padding: "32px", fontSize: "16px", lineHeight: "1.8", textAlign: "justify" }}>
            <p style={{ marginBottom: "24px", color: "#60a5fa", fontSize: "18px" }}>
              I, <strong>{name}</strong>, pledge to conserve water, use it judiciously, and prevent its wastage for the security of our future generations.
            </p>

            <div className="pledge-point">
              <span className="pledge-point-num">1</span>
              <p className="pledge-point-text">
                I will <strong>turn off the tap</strong> while brushing, washing hands, and shaving to avoid wasting precious water.
              </p>
            </div>

            <div className="pledge-point">
              <span className="pledge-point-num">2</span>
              <p className="pledge-point-text">
                I will ensure that any water <strong>leaks in my house, school, or workplace</strong> are repaired immediately.
              </p>
            </div>

            <div className="pledge-point">
              <span className="pledge-point-num">3</span>
              <p className="pledge-point-text">
                I will promote the use of a <strong>bucket</strong> for bathing and washing cars instead of a running hose.
              </p>
            </div>

            <div className="pledge-point">
              <span className="pledge-point-num">4</span>
              <p className="pledge-point-text">
                I will encourage <strong>rainwater harvesting</strong> and the reuse of water where possible.
              </p>
            </div>

            <div className="pledge-point">
              <span className="pledge-point-num">5</span>
              <p className="pledge-point-text">
                I will actively dissuade others from <strong>contaminating and littering</strong> our water bodies.
              </p>
            </div>

            <div className="pledge-point">
              <span className="pledge-point-num">6</span>
              <p className="pledge-point-text">
                I will be a responsible citizen and take every small step to make India a <strong>water-secure nation</strong>.
              </p>
            </div>
          </div>

          <div style={{
            background: "rgba(0,0,0,0.4)",
            padding: "32px",
            textAlign: "center",
            borderTop: "1px solid rgba(255,255,255,0.05)"
          }}>
            <button
              onClick={handlePledgeTaken}
              disabled={loading}
              style={{
                background: "var(--gov-yellow)",
                color: "var(--gov-blue)",
                fontWeight: 900,
                fontSize: "18px",
                padding: "20px 48px",
                borderRadius: "12px",
                boxShadow: "0 10px 25px -5px rgba(255, 214, 0, 0.4)",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {loading ? "Sending OTP..." : "I read and accept the Pledge"}
            </button>
            <p style={{ marginTop: "16px", color: "#9ca3af", fontSize: "14px" }}>
              You will receive an OTP on <strong>{email}</strong> to verify your pledge.
            </p>
          </div>
        </div>
      </div>

      <GovFooter />
    </div>
  );
}
