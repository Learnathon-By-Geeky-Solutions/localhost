import React from 'react'
import styles from './topbar.module.css'
import {useAuthStore} from '../store/useAuthStore'
import {useNavigate } from 'react-router-dom';

export const Topbar = () => {
  const { user} = useAuthStore();
  const useNav = useNavigate();

  

  return (
    
    <div className={styles.container}>

        <div className={styles.logo} onClick={()=>useNav('/dashboard')}>STUDIFY</div>
        <div className={styles.rightSide}>
            <div className={styles.notification}>🔔</div>
            <div className={styles.profile}>👤</div>
            <div className={styles.name}>{user.fullName.toUpperCase()}</div>
        </div>


    </div>
  )
}
