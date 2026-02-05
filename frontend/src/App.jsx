import { useState, useEffect } from 'react'
import axios from 'axios'
import { Routes, Route } from 'react-router-dom';   
import Home from './pages/home.jsx';
import Galerie from './pages/galerie.jsx';
import Login from './pages/login.jsx';
import FilmDetail from './pages/film_detail.jsx';
import './App.css'

function App() { 
 

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/galerie" element={<Galerie />} />
        <Route path="/galerie/:id" element={<FilmDetail />} />
        <Route path="/login" element={<Login />} />
    </Routes>
      
    </div>
  )
}

export default App
