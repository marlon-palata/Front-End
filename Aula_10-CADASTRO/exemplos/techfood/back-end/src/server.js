const app = require('./app');
const pool = require('./config/database');

const PORT = process.env.PORT || 3000;

// Testando conexão de forma assíncrona com Promises e iniciando o servidor
async function startServer() {
    try {
        const connection = await pool.getConnection();
        console.log("Conexão com MySQL estabelecida! ✔️");
        connection.release();

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT} 🚀`);
            console.log(`Rotas MVC ativas e escutando!`);
        });
    } catch (err) {
        console.error("Erro fatal ao conectar ao banco de dados:", err);
        process.exit(1);
    }
}

startServer();