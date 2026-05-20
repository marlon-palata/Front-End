const PedidoRepository = require('../repositories/PedidoRepository');
const ProdutoRepository = require('../repositories/ProdutoRepository');

class PedidoService {
    async criarPedido(pedidoData) {
        const { cliente, itens } = pedidoData;

        if (!itens || itens.length === 0) {
            throw new Error('O pedido deve conter ao menos um item.');
        }

        let totalCalculado = 0;
        const itensCompletos = [];

        for (const item of itens) {
            if (!item.produto_id || !item.quantidade || item.quantidade <= 0) {
                throw new Error('Cada item deve ter produto_id e quantidade maior que zero.');
            }

            const produto = await ProdutoRepository.findById(item.produto_id);
            if (!produto) {
                throw new Error(`Produto com ID ${item.produto_id} não encontrado.`);
            }

            if (!produto.disponivel) {
                throw new Error(`O produto ${produto.nome} está indisponível para pedidos.`);
            }

            const subtotal = produto.preco * item.quantidade;
            totalCalculado += subtotal;

            itensCompletos.push({
                produto_id: produto.id,
                quantidade: item.quantidade,
                preco_unitario: produto.preco
            });
        }

        const novoPedido = {
            cliente,
            status: 'pendente',
            total: totalCalculado
        };

        const pedidoId = await PedidoRepository.create(novoPedido, itensCompletos);
        return await PedidoRepository.findById(pedidoId);
    }

    async listarPedidos() {
        return await PedidoRepository.findAll();
    }

    async obterPedidoPorId(id) {
        const pedido = await PedidoRepository.findById(id);
        if (!pedido) {
            throw new Error('Pedido não encontrado.');
        }
        return pedido;
    }

    async atualizarStatus(id, novoStatus) {
        const statusValidos = ['pendente', 'preparo', 'pronto', 'entregue'];
        if (!statusValidos.includes(novoStatus)) {
            throw new Error(`Status inválido. Permitidos: ${statusValidos.join(', ')}`);
        }

        const pedidoExistente = await PedidoRepository.findById(id);
        if (!pedidoExistente) {
            throw new Error('Pedido não encontrado.');
        }

        const affectedRows = await PedidoRepository.update(id, { status: novoStatus });
        if (affectedRows === 0) {
            throw new Error('Não foi possível atualizar o status do pedido.');
        }
        return await PedidoRepository.findById(id);
    }

    async excluirPedido(id) {
        const pedidoExistente = await PedidoRepository.findById(id);
        if (!pedidoExistente) {
            throw new Error('Pedido não encontrado.');
        }

        const affectedRows = await PedidoRepository.delete(id);
        if (affectedRows === 0) {
            throw new Error('Falha ao excluir pedido.');
        }
    }
}

module.exports = new PedidoService();
