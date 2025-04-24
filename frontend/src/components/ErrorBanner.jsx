// components/ErrorBanner.jsx
import React from "react";
import styles from "./errorBanner.module.css"; // You'll need to create this CSS module

const ErrorBanner = ({ error, onRetry, className }) => {
  if (!error) return null;
  
  return (
    <div className={`${styles.errorBanner} ${className || ''}`}>
      <p>{error}</p>
      {onRetry && (
        <button 
          className={styles.retryButton}
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorBanner;