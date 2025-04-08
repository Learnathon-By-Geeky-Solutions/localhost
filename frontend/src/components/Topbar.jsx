import React from 'react'
import styles from './topbar.module.css'
import {useAuthStore} from '../store/useAuthStore'

export const Topbar = () => {
  const { user} = useAuthStore();
  console.log(user);
  

  return (
    <div className={styles.container}>

        <div className={styles.logo}>STUDIFY</div>
        <div className={styles.rightSide}>
            <div className={styles.notification}>🔔</div>
            <div className={styles.profile}>👤</div>
            <div className={styles.name}>{user.fullName.toUpperCase()}</div>
        </div>


    </div>
  )
}
