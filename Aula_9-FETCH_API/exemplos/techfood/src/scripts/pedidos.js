/* ==========================================================
   PEDIDOS.JS — Painel da Cozinha (pedidos.html)

   ROADMAP DESTE ARQUIVO:
   [✔] Aula 8  — renderizarPedidos() lia do localStorage.
   [✔] Aula 9  — renderizarPedidos() → GET /pedidos via api.js.
                 Painel da cozinha com status e atualização automática.
                 localStorage não é mais usado aqui.
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  renderizarPedidos();

  // setInterval: executa a função repetidamente a cada 30 segundos.
  // Novos pedidos aparecem sem precisar recarregar a página.
  setInterval(renderizarPedidos, 30000);
});


// ─────────────────────────────────────────────────────────────────────────────
// renderizarPedidos()
// Aula 8: lia "techfood_pedidos" do localStorage e montava a lista.
//
// Aula 9: busca via GET /pedidos do api.js — dados reais do banco.
//   Cada pedido mostra status e botão para avançar o fluxo da cozinha.
//   createElement + appendChild — Aula 7, mesma técnica, novo contexto.
// ─────────────────────────────────────────────────────────────────────────────
async function renderizarPedidos() {
  var lista     = document.querySelector("#lista-pedidos");
  var spanTotal = document.querySelector("#valor-total");
  if (!lista) return;

  try {
    var resposta = await buscarPedidos();
    var pedidos  = resposta.dados || resposta;

    if (!pedidos || pedidos.length === 0) {
      lista.innerHTML = "<li class='pedido-vazio'>Nenhum pedido ainda. 😊</li>";
      if (spanTotal) spanTotal.textContent = "R$ 0,00";
      return;
    }

    lista.innerHTML = "";
    var totalGeral  = 0;

    pedidos.forEach(function (pedido) {
      var li = document.createElement("li");
      // classe de status aplicada para cor da borda lateral no CSS
      li.classList.add("item-pedido", "status-" + pedido.status);

      li.innerHTML =
        "<div class='pedido-info'>" +
          "<strong>#" + pedido.id + " — " + (pedido.cliente || "Cliente") + "</strong>" +
          "<span class='pedido-total'>R$ " +
            parseFloat(pedido.total).toFixed(2).replace(".", ",") +
          "</span>" +
        "</div>" +
        "<div class='pedido-status'>" +
          "<span class='badge-status badge-" + pedido.status + "'>" +
            pedido.status.toUpperCase() +
          "</span>" +
          gerarBotaoStatus(pedido.id, pedido.status) +
        "</div>";

      lista.appendChild(li);
      totalGeral += parseFloat(pedido.total);
    });

    if (spanTotal) {
      spanTotal.textContent = "R$ " + totalGeral.toFixed(2).replace(".", ",");
    }

  } catch (erro) {
    lista.innerHTML = "<li class='pedido-vazio erro'>Erro ao carregar pedidos. Verifique a conexão.</li>";
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// gerarBotaoStatus()
// Gera o botão do próximo status para cada pedido.
// O fluxo é linear — o cliente não volta atrás.
// Usa onclick inline porque o elemento é criado via innerHTML.
// ─────────────────────────────────────────────────────────────────────────────
function gerarBotaoStatus(pedidoId, statusAtual) {
  var proximo = {
    "pendente": { label: "▶ Iniciar preparo",    status: "preparo"  },
    "preparo":  { label: "✔ Marcar como pronto", status: "pronto"   },
    "pronto":   { label: "🛵 Marcar entregue",   status: "entregue" },
    "entregue": null
  };

  var acao = proximo[statusAtual];
  if (!acao) return "<span class='entregue-label'>✔ Concluído</span>";

  return "<button class='btn-status' onclick='avancarStatus(" +
    pedidoId + ", \"" + acao.status + "\")'>" +
    acao.label + "</button>";
}


// ─────────────────────────────────────────────────────────────────────────────
// avancarStatus()
// Chama atualizarStatusPedido() do api.js — PATCH /pedidos/:id/status.
// Após atualizar, re-renderiza o painel para refletir o novo status.
// ─────────────────────────────────────────────────────────────────────────────
async function avancarStatus(pedidoId, novoStatus) {
  try {
    await atualizarStatusPedido(pedidoId, novoStatus);
    renderizarPedidos();
  } catch (erro) {
    alert("Erro ao atualizar status: " + erro.message);
  }
}