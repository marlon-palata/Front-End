const pool = require('../config/database');

class ProdutoRepository {
    async findAll() {
        const [rows] = await pool.query('SELECT * FROM produto ORDER BY id DESC');
        return rows;
    }

    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM produto WHERE id = ?', [id]);
        return rows[0];
    }

    async create(produtoData) {
        const { nome, descricao, preco, categoria, disponivel } = produtoData;
        const [result] = await pool.query(
            'INSERT INTO produto (nome, descricao, preco, categoria, disponivel) VALUES (?, ?, ?, ?, ?)',
            [nome, descricao, preco, categoria, disponivel]
        );
        return result.insertId;
    }

    async update(id, produtoData) {
        const fields = [];
        const values = [];
        for (const [key, value] of Object.entries(produtoData)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
        if (fields.length === 0) return null;

        values.push(id);
        const query = `UPDATE produto SET ${fields.join(', ')} WHERE id = ?`;
        const [result] = await pool.query(query, values);
        return result.affectedRows;
    }

    async delete(id) {
        const [result] = await pool.query('DELETE FROM produto WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = new ProdutoRepository();
