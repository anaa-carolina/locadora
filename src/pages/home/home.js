import React, { useEffect, useState } from 'react';
import './home.css';
import Header from '../../components/Header/Header.js';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "";

function Home() {
  const [veiculos, setVeiculos] = useState([]);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    async function fetchVeiculos() {
      try {
        const response = await axios.get(`${API_URL}/api/veiculos`);
        setVeiculos(response.data);
      } catch (error) {
        console.error('Erro ao buscar veículos:', error);
      }
    }

    fetchVeiculos();
  }, []);

  const veiculosFiltrados = veiculos.filter((v) => {
    const termo = busca.toLowerCase();
    return (
      v.marca?.toLowerCase().includes(termo) ||
      v.modelo?.toLowerCase().includes(termo) ||
      v.placa?.toLowerCase().includes(termo)
    );
  });

  const handleContratar = async (id_veiculo) => {
    const id_cliente = localStorage.getItem('id_cliente');
    if (!id_cliente) {
      alert('Você precisa estar logado para contratar um veículo.');
      return;
    }

    const hoje = new Date().toISOString().slice(0, 10);
    const fim = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);

    try {
      const veiculo = veiculos.find(v => v.id === id_veiculo);
      if (!veiculo || !veiculo.disponivel) {
        alert('Veículo indisponível.');
        return;
      }

      await axios.post(`${API_URL}/api/locacoes`, {
        id_veiculo,
        id_cliente,
        data_inicio: hoje,
        data_fim: fim,
        valor: 2 * veiculo.precoPorDia
      });

      alert('Locação realizada com sucesso!');
    } catch (error) {
      console.error('Erro ao contratar veículo:', error);
      alert('Erro ao contratar veículo.');
    }
  };

  return (
    <div>
      <Header onSearch={setBusca} />
      <div className="home-container">
        <h2>Todos os Veículos</h2>

        {veiculosFiltrados.length === 0 ? (
          <p>Nenhum veículo encontrado.</p>
        ) : (
          veiculosFiltrados.map((v) => (
            <div key={v.id} className="veiculo-card">
              <p><strong>Marca:</strong> {v.marca}</p>
              <p><strong>Modelo:</strong> {v.modelo}</p>
              <p><strong>Ano:</strong> {v.ano}</p>
              <p><strong>Placa:</strong> {v.placa}</p>
              <p><strong>Preço por dia:</strong> R$ {v.precoPorDia}</p>
              <p><strong>Disponível:</strong> {v.disponivel ? 'Sim' : 'Não'}</p>
              <button
                onClick={() => handleContratar(v.id)}
                className="contratar-btn"
                disabled={!v.disponivel}
              >
                {v.disponivel ? 'Contratar' : 'Indisponível'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
