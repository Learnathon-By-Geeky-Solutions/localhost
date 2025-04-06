import React from 'react'
import styles from './topbar.module.css'

export const Topbar = () => {
  return (
    <div className={styles.container}>

        <div className={styles.logo}>STUDIFY</div>
        <div className={styles.rightSide}>
            <div className={styles.notification}>🔔</div>
            <div className={styles.profile}>👤</div>
            <div className={styles.name}>User Name</div>
        </div>


    </div>
  )
}
