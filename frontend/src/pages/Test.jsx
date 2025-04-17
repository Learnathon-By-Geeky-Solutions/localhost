import React, { useState } from 'react'
import styles from './test.module.css'

const Test = () => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`${styles.container} ${isHovered ? styles.expanded : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.box}></div>
      {isHovered && <div className={styles.box}></div>}
    </div>
  )
}

export default Test
