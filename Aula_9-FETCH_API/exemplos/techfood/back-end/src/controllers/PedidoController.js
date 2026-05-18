const PedidoService = require('../services/PedidoService');

class PedidoController {
    async create(req, res) {
        try {
            const pedido = await PedidoService.criarPedido(req.body);
            res.status(201).json({
                mensagem: 'Pedido criado com sucesso',
                pedido
            });
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const pedidos = await PedidoService.listarPedidos();
            res.status(200).json(pedidos);
        } catch (error) {
            res.status(500).json({ erro: 'Erro ao buscar pedidos', detalhe: error.message });
        }
    }

    async getById(req, res) {
        try {
            const id = req.params.id;
            const pedido = await PedidoService.obterPedidoPorId(id);
            res.status(200).json(pedido);
        } catch (error) {
            res.status(404).json({ erro: error.message });
        }
    }

    async updateStatus(req, res) {
        try {
            const id = req.params.id;
            const { status } = req.body;
            
            if (!status) {
                return res.status(400).json({ erro: 'O campo status é obrigatório.' });
            }

            const pedidoAtualizado = await PedidoService.atualizarStatus(id, status);
            res.status(200).json({
                mensagem: 'Status atualizado com sucesso',
                pedido: pedidoAtualizado
            });
        } catch (error) {
            // Se for erro de validação é 400, se não encontrou é 404
            const code = error.message.includes('não encontrado') ? 404 : 400;
            res.status(code).json({ erro: error.message });
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;
            await PedidoService.excluirPedido(id);
            res.status(200).json({ mensagem: 'Pedido excluído com sucesso' });
        } catch (error) {
            const code = error.message.includes('não encontrado') ? 404 : 400;
            res.status(code).json({ erro: error.message });
        }
    }
}

module.exports = new PedidoController();
