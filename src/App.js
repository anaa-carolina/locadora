import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/login.js';
import Cadastro from './pages/cadastro/cadastro.js';
import Home from './pages/home/home.js';
import Perfil from './pages/perfil/perfil.js';
import Veiculos from './pages/veiculos/veiculos.js';
import './App.css';

function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/home" element={<Home />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/veiculos" element={<Veiculos />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
