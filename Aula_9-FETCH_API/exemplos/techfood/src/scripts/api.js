/* ==========================================================
   API.JS — Comunicação com o Back-End

   ROADMAP DESTE ARQUIVO:
   [✔] Aula 9  — Criado: centraliza todas as chamadas fetch.
                 Nenhum outro arquivo faz fetch diretamente.
                 Se a URL mudar, alteramos só API_URL aqui.
   [ ] Aula 10 — cadastrarProduto() → POST /produtos
   ========================================================== */

// URL base do servidor — alterar aqui se mudar de ambiente
const API_URL = "http://localhost:3000";


// ─────────────────────────────────────────────────────────────────────────────
// requisitar()
// Função base usada por todas as outras internamente.
//
// await fetch(): faz a requisição e espera a resposta
// await .json(): converte a resposta de string para objeto JavaScript
// response.ok: true para status 200-299 — fetch NÃO lança erro em 404/500
// try/catch: captura falhas de rede (servidor offline, sem internet)
// ─────────────────────────────────────────────────────────────────────────────
async function requisitar(endpoint, opcoes) {
  try {
    const response = await fetch(API_URL + endpoint, opcoes);
    const dados    = await response.json();

    if (!response.ok) {
      throw new Error(dados.erro || "Erro desconhecido na API");
    }

    return dados;

  } catch (erro) {
    console.error("Erro na requisição para " + endpoint + ":", erro.message);
    throw erro;
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// buscarProdutos()
// GET /produtos — carrega todos os pratos disponíveis.
// O back-end retorna { sucesso, dados: [...], total }.
// Retornamos só o array "dados".
// ─────────────────────────────────────────────────────────────────────────────
async function buscarProdutos() {
  const resposta = await requisitar("/produtos");
  return resposta.dados;
}


// ─────────────────────────────────────────────────────────────────────────────
// criarPedido()
// POST /pedidos — envia o pedido para a cozinha.
//
// O back-end exige: { cliente, itens: [{ produto_id, quantidade }] }
// O total é calculado pelo back-end — nunca enviamos o preço do front
// para evitar manipulação de valor pelo cliente.
//
// method "POST": cria um novo recurso no servidor
// Content-Type: informa ao servidor que o body está em formato JSON
// JSON.stringify: converte o objeto para string — único formato aceito no body
// ─────────────────────────────────────────────────────────────────────────────
async function criarPedido(cliente, itens) {
  return await requisitar("/pedidos", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ cliente, itens })
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// buscarPedidos()
// GET /pedidos — lista todos os pedidos para o painel da cozinha.
// ─────────────────────────────────────────────────────────────────────────────
async function buscarPedidos() {
  return await requisitar("/pedidos");
}


// ─────────────────────────────────────────────────────────────────────────────
// atualizarStatusPedido()
// PATCH /pedidos/:id/status — avança o status do pedido.
//
// PATCH é para atualização parcial — só o status, não o pedido inteiro.
// PUT atualizaria o recurso inteiro — aqui não é o caso.
// Fluxo: "pendente" → "preparo" → "pronto" → "entregue"
// ─────────────────────────────────────────────────────────────────────────────
async function atualizarStatusPedido(id, status) {
  return await requisitar("/pedidos/" + id + "/status", {
    method:  "PATCH",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ status })
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// [ ] Aula 10 — cadastrarProduto()
// POST /produtos — cadastra novo prato via formulário do cadastro.html
// ─────────────────────────────────────────────────────────────────────────────
//
// async function cadastrarProduto(dados) {
//   return await requisitar("/produtos", {
//     method:  "POST",
//     headers: { "Content-Type": "application/json" },
//     body:    JSON.stringify(dados)
//   });
// }