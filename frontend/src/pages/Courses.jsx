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
  const [showForm, setShowForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', description: '' });
  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/courses', newCourse);
      const response = await axiosInstance.get('/courses');
      setCourses(response.data);
      setShowForm(false); 
    } catch (error) {
      console.error('Failed to add course:', error.message);
    }
    finally{
      setNewCourse({title:'', description:''});
    }
    
  };

  useEffect(() => {
    const initialize = async () => {
      if (!user) {
        await checkAuth();
      }
      if (!user) {
        navigate('/');
        return;
      }

      try {
        const response = await axiosInstance.get('/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch courses:', error.message);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [user, checkAuth, navigate]);

  if (loading) return <BufferPage />;

  return (
    <div className={styles.container}>
      <div className={styles.courseCard} onClick={()=>setShowForm(true)}>
        <div className={styles.icon}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {courses.map((course) => (
        <div
          onClick={(e) => navigate(`/courses/${course._id}`)}
          key={course._id}
          className={styles.courseCard}
        >
          <div className={styles.title}>{course.title}</div>
          <div className={styles.description}>{course.description}</div>
        </div>
      ))}




      {/* Modal */}
      {showForm && (
        <div className={styles.modalOverlay}>
          <form onSubmit={handleSubmit} className={styles.modalForm}>
            <div className={styles.modalTitle}>Add New Course</div>
            <div className={styles.newCourseInput}>
              <input
                type="text"
                placeholder='Title'
                value={newCourse.title}
                onChange={(e)=>setNewCourse({
                  title: e.target.value,
                  description: newCourse.description
                })}
                required
              />
            </div>
            <div className={styles.newCourseInput}>
              <textarea
                placeholder='description'
                value={newCourse.description}
                onChange={(e)=>setNewCourse({
                  title: newCourse.title,
                  description: e.target.value
                })}
              />
            </div>
            <div className={styles.modalActions}>
              <button type="button" onClick={()=>setShowForm(false)} className={styles.cancelButton}>Cancel</button>
              <button type="submit" className={styles.submitButton}>Add</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Courses;
