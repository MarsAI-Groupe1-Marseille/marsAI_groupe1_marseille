import { useState, useEffect } from 'react'
import axios from 'axios'
import { Routes, Route } from 'react-router-dom';  
import Home from './pages/home.jsx';
import Galerie from './pages/galerie.jsx';
import Login from './pages/login.jsx';
import FilmDetail from './pages/film_detail.jsx';
import Dashboard from './pages/dashboard.jsx';
import DashboardUser from './pages/dashboardUser.jsx';
import GestionFilms from './pages/gestion_film.jsx';
import './App.css'
import SubmissionForm from './pages/SubmissionForm.jsx';
import Forgotpass from './pages/forgotpass.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import NotationJury  from './pages/NotationJury.jsx';


function App() { 

  return (
    
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/galerie" element={<Galerie />} />
          <Route path="/galerie/:id" element={<FilmDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path='/submission' element ={<SubmissionForm/>}/>
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgotpass" element={<Forgotpass />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboardUser" element={<DashboardUser />} />
          <Route path="/notationjury/:id" element={<NotationJury />} />
          <Route path="/gestion-films" element={<GestionFilms />} />

        </Routes>

        
      </div>
    
  )
}

export default App
