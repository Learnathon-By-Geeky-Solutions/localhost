import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import styles from './courses.module.css'; 
import BufferPage from './BufferPage';

const Courses = () => {
  const { user, checkAuth } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initialize = async () => {
      if (!user) {
        await checkAuth();
      }
      if (!user) {
        navigate("/");
        return;
      }

      try {
        const response = await axiosInstance.get("/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error.message);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [user, checkAuth, navigate]); // Added dependencies for better optimization

  if (loading) return <BufferPage />;

  return (
    <div className={styles.container}>
      {courses.length > 0 ? (
        courses.map(course => (
          <div key={course._id} className={styles.courseCard}>
            <div>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No courses found.</p>
      )}
    </div>
  );
};

export default Courses;


// import React from 'react'
// import styles from './courses.module.css'


// const Courses = () => {
//   return (
//     <div className={styles.container}>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//       <div className={styles.courseCard}>
//         <h3>Course 1</h3>
//       </div>
//     </div>
//   )
// }

// export default Courses