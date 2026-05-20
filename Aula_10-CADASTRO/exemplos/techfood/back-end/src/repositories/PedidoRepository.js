const pool = require('../config/database');

class PedidoRepository {
    async findAll() {
        const [rows] = await pool.query('SELECT * FROM pedido ORDER BY criado_em DESC');
        return rows;
    }

    async findById(id) {
        // Busca o pedido
        const [pedidoRows] = await pool.query('SELECT * FROM pedido WHERE id = ?', [id]);
        if (pedidoRows.length === 0) return null;

        const pedido = pedidoRows[0];

        // Busca os itens do pedido com as informações do produto
        const [itensRows] = await pool.query(`
            SELECT ip.*, p.nome as produto_nome, p.descricao as produto_descricao 
            FROM item_pedido ip
            INNER JOIN produto p ON ip.produto_id = p.id
            WHERE ip.pedido_id = ?
        `, [id]);

        pedido.itens = itensRows;
        return pedido;
    }

    async create(pedidoData, itens) {
        const { cliente, status, total } = pedidoData;
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [pedidoResult] = await connection.query(
                'INSERT INTO pedido (cliente, status, total) VALUES (?, ?, ?)',
                [cliente || null, status || 'pendente', total]
            );
            const pedidoId = pedidoResult.insertId;

            if (itens && itens.length > 0) {
                const values = itens.map(item => [
                    pedidoId,
                    item.produto_id,
                    item.quantidade,
                    item.preco_unitario
                ]);

                await connection.query(
                    'INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES ?',
                    [values]
                );
            }

            await connection.commit();
            return pedidoId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async update(id, pedidoData) {
        const fields = [];
        const values = [];
        for (const [key, value] of Object.entries(pedidoData)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
        if (fields.length === 0) return null;

        values.push(id);
        const query = `UPDATE pedido SET ${fields.join(', ')} WHERE id = ?`;
        const [result] = await pool.query(query, values);
        return result.affectedRows;
    }

    async delete(id) {
        const [result] = await pool.query('DELETE FROM pedido WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = new PedidoRepository();
