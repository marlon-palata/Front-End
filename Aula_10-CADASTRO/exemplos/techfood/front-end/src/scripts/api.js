/* ==========================================================
   API.JS — Camada de comunicação com o servidor.

   ROADMAP DESTE ARQUIVO:
   [✔] Aula 9  — buscarProdutos(), criarPedido(), buscarPedidos(),
                 deletarPedido(), atualizarStatusPedido().
                 BASE_URL centralizada. Padrão dados.erro do servidor.
   [✔] Aula 10 — buscarProdutoPorId(id) — GET /produtos/:id.
                 cadastrarProduto(dados)  — POST /produtos.
                 editarProduto(id, dados) — PUT /produtos/:id.
                 excluirProduto(id)       — DELETE /produtos/:id.
   [ ] Futuro  — uploadImagem(id, arquivo) — POST /produtos/:id/imagem
                 (multipart/form-data, quando integrar o campo de foto).

   Carregado ANTES de main.js, pedidos.js e cadastro.js em todos os HTMLs.
   ========================================================== */

// ─────────────────────────────────────────────────────────────────────────────
// BASE_URL — endereço do servidor Node.js
//
// ⚠ CORS — se aparecer no console:
//   "Access to fetch at 'http://localhost:3000/...' has been blocked by CORS policy"
//   Problema está no SERVIDOR (app.use(cors()) em app.js), nunca no front-end.
// ─────────────────────────────────────────────────────────────────────────────
const BASE_URL = "http://localhost:3000";

// ─────────────────────────────────────────────────────────────────────────────
// buscarProdutos()
// GET /produtos — retorna todos os pratos do banco.
//
// Padrão: ler JSON antes de response.ok → usa a mensagem de erro do servidor.
//
//   Forma antiga com .then():
//   function buscarProdutos() {
//     return fetch(BASE_URL + "/produtos")
//       .then(function(res)   { return res.json(); })
//       .then(function(dados) {
//         if (!dados.sucesso) throw new Error(dados.erro);
//         return dados.dados;
//       });
//   }
// ─────────────────────────────────────────────────────────────────────────────
async function buscarProdutos() {
  const response = await fetch(`${BASE_URL}/produtos`);
  const dados = await response.json();
  if (!response.ok) throw new Error(dados.erro || `Erro ${response.status}`);
  return dados.dados;
}

// ─────────────────────────────────────────────────────────────────────────────
// buscarProdutoPorId(id)                                                  NEW
// GET /produtos/:id — retorna um único prato pelo ID.
//   Usado por editarPrato() em cadastro.js para preencher o formulário.
// ─────────────────────────────────────────────────────────────────────────────
async function buscarProdutoPorId(id) {
  const response = await fetch(`${BASE_URL}/produtos/${id}`);
  const dados = await response.json();
  if (!response.ok) throw new Error(dados.mensagem || dados.erro || `Erro ${response.status}`);
  return dados.dados;
}

// ─────────────────────────────────────────────────────────────────────────────
// cadastrarProduto(dados)                                                 NEW
// POST /produtos — cadastra um novo prato no banco.
//
// O servidor espera: { nome, descricao, preco (number), categoria, disponivel (boolean) }
// ─────────────────────────────────────────────────────────────────────────────
async function cadastrarProduto(dados) {
  const response = await fetch(`${BASE_URL}/produtos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  const resultado = await response.json();
  if (!response.ok) throw new Error(resultado.mensagem || resultado.erro || `Erro ${response.status}`);
  return resultado;
}

// ─────────────────────────────────────────────────────────────────────────────
// editarProduto(id, dados)                                                NEW
// PUT /produtos/:id — atualiza todos os campos de um prato existente.
//
// PUT vs PATCH:
//   PUT = substitui o recurso inteiro (formulário sempre envia tudo).
//   PATCH = atualiza só campos enviados (usado para status de pedido).
// ─────────────────────────────────────────────────────────────────────────────
async function editarProduto(id, dados) {
  const response = await fetch(`${BASE_URL}/produtos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  const resultado = await response.json();
  if (!response.ok) throw new Error(resultado.mensagem || resultado.erro || `Erro ${response.status}`);
  return resultado;
}

// ─────────────────────────────────────────────────────────────────────────────
// excluirProduto(id)                                                      NEW
// DELETE /produtos/:id — remove permanentemente um prato do banco.
//   Chamado por excluirPrato() em cadastro.js após confirmação no modal.
// ─────────────────────────────────────────────────────────────────────────────
async function excluirProduto(id) {
  const response = await fetch(`${BASE_URL}/produtos/${id}`, {
    method: "DELETE",
  });
  const resultado = await response.json();
  if (!response.ok) throw new Error(resultado.mensagem || resultado.erro || `Erro ${response.status}`);
  return resultado;
}

// ─────────────────────────────────────────────────────────────────────────────
// criarPedido(cliente, itens)
// POST /pedidos — envia pedido ao servidor.
// ─────────────────────────────────────────────────────────────────────────────
async function criarPedido(cliente, itens) {
  const response = await fetch(`${BASE_URL}/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cliente, itens }),
  });
  const dados = await response.json();
  if (!response.ok) throw new Error(dados.erro || `Erro ${response.status}`);
  return dados;
}

// ─────────────────────────────────────────────────────────────────────────────
// buscarPedidos()
// GET /pedidos — todos os pedidos (painel da cozinha).
// ─────────────────────────────────────────────────────────────────────────────
async function buscarPedidos() {
  const response = await fetch(`${BASE_URL}/pedidos`);
  const dados = await response.json();
  if (!response.ok) throw new Error(dados.erro || `Erro ${response.status}`);
  return dados;
}

// ─────────────────────────────────────────────────────────────────────────────
// deletarPedido(id)
// DELETE /pedidos/:id
// ─────────────────────────────────────────────────────────────────────────────
async function deletarPedido(id) {
  const response = await fetch(`${BASE_URL}/pedidos/${id}`, { method: "DELETE" });
  const dados = await response.json();
  if (!response.ok) throw new Error(dados.erro || `Erro ${response.status}`);
  return dados;
}

// ─────────────────────────────────────────────────────────────────────────────
// atualizarStatusPedido(id, novoStatus)
// PATCH /pedidos/:id/status — avança o status na cozinha.
// ─────────────────────────────────────────────────────────────────────────────
async function atualizarStatusPedido(id, novoStatus) {
  const response = await fetch(`${BASE_URL}/pedidos/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: novoStatus }),
  });
  const dados = await response.json();
  if (!response.ok) throw new Error(dados.erro || `Erro ${response.status}`);
  return dados;
}
