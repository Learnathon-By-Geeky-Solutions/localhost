




import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

const ChapterDetails = () => {
  const { id } = useParams();
  const [chapter, setChapter] = useState(null);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const res = await axiosInstance.get(`/chapters/${id}`);
        setChapter(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChapter();
  }, [id]);

  if (!chapter) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{chapter.title}</h1>
      <p className="mt-4 text-gray-700">{chapter.content}</p>
    </div>
  );
};

export default ChapterDetails;
