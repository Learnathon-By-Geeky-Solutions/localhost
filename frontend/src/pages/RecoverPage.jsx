import React, { useState } from "react";
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
  const {
    authError,
    isSendingOtp,
    isResettingPassword,
    sendResetOtp,
    resetPassword,
  } = useAuthStore();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Email is required");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    const result = await sendResetOtp(email);

    if (result && result.success) {
      setSuccess(true);
      setErrorMessage("");
    } else {
      setErrorMessage("Something went wrong. Please try again.");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword || !confirmPassword) {
      setErrorMessage("All fields are required");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setErrorMessage("OTP must be a 6-digit number");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    const result = await resetPassword({ email, otp, newPassword });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } else {
      setErrorMessage(result.message || "Invalid OTP or reset failed");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const toggleSeePass = () => setSeePass(!seePass);

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
            <>
              <div
                className={
                  showError
                    ? `${styles.inputField} ${styles.shake}`
                    : styles.inputField
                }
              >
                <div className={styles.icon}>
                  {/* Email icon */}
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
                </div>
                <div className={styles.field}>
                  <input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {showError && <div className={styles.error}>{errorMessage}</div>}

              <button
                className={styles.btn}
                type="submit"
                disabled={isSendingOtp}
              >
                {isSendingOtp ? "Sending..." : "Send OTP"}
              </button>
            </>
          ) : (
            <>
              <h3 className={styles.instructions}>
                We've sent a verification code to your email address. Please
                enter it below.
              </h3>

              <div
                className={
                  showError
                    ? `${styles.inputField} ${styles.shake}`
                    : styles.inputField
                }
              >
                <div className={styles.icon}>
                  <img src="/otp.png" alt="" />
                </div>
                <div className={styles.field}>
                  <input
                    placeholder="OTP Code"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>

              <div
                className={
                  showError
                    ? `${styles.inputField} ${styles.shake}`
                    : styles.inputField
                }
              >
                <div className={styles.icon}>
                  <img src="/rotation-lock.png" alt="" />
                </div>
                <div className={styles.field}>
                  <input
                    placeholder="New Password"
                    type={seePass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <div
                className={
                  showError
                    ? `${styles.inputField} ${styles.shake}`
                    : styles.inputField
                }
              >
                <div className={styles.icon}>
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
                </div>

                <div className={styles.field}>
                  <input
                    placeholder="Confirm Password"
                    type={seePass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className={styles.icon} onClick={toggleSeePass}>
                  {seePass ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <br />
                  )}
                </div>
              </div>

              {showError && <div className={styles.error}>{errorMessage}</div>}

              <button
                className={styles.btn}
                type="submit"
                disabled={isResettingPassword}
              >
                {isResettingPassword ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default RecoverPage;
