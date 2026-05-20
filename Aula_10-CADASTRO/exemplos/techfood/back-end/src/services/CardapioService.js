const CardapioRepository = require('../repositories/CardapioRepository');
const ProdutoRepository = require('../repositories/ProdutoRepository');

class CardapioService {
    async listarCardapios() {
        const cardapios = await CardapioRepository.findAll();
        return {
            sucesso: true,
            dados: cardapios,
            total: cardapios.length
        };
    }

    async buscarCardapioPorId(id) {
        if (!id || isNaN(id)) {
            throw { status: 400, mensagem: "ID inválido" };
        }

        const cardapio = await CardapioRepository.findById(id);
        if (!cardapio) {
            throw { status: 404, mensagem: "Cardápio não encontrado" };
        }

        return {
            sucesso: true,
            dados: cardapio
        };
    }

    async cadastrarCardapio(dados) {
        const { nome, descricao, disponivel, produtos } = dados;

        if (!nome) {
            throw { status: 400, mensagem: "O nome do cardápio é obrigatório" };
        }

        if (!produtos || !Array.isArray(produtos) || produtos.length === 0) {
            throw { status: 400, mensagem: "O cardápio deve conter pelo menos um produto vinculado no formato de array de IDs (ex: [1, 2, 3])" };
        }

        // Valida se todos os produtos realmente existem e remove duplicados usando Set
        const produtosUnicos = [...new Set(produtos)];
        for (const produtoId of produtosUnicos) {
            const produtoExistente = await ProdutoRepository.findById(produtoId);
            if (!produtoExistente) {
                throw { status: 404, mensagem: `Produto com ID ${produtoId} não encontrado. Cadastro de cardápio cancelado.` };
            }
        }

        const novoCardapio = {
            nome: nome.trim(),
            descricao: descricao ? descricao.trim() : null,
            disponivel: disponivel ?? true
        };

        const id = await CardapioRepository.create(novoCardapio, produtosUnicos);

        return {
            sucesso: true,
            mensagem: "Cardápio cadastrado com sucesso",
            id
        };
    }

    async deletarCardapio(id) {
        if (!id || isNaN(id)) {
            throw { status: 400, mensagem: "ID inválido" };
        }

        const existe = await CardapioRepository.findById(id);
        if (!existe) {
            throw { status: 404, mensagem: "Cardápio não encontrado" };
        }

        await CardapioRepository.delete(id);

        return {
            sucesso: true,
            mensagem: "Cardápio apagado com sucesso"
        };
    }
}

module.exports = new CardapioService();
