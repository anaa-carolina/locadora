import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: 'server-bd-cn1.mysql.database.azure.com',
    user: 'useradmin@server-bd-cn1',
    password: 'admin@123',
    database: 'anacarolina',
    port: 3306,
    ssl: {
        rejectUnauthorized: false
    }
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err);
        return;
    }
    console.log('Conectado ao banco de dados!');
});



export default connection;
