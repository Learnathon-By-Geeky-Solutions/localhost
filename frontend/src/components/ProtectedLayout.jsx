// components/ProtectedLayout.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Topbar } from './Topbar';
import Navbar from './Navbar';
import PropTypes from "prop-types";


import styles from './protectedLayout.module.css';

const ProtectedLayout = ({ children }) => {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" />;

  return (
    <div className={styles.container}>
      <Topbar />
      <div className={styles.content}>
        <div className={styles.page}>
          {children}
        </div>
        <Navbar />
      </div>
    </div>
  );
};

ProtectedLayout.propTypes = {
  children: PropTypes.node.isRequired,
};


export default ProtectedLayout;
