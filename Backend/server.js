import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './db.js';

// Variáveis para caminho de arquivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API CarNow está rodando!');
});

// ----------------- CLIENTES -----------------

// Cadastrar cliente
app.post('/api/clientes', (req, res) => {
  const { nome, email, senha, telefone, endereco } = req.body;
  db.query(
    'INSERT INTO Clientes (nome, email, senha, telefone, endereco) VALUES (?, ?, ?, ?, ?)',
    [nome, email, senha, telefone, endereco],
    (err) => {
      if (err) return res.status(500).send('Erro ao cadastrar cliente.');
      res.send('Cliente cadastrado com sucesso!');
    }
  );
});

// Login
app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;
  db.query(
    'SELECT * FROM Clientes WHERE email = ? AND senha = ?',
    [email, senha],
    (err, results) => {
      if (err) return res.status(500).send('Erro ao realizar login.');
      if (results.length === 0) return res.status(401).send('Credenciais inválidas.');
      res.json({ id: results[0].id, nome: results[0].nome });
    }
  );
});

app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;
  console.log('Tentativa de login:', email, senha); // log útil
  db.query(
    'SELECT * FROM Clientes WHERE email = ? AND senha = ?',
    [email, senha],
    (err, results) => {
      if (err) {
        console.error('Erro SQL:', err);
        return res.status(500).send('Erro interno no servidor.');
      }
      if (results.length === 0) return res.status(401).send('Credenciais inválidas.');
      res.json({ id: results[0].id, nome: results[0].nome });
    }
  );
});

// Buscar perfil
app.get('/api/perfil', (req, res) => {
  const { id_cliente } = req.query;
  if (!id_cliente) return res.status(400).send('ID do cliente é obrigatório.');
  db.query(
    'SELECT id, nome, email, telefone, endereco FROM Clientes WHERE id = ?',
    [id_cliente],
    (err, results) => {
      if (err) return res.status(500).send('Erro ao buscar perfil.');
      if (results.length === 0) return res.status(404).send('Cliente não encontrado.');
      res.json(results[0]);
    }
  );
});


// Editar perfil
app.put('/api/editar-perfil/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, endereco } = req.body;
  db.query(
    'UPDATE Clientes SET nome = ?, email = ?, telefone = ?, endereco = ? WHERE id = ?',
    [nome, email, telefone, endereco, id],
    (err) => {
      if (err) return res.status(500).send('Erro ao atualizar perfil.');
      res.send('Perfil atualizado com sucesso!');
    }
  );
});

// Excluir perfil
app.delete('/api/excluir-perfil/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM Clientes WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send('Erro ao excluir perfil.');
    res.send('Perfil excluído com sucesso!');
  });
});

// ----------------- VEÍCULOS -----------------

// Buscar todos os veículos
app.get('/api/veiculos', (req, res) => {
  db.query('SELECT * FROM Veiculos', (err, results) => {
    if (err) return res.status(500).send('Erro ao buscar veículos.');
    res.json(results);
  });
});

// Buscar veículos de um cliente
app.get('/api/meus-veiculos', (req, res) => {
  const { id_cliente } = req.query;
  if (!id_cliente) return res.status(400).send('ID do cliente é obrigatório.');
  db.query('SELECT * FROM Veiculos WHERE id_cliente = ?', [id_cliente], (err, results) => {
    if (err) return res.status(500).send('Erro ao buscar veículos do cliente.');
    res.json(results);
  });
});

// Cadastrar veículo
app.post('/api/veiculos', (req, res) => {
  const { marca, modelo, ano, placa, disponivel, precoPorDia, id_cliente } = req.body;
  db.query(
    'INSERT INTO Veiculos (marca, modelo, ano, placa, disponivel, precoPorDia, id_cliente) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [marca, modelo, ano, placa, disponivel ?? true, precoPorDia, id_cliente],
    (err) => {
      if (err) return res.status(500).send('Erro ao cadastrar veículo.');
      res.send('Veículo cadastrado com sucesso!');
    }
  );
});

// Editar veículo
app.put('/api/veiculos/:id', (req, res) => {
  const { id } = req.params;
  const { marca, modelo, ano, placa, disponivel, precoPorDia } = req.body;
  db.query(
    'UPDATE Veiculos SET marca = ?, modelo = ?, ano = ?, placa = ?, disponivel = ?, precoPorDia = ? WHERE id = ?',
    [marca, modelo, ano, placa, disponivel, precoPorDia, id],
    (err) => {
      if (err) return res.status(500).send('Erro ao atualizar veículo.');
      res.send('Veículo atualizado com sucesso!');
    }
  );
});

// Excluir veículo
app.delete('/api/veiculos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM Veiculos WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send('Erro ao excluir veículo.');
    res.send('Veículo excluído com sucesso!');
  });
});

// ----------------- LOCAÇÕES -----------------

// Criar locação
app.post('/api/locacoes', (req, res) => {
  const { id_veiculo, id_cliente, data_inicio, data_fim, valor } = req.body;
  db.query(
    'INSERT INTO Locacoes (id_veiculo, id_cliente, data_inicio, data_fim, valor, status) VALUES (?, ?, ?, ?, ?, ?)',
    [id_veiculo, id_cliente, data_inicio, data_fim, valor, 'ativa'],
    (err) => {
      if (err) return res.status(500).send('Erro ao criar locação.');
      res.send('Locação criada com sucesso!');
    }
  );
});

// Buscar locações de um cliente
app.get('/api/locacoes-cliente', (req, res) => {
  const { id_cliente } = req.query;
  if (!id_cliente) return res.status(400).send('ID do cliente é obrigatório.');
  db.query(
    `SELECT L.id, L.data_inicio AS inicio, L.data_fim AS fim, L.valor, 
            V.modelo, V.placa 
     FROM Locacoes L 
     JOIN Veiculos V ON L.id_veiculo = V.id 
     WHERE L.id_cliente = ?`,
    [id_cliente],
    (err, results) => {
      if (err) return res.status(500).send('Erro ao buscar locações.');
      res.json(results.map(loc => ({
        id: loc.id,
        inicio: loc.inicio,
        fim: loc.fim,
        valor: loc.valor,
        veiculo: {
          modelo: loc.modelo,
          placa: loc.placa
        }
      })));
    }
  );
});

// ----------------- FRONTEND BUILD -----------------
app.use(express.static(path.join(__dirname, "../build")));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});


// ----------------- START SERVER -----------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
