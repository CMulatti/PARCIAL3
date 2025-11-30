import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './freelancer.css'
import NavBar from './components/NavBar.jsx'
import Home from './pages/Home.jsx'
import Detail from './pages/Detail.jsx'
import Admin from './pages/Admin.jsx'
import DatosCuriosos from './pages/DatosCuriosos.jsx'
import SobreNosotros from './pages/SobreNosotros.jsx'
import { useBirds } from './hooks/useBirds.js'
import { useSightings } from './hooks/useSightings.js'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'


function App() {
  const { birds, addBird } = useBirds() //we call the hook which returns and object {birds, addBird}, so here we extract both values and now 'birds' and 'addBird' are available as variables in App.jsx's scope
  const { getSightingsForBird, addSighting, toggleLike } = useSightings() 

  return (
    <Router>
      <NavBar />
      <Routes>
        {/* PUBLIC ROUTES*/}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home birds={birds} />} />
        <Route path="/bird/:birdId" element={<Detail
         birds={birds} getSightingsForBird={getSightingsForBird}
         onAddSighting={addSighting}
         onToggleLike={toggleLike} />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />}/>
        <Route path="/datos-curiosos" element={<DatosCuriosos />}/>
        
        {/* PROTECTED ROUTES*/}
        {/*admin panel (admin only) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <Admin birds={birds} onAddBird={addBird} />
            </ProtectedRoute>
          } 
        />
        
        {/*Catch all -redirect to home */}
        <Route path="*" element={<Home birds={birds} />} />
      </Routes>
    </Router>
  )
}

export default App