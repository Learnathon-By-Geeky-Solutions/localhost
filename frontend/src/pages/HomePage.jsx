import React from 'react'
import { useAuthStore } from "../store/useAuthStore";

const HomePage = () => {
    const { logout, authUser } = useAuthStore();
  return (
    <div>
      hello {authUser.fullName}
      <button className="flex gap-2 items-center" onClick={logout}>
        
      logout
      </button>
    </div>
  )
}

export default HomePage