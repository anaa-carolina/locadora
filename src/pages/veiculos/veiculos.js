import React, { useEffect, useState } from 'react';
import './veiculos.css';
import Header from '../../components/Header/Header.js';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || "";

export default function MeusVeiculos() {
  const [veiculos, setVeiculos] = useState([]);

  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [placa, setPlaca] = useState('');
  const [precoPorDia, setPrecoPorDia] = useState('');

  useEffect(() => {
    fetchVeiculos();
  }, []);

  const fetchVeiculos = async () => {
    const id_cliente = localStorage.getItem('id_cliente');
    if (!id_cliente) return;

    try {
      const response = await axios.get(`${API_URL}/api/meus-veiculos?id_cliente=${id_cliente}`);
      setVeiculos(response.data);
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este veículo?')) return;

    try {
      await axios.delete(`${API_URL}/api/veiculos/${id}`);
      setVeiculos(veiculos.filter(v => v.id !== id));
      alert('Veículo excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
      alert('Erro ao excluir veículo.');
    }
  };

  const handleAdicionarVeiculo = async (e) => {
    e.preventDefault();
    const id_cliente = localStorage.getItem('id_cliente');
    if (!id_cliente) {
      alert('Usuário não autenticado.');
      return;
    }

    // Validação básica
    if (!marca || !modelo || !ano || !placa || !precoPorDia) {
      alert('Preencha todos os campos.');
      return;
    }

    if (ano < 1900 || ano > new Date().getFullYear()) {
      alert('Ano inválido.');
      return;
    }

    if (precoPorDia <= 0) {
      alert('Preço por dia deve ser maior que zero.');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/veiculos`, {
        marca,
        modelo,
        ano,
        placa,
        precoPorDia,
        disponivel: true,
        id_cliente
      });

      alert('Veículo cadastrado com sucesso!');
      setMarca('');
      setModelo('');
      setAno('');
      setPlaca('');
      setPrecoPorDia('');
      fetchVeiculos();
    } catch (error) {
      console.error('Erro ao cadastrar veículo:', error);
      alert('Erro ao cadastrar veículo. Verifique se a placa já está cadastrada.');
    }
  };

  return (
    <>
      <Header />
      <div className="veiculos-container">
        <main className="veiculos-content">
          <h2>Meus Veículos</h2>

          <form className="form-veiculo" onSubmit={handleAdicionarVeiculo}>
            <input type="text" placeholder="Marca" value={marca} onChange={(e) => setMarca(e.target.value)} required />
            <input type="text" placeholder="Modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} required />
            <input type="number" placeholder="Ano" value={ano} onChange={(e) => setAno(e.target.value)} required />
            <input type="text" placeholder="Placa" value={placa} onChange={(e) => setPlaca(e.target.value)} required />
            <input type="number" placeholder="Preço por dia" value={precoPorDia} onChange={(e) => setPrecoPorDia(e.target.value)} required />
            <button type="submit">Cadastrar Veículo</button>
          </form>

          {veiculos.length === 0 ? (
            <p>Nenhum veículo cadastrado.</p>
          ) : (
            veiculos.map((carro) => (
              <div key={carro.id} className="veiculo-card">
                <p><strong>Marca:</strong> {carro.marca}</p>
                <p><strong>Modelo:</strong> {carro.modelo}</p>
                <p><strong>Ano:</strong> {carro.ano}</p>
                <p><strong>Placa:</strong> {carro.placa}</p>
                <p><strong>Preço por dia:</strong> R$ {carro.precoPorDia}</p>
                <p><strong>Disponível:</strong> {carro.disponivel ? 'Sim' : 'Não'}</p>
                <div className="acoes-veiculo">
                  <Link to={`/editar-veiculo/${carro.id}`} className="editar-veiculo">Editar</Link>
                  <button onClick={() => handleDelete(carro.id)} className="excluir-veiculo">Excluir</button>
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </>
  );
}
