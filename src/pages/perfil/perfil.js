import React, { useEffect, useState } from 'react';
import './perfil.css';
import Header from '../../components/Header/Header.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: ''
  });
  const [locacoes, setLocacoes] = useState([]);
  const [editando, setEditando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const id_cliente = localStorage.getItem('id_cliente');
    if (!id_cliente) {
      navigate('/');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/perfil?id_cliente=${id_cliente}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
      }
    };

    const fetchLocacoes = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/locacoes-cliente?id_cliente=${id_cliente}`);
        setLocacoes(response.data);
      } catch (error) {
        console.error('Erro ao buscar locações:', error);
      }
    };

    fetchProfile();
    fetchLocacoes();
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    const { nome, email, telefone, endereco } = profile;

    // Validação básica
    if (!nome || !email || !telefone || !endereco) {
      alert('Preencha todos os campos.');
      return;
    }

    try {
      const id_cliente = localStorage.getItem('id_cliente');
      await axios.put(`${API_URL}/api/editar-perfil/${id_cliente}`, profile);
      alert('Perfil atualizado com sucesso!');
      setEditando(false);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      alert('Erro ao salvar perfil.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('id_cliente');
    localStorage.removeItem('nome_cliente');
    navigate('/');
  };

  const handleExcluirPerfil = async () => {
    const id_cliente = localStorage.getItem('id_cliente');
    if (!window.confirm('Tem certeza que deseja excluir seu perfil? Essa ação não pode ser desfeita.')) return;

    try {
      await axios.delete(`${API_URL}/api/excluir-perfil/${id_cliente}`);
      localStorage.clear();
      alert('Perfil excluído com sucesso.');
      navigate('/');
    } catch (error) {
      console.error('Erro ao excluir perfil:', error);
      alert('Erro ao excluir perfil.');
    }
  };

  return (
    <>
      <Header />
      <div className="profile-container">
        <main className="main-content">
          <div className="profile-header">
            <div className="info-section">
              <h1>{profile.nome}</h1>
            </div>
          </div>

          <section className="focus-section">
            <h3>{editando ? 'Edite seu perfil' : 'Atualize seu perfil!'}</h3>
            <div className="info-box">
              <label>Nome:</label>
              <input
                type="text"
                name="nome"
                value={profile.nome}
                onChange={handleChange}
                disabled={!editando}
              />
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!editando}
              />
              <label>Telefone:</label>
              <input
                type="text"
                name="telefone"
                value={profile.telefone}
                onChange={handleChange}
                disabled={!editando}
              />
              <label>Endereço:</label>
              <input
                type="text"
                name="endereco"
                value={profile.endereco}
                onChange={handleChange}
                disabled={!editando}
              />
            </div>
            {editando ? (
              <button className="edit-profile-button" onClick={handleSalvar}>
                Salvar alterações
              </button>
            ) : (
              <button className="edit-profile-button" onClick={() => setEditando(true)}>
                Editar perfil
              </button>
            )}

            <button className="logout-button" onClick={handleLogout}>
              Sair da conta
            </button>
            <button className="delete-button" onClick={handleExcluirPerfil}>
              Excluir perfil
            </button>
          </section>

          <section className="history-section">
            <h3>Histórico de Locações</h3>
            {locacoes.length === 0 ? (
              <p>Você ainda não realizou nenhuma locação.</p>
            ) : (
              <ul className="locacoes-list">
                {locacoes.map((locacao) => (
                  <li key={locacao.id} className="locacao-item">
                    <p><strong>Veículo:</strong> {locacao.veiculo.modelo} ({locacao.veiculo.placa})</p>
                    <p><strong>Início:</strong> {new Date(locacao.inicio).toLocaleString()}</p>
                    <p><strong>Fim:</strong> {new Date(locacao.fim).toLocaleString()}</p>
                    <p><strong>Valor:</strong> R$ {locacao.valor}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
