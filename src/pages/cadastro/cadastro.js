import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../components/container.css';

const API_URL = process.env.REACT_APP_API_URL || "";

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [erro, setErro] = useState('');

  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();

    // Validação básica
    if (!nome || !email || !senha || !telefone || !endereco) {
      setErro('Preencha todos os campos.');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/clientes`, {
        nome,
        email,
        senha,
        telefone,
        endereco
      });

      alert('Cadastro realizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setErro('Erro ao cadastrar. Verifique se o email já está em uso.');
    }
  };

  return (
    <div className='background-page'>
      <div className="cadastro-container">
        <h2>Cadastro</h2>
        <form onSubmit={handleCadastro}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
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
          <input
            type="text"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Endereço"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            required
          />

          <button type="submit">Cadastrar</button>
        </form>
        {erro && <p className="erro-cadastro">{erro}</p>}
        <p>
          Já tem conta? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Cadastro;
