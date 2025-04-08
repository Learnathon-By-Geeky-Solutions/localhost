import React from 'react'
import styles from  './navbar.module.css'
import { useAuthStore } from '../store/useAuthStore';

const Navbar = () => {

  const { logout} = useAuthStore();

  const handleLogout = async (e)=>{
    await logout();
    return <Navigate to="/" />;
  
  }

  return (
    <div className={styles.container}>

      <div className={styles.menuItem}>📝</div>
      <div className={styles.menuItem}>📝</div>
      <div className={styles.menuItem}>📝</div>
      <div className={styles.menuItem}>📝</div>
      <div className={styles.menuItem}>📝</div>
      <button className={styles.menuItem} onClick={handleLogout}> Logout </button> 

        

    </div>
  )
}

export default Navbar