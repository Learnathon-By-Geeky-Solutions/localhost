import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, Link, useParams } from 'react-router-dom';
import styles from './chapters.module.css'; 
import BufferPage from './BufferPage';
import { useState, useEffect } from 'react';
import { axiosInstance } from '../lib/axios';

const Chapters = () => {
  const { user, checkAuth } = useAuthStore();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ useParams must be called here, not inside useEffect

  console.log(id);
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
        const response = await axiosInstance.post("/chapters", {
          courseId: id, // sent in request body
        });
        setChapters(response.data);
      } catch (error) {
        console.error("Failed to fetch Chapters:", error.message);
      } finally {
        setLoading(false);
      }
      
    };

    initialize();
  }, [user, checkAuth, navigate, id]);

  if (loading) return <BufferPage />;

  return (
    <div className={styles.container}>
      {chapters.length > 0 ? (
        chapters.map((chapter) => (
          <Link 
            to={`/chapters/${chapter._id}`} 
            key={chapter._id} 
            className={styles.courseCard}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div>
              <h3>{chapter.title}</h3>
              <p>{chapter.description}</p>
            </div>
          </Link>
        ))
      ) : (
        <p>No Chapters found.</p>
      )}
    </div>
  );
};

export default Chapters;
