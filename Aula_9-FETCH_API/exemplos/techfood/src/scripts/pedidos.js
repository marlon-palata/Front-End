/* ==========================================================
   PEDIDOS.JS — Meus Pedidos (pedidos.html)

   ROADMAP DESTE ARQUIVO:
   [✔] Aula 8  — renderizarPedidos() lia localStorage, configurarLimparPedidos()
   [✔] Aula 9  — configurarEnviarCozinha() adicionada: envia o carrinho
                 do localStorage para o banco via POST /pedidos (api.js).
                 Fluxo: "Pedir Agora" → localStorage → pedidos.html →
                 "Enviar para Cozinha" → API → banco de dados.
                 gerarBotaoStatus() e avancarStatus() são funções de referência
                 que demonstram PATCH — chamadas após o pedido ir para a cozinha.
   [ ] Futuro  — WebSocket para atualização em tempo real sem polling
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  renderizarPedidos();
  configurarLimparPedidos();
  configurarEnviarCozinha(); // NEW — envia carrinho para a API
});


// ─────────────────────────────────────────────────────────────────────────────
// renderizarPedidos()
// Aula 8: lia o array do localStorage e montava <li> com createElement.
//   Campos: { nome, preco, qtd, subtotal }
//
// Aula 9: mantém a mesma lógica de exibição (localStorage → DOM).
//   Diferença: campo renomeado qtd → quantidade para coincidir com o formato
//   que criarPedido() do api.js espera. Adicionado também produto_id.
//   O envio real à API acontece em configurarEnviarCozinha() abaixo.
// ─────────────────────────────────────────────────────────────────────────────
function renderizarPedidos() {
  var lista        = document.querySelector("#lista-pedidos");
  var spanTotal    = document.querySelector("#valor-total");
  var spanResumo   = document.querySelector("#valor-total-resumo");
  var spanContador = document.querySelector("#contador-itens");

  if (!lista) return;

  var pedidos = JSON.parse(localStorage.getItem("techfood_pedidos") || "[]");

  if (pedidos.length === 0) {
    lista.innerHTML =
      "<li class='pedido-vazio'>Nenhum item ainda. Acesse o " +
      "<a href='index.html'>Cardápio</a> para adicionar! 😊</li>";
    if (spanTotal)    spanTotal.textContent    = "R$ 0,00";
    if (spanResumo)   spanResumo.textContent   = "R$ 0,00";
    if (spanContador) spanContador.textContent = "0 itens";
    return;
  }

  lista.innerHTML = "";
  var total = 0;

  pedidos.forEach(function (pedido, indice) {
    // createElement + appendChild — Aula 7, mesmo padrão.
    var li = document.createElement("li");
    li.classList.add("item-pedido");

    var textoSpan = document.createElement("span");
    textoSpan.innerHTML =
      "<strong>" + pedido.nome + "</strong>" +
      " — " + pedido.quantidade + "x" +
      " R$ " + pedido.preco.toFixed(2).replace(".", ",") +
      " = <span class='subtotal-item'>R$ " +
      pedido.subtotal.toFixed(2).replace(".", ",") + "</span>";

    var btnRemover = document.createElement("button");
    btnRemover.textContent = "✕";
    btnRemover.classList.add("btn-remover-item");

    // remove do array pelo índice, salva e re-renderiza
    btnRemover.addEventListener("click", function () {
      var lista = JSON.parse(localStorage.getItem("techfood_pedidos") || "[]");
      lista.splice(indice, 1);
      localStorage.setItem("techfood_pedidos", JSON.stringify(lista));
      renderizarPedidos();
    });

    li.appendChild(textoSpan);
    li.appendChild(btnRemover);
    lista.appendChild(li);
    total += pedido.subtotal;
  });

  var totalFmt = "R$ " + total.toFixed(2).replace(".", ",");
  if (spanTotal)  spanTotal.textContent  = totalFmt;
  if (spanResumo) spanResumo.textContent = totalFmt;

  var totalItens = pedidos.reduce(function (acc, p) { return acc + p.quantidade; }, 0);
  if (spanContador) {
    spanContador.textContent = totalItens + (totalItens === 1 ? " item" : " itens");
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// configurarLimparPedidos()
// Aula 8: removeItem() limpa a chave do localStorage e re-renderiza.
// Aula 9: sem mudanças — o carrinho ainda mora no localStorage até ser enviado.
// ─────────────────────────────────────────────────────────────────────────────
function configurarLimparPedidos() {
  var btn = document.querySelector("#btn-limpar-pedidos");
  if (!btn) return;

  btn.addEventListener("click", function () {
    localStorage.removeItem("techfood_pedidos");
    renderizarPedidos();
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// configurarEnviarCozinha()                                               NEW
// Aula 9: pega todos os itens do localStorage e envia ao servidor de uma vez
//   via criarPedido() do api.js (POST /pedidos).
//
// Por que dois passos (localStorage → API)?
//   O cliente monta o pedido no cardápio (localStorage — Aula 8).
//   Só quando clica "Enviar para Cozinha" o pedido realmente vai ao banco.
//   Isso separa a montagem do pedido do envio — mais claro para ensinar.
//
// O servidor exige produto_id e quantidade — não o nome nem o preço.
//   Por isso salvamos produto_id no localStorage em main.js (diferença da Aula 8).
//   Preço: o back-end busca no banco, não confia no que vem do front.
//
// cliente vem do sessionStorage (global.js — solicitarNomeCliente).
//   || "Cliente" garante fallback se o modal não foi exibido (pedidos.html).
// ─────────────────────────────────────────────────────────────────────────────
function configurarEnviarCozinha() {
  var btn = document.querySelector("#btn-enviar-cozinha");
  if (!btn) return;

  btn.addEventListener("click", async function () {
    var pedidos = JSON.parse(localStorage.getItem("techfood_pedidos") || "[]");

    if (pedidos.length === 0) {
      alert("Adicione itens ao pedido antes de enviar!");
      return;
    }

    var cliente = sessionStorage.getItem("techfood_cliente") || "Cliente";

    // Monta o array de itens no formato que o back-end exige
    var itens = pedidos.map(function (p) {
      return { produto_id: p.produto_id, quantidade: p.quantidade };
    });

    btn.disabled = true;
    btn.textContent = "Enviando...";

    try {
      // criarPedido() no api.js — POST /pedidos
      await criarPedido(cliente, itens);

      // Sucesso: limpa o carrinho e atualiza a lista
      localStorage.removeItem("techfood_pedidos");
      renderizarPedidos();

      btn.textContent = "✓ Pedido Enviado!";
      btn.style.backgroundColor = "#27ae60";

      setTimeout(function () {
        btn.textContent = "🍳 Enviar para Cozinha";
        btn.style.backgroundColor = "";
        btn.disabled = false;
      }, 2500);

    } catch (erro) {
      // Erro de rede ou servidor — libera o botão para tentar de novo
      btn.textContent = "Erro! Tente novamente";
      btn.style.backgroundColor = "#e74c3c";
      btn.disabled = false;

      setTimeout(function () {
        btn.textContent = "🍳 Enviar para Cozinha";
        btn.style.backgroundColor = "";
      }, 2500);
    }
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// gerarBotaoStatus(pedidoId, statusAtual)
// Aula 9: referência de como o painel da cozinha avançaria o status.
//   Fluxo: pendente → preparo → pronto → entregue
//   Usa onclick inline porque é gerado dentro de innerHTML — não pode
//   usar addEventListener diretamente neste contexto.
// ─────────────────────────────────────────────────────────────────────────────
function gerarBotaoStatus(pedidoId, statusAtual) {
  var proximo = {
    pendente: { label: "▶ Iniciar preparo",       status: "preparo"   },
    preparo:  { label: "✓ Marcar como pronto",    status: "pronto"    },
    pronto:   { label: "🛵 Marcar entregue", status: "entregue"  },
    entregue: null,
  };

  var acao = proximo[statusAtual];
  if (!acao) return "<span class='entregue-label'>✓ Concluído</span>";

  return (
    "<button class='btn-status' onclick='avancarStatus(" +
    pedidoId + ", \"" + acao.status + "\")'>" +
    acao.label +
    "</button>"
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// avancarStatus(pedidoId, novoStatus)
// Aula 9: envia PATCH /pedidos/:id/status via atualizarStatusPedido() (api.js).
//   Chamada pelo onclick gerado em gerarBotaoStatus().
// ─────────────────────────────────────────────────────────────────────────────
async function avancarStatus(pedidoId, novoStatus) {
  try {
    await atualizarStatusPedido(pedidoId, novoStatus); // api.js — PATCH
    renderizarPedidos();
  } catch (erro) {
    alert("Erro ao atualizar status: " + erro.message);
  }
}
