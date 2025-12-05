const pool = require('./configs/db');

async function testConnection() {
    try {
        const [rows] = await pool.query('SELECT NOW() AS data_atual');
        console.log(
            '✅ Conexão bem-sucedida! Data atual do MySQL:',
            rows[0].data_atual,
        );
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco de dados:', error);
    }
}

testConnection();
