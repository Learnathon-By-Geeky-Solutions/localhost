import React from 'react'
import styles from './app.module.css'
import Navbar from './components/Navbar'
import { Topbar } from './components/Topbar'
import Stopwatch from './components/Stopwatch'
import Test from './pages/Test'

const App = () => {
  return (
    <div className={styles.container}>

      <Topbar />

      <div className={styles.body}>
        <Navbar />

        <div className={styles.page}>
          <h1>DASHBOARD</h1>
          
        </div>



      </div>


    </div>
  )
}

export default App
