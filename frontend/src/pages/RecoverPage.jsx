import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./RecoverPage.module.css";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const RecoverPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [seePass, setSeePass] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { isSendingOtp, isResettingPassword, sendResetOtp, resetPassword } =
    useAuthStore();

  const showTempError = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
  };

  const isOtpValid = (code) => /^\d{6}$/.test(code);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return showTempError("Email is required");

    const result = await sendResetOtp(email);
    if (result?.success) {
      setSuccess(true);
      setErrorMessage("");
    } else {
      showTempError("Something went wrong. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword || !confirmPassword) {
      return showTempError("All fields are required");
    }

    if (!isOtpValid(otp)) {
      return showTempError("OTP must be a 6-digit number");
    }

    if (newPassword !== confirmPassword) {
      return showTempError("Passwords do not match");
    }

    if (newPassword.length < 6) {
      return showTempError("Password must be at least 6 characters");
    }

    const result = await resetPassword({ email, otp, newPassword });

    if (result?.success) {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } else {
      showTempError(result.message || "Invalid OTP or reset failed");
    }
  };

  const renderEmailForm = () => (
    <>
      <InputField
        icon={<EmailIcon />}
        placeholder="Email"
        type="email"
        value={email}
        onChange={setEmail}
        error={showError}
      />
      {showError && <div className={styles.error}>{errorMessage}</div>}
      <button className={styles.btn} type="submit" disabled={isSendingOtp}>
        {isSendingOtp ? "Sending..." : "Send OTP"}
      </button>
    </>
  );

  const renderResetForm = () => (
    <>
      <h3 className={styles.instructions}>
        We've sent a verification code to your email address. Please enter it
        below.
      </h3>

      <InputField
        icon={<img src="/otp.png" alt="OTP" />}
        placeholder="OTP Code"
        type="text"
        value={otp}
        onChange={setOtp}
        error={showError}
      />
      <InputField
        icon={<img src="/rotation-lock.png" alt="Password" />}
        placeholder="New Password"
        type={seePass ? "text" : "password"}
        value={newPassword}
        onChange={setNewPassword}
        error={showError}
      />
      <InputField
        icon={<ConfirmPassIcon />}
        placeholder="Confirm Password"
        type={seePass ? "text" : "password"}
        value={confirmPassword}
        onChange={setConfirmPassword}
        error={showError}
        rightIcon={
          <ToggleSeePassIcon
            seePass={seePass}
            onClick={() => setSeePass(!seePass)}
          />
        }
      />
      {showError && <div className={styles.error}>{errorMessage}</div>}
      <button
        className={styles.btn}
        type="submit"
        disabled={isResettingPassword}
      >
        {isResettingPassword ? "Resetting..." : "Reset Password"}
      </button>
    </>
  );

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <img src="/loginImg.jpg" alt="STUDIFY Logo" />
      </div>
      <div className={styles.rightSide}>
        <form onSubmit={step === 1 ? handleSendOtp : handleResetPassword}>
          <div className={styles.formTitle}>
            <h2>Reset Password</h2>
            <div className={styles.logo}>STUDIFY</div>
          </div>
          {success && step === 1 ? (
            <>
              <div className={styles.successMessage}>
                If this email is registered, an OTP has been sent.
              </div>
              <button
                className={styles.btn}
                onClick={() => setStep(2)}
                type="button"
              >
                Continue
              </button>
            </>
          ) : step === 1 ? (
            renderEmailForm()
          ) : (
            renderResetForm()
          )}
        </form>
      </div>
    </div>
  );
};

const InputField = ({
  icon,
  placeholder,
  type,
  value,
  onChange,
  error,
  rightIcon,
}) => (
  <div
    className={
      error ? `${styles.inputField} ${styles.shake}` : styles.inputField
    }
  >
    <div className={styles.icon}>{icon}</div>
    <div className={styles.field}>
      <input
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
    {rightIcon && <div className={styles.icon}>{rightIcon}</div>}
  </div>
);

// ✅ Add PropTypes validation
InputField.propTypes = {
  icon: PropTypes.node,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  rightIcon: PropTypes.node,
};

const EmailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="black"
    stroke="white"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
    />
  </svg>
);

const ConfirmPassIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="black"
    stroke="white"
    strokeWidth="1"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
    />
  </svg>
);

const ToggleSeePassIcon = ({ seePass, onClick }) =>
  seePass ? (
    <svg
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477..."
      />
    </svg>
  ) : (
    <br />
  );

ToggleSeePassIcon.propTypes = {
  seePass: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default RecoverPage;
