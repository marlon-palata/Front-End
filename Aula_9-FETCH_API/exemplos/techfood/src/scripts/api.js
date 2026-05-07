/* ==========================================================
   API.JS — Camada de comunicação com o servidor.            NEW

   ROADMAP DESTE ARQUIVO:
   [✔] Aula 9  — Criado: todas as chamadas fetch centralizadas aqui.
                 Se a URL do servidor mudar, alteramos só uma linha —
                 o resto do projeto não muda nada.

   Carregado ANTES de main.js e pedidos.js em todos os HTMLs.
   ========================================================== */

// ─────────────────────────────────────────────────────────────────────────────
// BASE_URL — endereço do servidor Node.js
// Centralizar aqui evita repetir a URL em vários arquivos.
// Em produção, trocar por "https://api.techfood.com" sem mexer em mais nada.
// ─────────────────────────────────────────────────────────────────────────────
var BASE_URL = "http://localhost:3000";

// ─────────────────────────────────────────────────────────────────────────────
// buscarProdutos()
// GET /produtos — retorna a lista de pratos do banco de dados.
//
// async/await vs .then():
//   Funcionam igual. async/await parece código síncrono mas não trava a página.
//   É o padrão moderno — mais legível, mais fácil de depurar.
//
// response.ok: verifica se o status HTTP é 2xx (sucesso).
//   Se não for (ex: 404, 500), lança um erro para o catch tratar.
// ─────────────────────────────────────────────────────────────────────────────
async function buscarProdutos() {
  var response = await fetch(BASE_URL + "/produtos");
  if (!response.ok)
    throw new Error("Erro ao buscar produtos: " + response.status);
  return await response.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// criarPedido(cliente, itens)
// POST /pedidos — envia um novo pedido para o servidor.
//
// O back-end exige produto_id e quantidade — não o nome nem o preço.
// Preço nunca vem do front-end: o servidor busca no banco para evitar
// que alguém manipule o valor antes de enviar.
//
// headers: { "Content-Type": "application/json" } avisa o servidor
//   que o corpo da requisição é JSON — sem isso ele não consegue ler.
// JSON.stringify converte o objeto JS em texto JSON para enviar.
// ─────────────────────────────────────────────────────────────────────────────
async function criarPedido(cliente, itens) {
  var response = await fetch(BASE_URL + "/pedidos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cliente: cliente, itens: itens }),
  });
  if (!response.ok) throw new Error("Erro ao criar pedido: " + response.status);
  return await response.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// buscarPedidos()
// GET /pedidos — retorna todos os pedidos do banco (para o painel da cozinha).
// ─────────────────────────────────────────────────────────────────────────────
async function buscarPedidos() {
  var response = await fetch(BASE_URL + "/pedidos");
  if (!response.ok)
    throw new Error("Erro ao buscar pedidos: " + response.status);
  return await response.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// atualizarStatusPedido(id, novoStatus)
// PATCH /pedidos/:id/status — avança o status de um pedido na cozinha.
//
// PATCH vs PUT:
//   PUT substitui o recurso inteiro. PATCH atualiza só um campo.
//   Aqui só o status muda — PATCH é a escolha certa.
// ─────────────────────────────────────────────────────────────────────────────
async function atualizarStatusPedido(id, novoStatus) {
  var response = await fetch(BASE_URL + "/pedidos/" + id + "/status", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: novoStatus }),
  });
  if (!response.ok)
    throw new Error("Erro ao atualizar status: " + response.status);
  return await response.json();
}
