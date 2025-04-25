// components/RouteTracker.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Only save path if user is logged in
    localStorage.setItem("lastPath", location.pathname);
  }, [location]);

  return null; // Just for side effects
};

export default RouteTracker;
