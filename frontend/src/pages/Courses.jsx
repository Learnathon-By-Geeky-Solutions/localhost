import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../lib/axios'; // make sure the path is correct
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
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
  }, [user, checkAuth, navigate]);

  if (loading) return <BufferPage />;

  return (
    <div className={styles.container}>
      {courses.length > 0 ? (
        courses.map(course => (
          <Link 
            to={`/courses/${course._id}`} 
            key={course._id} 
            className={styles.courseCard}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
            </div>
          </Link>
        ))
      ) : (
        <p>No courses found.</p>
      )}
    </div>
  );
};

export default Courses;
