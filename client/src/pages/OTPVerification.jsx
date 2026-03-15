import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GovHeader, GovFooter, StepBar } from "../components/GovShared";
import { verifyOTP, sendOTP } from "../services/api";
import { toast } from "react-hot-toast";

export default function OTPVerification() {
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const pledgeId = sessionStorage.getItem("pledgeId");
  const form = JSON.parse(sessionStorage.getItem("pledgeForm") || "{}");
  const email = form.email || "";

  useEffect(() => {
    if (!email || !pledgeId) {
      toast.error("Session expired. Please start again.");
      navigate("/");
    }
  }, [email, pledgeId, navigate]);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    const code = otp.join("");
    if (code.length === 6) handleVerify();
  }, [otp]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) inputsRef.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

    const newOtp = ["", "", "", "", "", ""];
    pasted.split("").forEach((d, i) => { newOtp[i] = d; });
    setOtp(newOtp);

    const focusIndex = Math.min(pasted.length, 5);
    inputsRef.current[focusIndex]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Enter valid OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOTP(email, code, pledgeId);
      sessionStorage.setItem("certificateId", res.data.certificateId);
      toast.success("OTP Verified Successfully");
      navigate("/certificate");
    } catch (err) {
      toast.error("Invalid OTP");
    }
    setLoading(false);
  };

  const handleResend = async () => {
    try {
      await sendOTP(email);
      toast.success("OTP resent successfully");
      setTimer(30);
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0].focus();
    } catch (err) {
      toast.error("Failed to resend OTP");
    }
  };

  const maskedEmail = email.includes("@") 
    ? email.split("@")[0].slice(0, 3) + "•••@" + email.split("@")[1]
    : email;

  return (
    <div className="page-wrapper">
      <GovHeader subtitle="OTP Verification" />

      <div className="form-container">
        <StepBar current={2} />

        <div className="verify-box">
          <h2 style={{ fontSize: "24px", fontWeight: "900", color: "var(--gov-blue)", marginBottom: "8px" }}>
            Verify OTP
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "24px" }}>
            OTP sent to <b>{maskedEmail}</b>
          </p>

          <div className="otp-container" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={`otp-box ${digit ? 'filled' : ''}`}
                style={digit ? { background: '#fff9e6', borderColor: 'var(--orange)' } : {}}
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={loading}
            className="btn-dark"
            style={{ width: "100%", padding: "14px", borderRadius: "12px", fontSize: "16px" }}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <div style={{ marginTop: "20px", fontSize: "14px", color: "var(--text-muted)" }}>
            {timer > 0 ? (
              <span>Resend OTP in <b>{timer}s</b></span>
            ) : (
              <button onClick={handleResend} className="otp-btn-resend">Resend OTP</button>
            )}
          </div>
        </div>
      </div>

      <GovFooter />
    </div>
  );
}