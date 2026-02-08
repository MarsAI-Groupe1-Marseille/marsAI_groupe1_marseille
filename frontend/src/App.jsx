// import { useState, useEffect } from 'react'
// import axios from 'axios'
import { Routes, Route } from 'react-router-dom';   
import Home from './pages/home.jsx';
import Galerie from './pages/galerie.jsx';
import Login from './pages/login.jsx';
import FilmDetail from './pages/film_detail.jsx';
import Dashboard from './pages/dashboard.jsx';
import SubmissionForm from './pages/SubmissionForm.jsx';
import Header from './components/Header.jsx'; // Import du Header
// import Footer from './components/Footer.jsx'; // Import du Footer
import './App.css';

function App() { 
  return (
    <div className="App flex flex-col min-h-screen">
      <Header /> {/* S'affiche sur toutes les pages */}
      
      <main className="flex-grow App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/galerie" element={<Galerie />} />
          <Route path="/galerie/:id" element={<FilmDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path='/submission' element={<SubmissionForm/>}/>
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>

      {/* <Footer /> S'affiche sur toutes les pages */}
    </div>
  )
}

export default App;