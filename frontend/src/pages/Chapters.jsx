import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './chapters.module.css';
import BufferPage from './BufferPage';

const Chapters = () => {
  const { user, checkAuth } = useAuthStore();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const navigate = useNavigate();
  const courseId = useParams().id;
 
  



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/chapters', {
        courseId: courseId,
        title: newTitle,
        content:"idk how to add contents yet"
      });
      const response = await axiosInstance.get(`/chapters/all/${courseId}`);
      setChapters(response.data);
      setShowForm(false); 
    } catch (error) {
      console.error('Failed to add chapter:', error.message);
    }
    finally{
      setNewTitle('');
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
        const response = await axiosInstance.get(`/chapters/all/${courseId}`);
        setChapters(response.data);
      } catch (error) {
        console.error('Failed to fetch chapters:', error.message);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [user, checkAuth, navigate]);

  if (loading) return <BufferPage />;

  return (
    <div className={styles.container}>
      <div className={styles.card} onClick={()=>setShowForm(true)}>
        <div className={styles.icon}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {chapters.map((chapter) => (
        <button
          key={chapter._id}
          onClick={(e) => navigate(`/chapters/${chapter._id}`)}
          className={styles.card}
        >
          <div className={styles.title}>{chapter.title}</div>
        </button>
      ))}




      {/* Modal */}
      {showForm && (
        <div className={styles.modalOverlay}>
          <form onSubmit={handleSubmit} className={styles.modalForm}>
            <div className={styles.modalTitle}>Add New Chapter</div>
            
            <div className={styles.newCourseInput}>
              <input
                type="text"
                placeholder='Title'
                value={newTitle}
                onChange={(e)=>setNewTitle(e.target.value)}
                required
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

export default Chapters;
