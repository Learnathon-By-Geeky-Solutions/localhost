import React, { useState,useEffect } from 'react'
import styles from './app.module.css'
import Navbar from './components/Navbar'
import { Topbar } from './components/Topbar'
import Stopwatch from './components/Stopwatch'
import Test from './pages/Test'
import LoginPage from './pages/LoginPage'
import { useAuthStore } from './store/useAuthStore'
const App = () => {
  const [isAuth, setIsAuth] = useState(false);
  const { authUser, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (

      <div className={styles.container}>
        {
          authUser? <h1>logged in yeee</h1>:<LoginPage/>
        }
      </div>
 

  )
}

export default App
