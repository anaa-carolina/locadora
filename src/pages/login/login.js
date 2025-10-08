import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../components/container.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validação básica
    if (!email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        email,
        senha
      });

      localStorage.setItem('id_cliente', response.data.id);
      localStorage.setItem('nome_cliente', response.data.nome);
      navigate('/home');
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      setErro('Email ou senha inválidos.');
    }
  };

  return (
    <div className="background-page">
      <div className="login-container">
        <div className="logo">
          <div className="logo1">Car</div>
          <div className="logo2">|</div>
          <div className="logo3">Now</div>
        </div>

        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
        </form>
        {erro && <p className="erro-login">{erro}</p>}
        <p>
          Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
