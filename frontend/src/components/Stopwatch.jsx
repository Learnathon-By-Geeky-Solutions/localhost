import { useState, useEffect } from "react";
import "./stopwatch.css";

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}:${milliseconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="stopwatch-root">
    <div className="stopwatch-container">
      <h1 className="title">Timer</h1>
      <div className="display">{formatTime(time)}</div>
      <div className="buttons">
        {/* Play/Pause Button */}
        <button className="play-pause" onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="black">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="black">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Reset Button (Only Visible When Paused & Time > 0) */}
        {!isRunning && time > 0 && (
          <button className="reset" onClick={() => { setIsRunning(false); setTime(0); }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="black">
              <path d="M13 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7v4l5-5-5-5z" />
            </svg>
          </button>
        )}
      </div>
    </div>
    
    </div>
  );
}
