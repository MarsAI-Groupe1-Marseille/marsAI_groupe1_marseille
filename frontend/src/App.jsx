import { useState, useEffect } from 'react'
import axios from 'axios'
import { Routes, Route } from 'react-router-dom';   
import Home from './pages/home.jsx';
import Galerie from './pages/galerie.jsx';
import Login from './pages/login.jsx';
import FilmDetail from './pages/film_detail.jsx';
import Dashboard from './pages/dashboard.jsx';
import './App.css'
import SubmissionForm from './pages/SubmissionForm.jsx';

function App() { 

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/galerie" element={<Galerie />} />
        <Route path="/galerie/:id" element={<FilmDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path='/submission' element ={<SubmissionForm/>}/>

        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>

      
    </div>
  )
}

export default App
