// components/ProtectedLayout.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Topbar } from './Topbar';
import Navbar from './Navbar';

import styles from '../app.module.css';

const ProtectedLayout = ({ children }) => {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" />;

  return (
    <div className={styles.container}>
      <Topbar />
      <div className={styles.body}>
        <Navbar />
        <div className={styles.page}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
