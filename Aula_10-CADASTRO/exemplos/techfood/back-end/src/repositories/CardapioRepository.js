const pool = require('../config/database');

class CardapioRepository {
    async findAll() {
        const [rows] = await pool.query('SELECT * FROM cardapio ORDER BY id DESC');
        return rows;
    }

    async findById(id) {
        const [cardapioRows] = await pool.query('SELECT * FROM cardapio WHERE id = ?', [id]);
        if (cardapioRows.length === 0) return null;

        const cardapio = cardapioRows[0];

        const [produtos] = await pool.query(`
            SELECT p.* FROM produto p
            INNER JOIN cardapio_produto cp ON p.id = cp.produto_id
            WHERE cp.cardapio_id = ?
        `, [id]);

        cardapio.produtos = produtos;
        return cardapio;
    }

    async create(cardapioData, produtosIds) {
        const { nome, descricao, disponivel } = cardapioData;
        const connection = await pool.getConnection(); // Obtém conexão exclusiva para a transação
        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                'INSERT INTO cardapio (nome, descricao, disponivel) VALUES (?, ?, ?)',
                [nome, descricao, disponivel]
            );
            const cardapioId = result.insertId;

            if (produtosIds && produtosIds.length > 0) {
                const values = produtosIds.map(id => [cardapioId, id]);
                await connection.query(
                    'INSERT INTO cardapio_produto (cardapio_id, produto_id) VALUES ?',
                    [values]
                );
            }

            await connection.commit();
            return cardapioId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async update(id, cardapioData) {
        const fields = [];
        const values = [];
        for (const [key, value] of Object.entries(cardapioData)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
        if (fields.length === 0) return null;

        values.push(id);
        const query = `UPDATE cardapio SET ${fields.join(', ')} WHERE id = ?`;
        const [result] = await pool.query(query, values);
        return result.affectedRows;
    }

    async delete(id) {
        const [result] = await pool.query('DELETE FROM cardapio WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = new CardapioRepository();
