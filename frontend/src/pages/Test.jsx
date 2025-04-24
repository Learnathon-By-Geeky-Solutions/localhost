import React from 'react'
import TaskDetailModal from '../components/TASKS/TaskDetailModal'
import { AlertTriangle } from 'lucide-react';

const Test = () => {
  return (
    <div>
      <TaskDetailModal
        // popupPosition={{ x: 100, y: 50 }}
        onClose={()=>{
          alert("yeee");
          
        }}
      />
    </div>
  )
}

export default Test