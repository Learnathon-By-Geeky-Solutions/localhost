import React from 'react'
import { useAuthStore } from '../store/useAuthStore';


const Dashboard = () => {

  const { logout} = useAuthStore();

  const handleLogout = async (e)=>{
    await logout();
    return <Navigate to="/" />;
  
  }

  return (
    <div>
      <h1>DASHBOARD</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard