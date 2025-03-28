import React from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Dashboard from "./pages/Dashboard"
import StudyZone from './pages/StudyZone';

import { Link } from 'react-router-dom';

const App = () => {
  return (
    <div>


      <BrowserRouter>
        <Link to='/'>Home</Link>
        --
        <Link to='/studyzone'>Studyzone</Link>
        
        <Routes>
          <Route path="/" element={ <Dashboard/> } />
          <Route path="/Studyzone" element={ <StudyZone/> } />
        </Routes>

      </BrowserRouter>

    </div>
  )
}

export default App