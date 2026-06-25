/* ==========================================================
   PEDIDOS.JS — Meus Pedidos (pedidos.html)

   ROADMAP DESTE ARQUIVO:
   [✔] Aula 8  — renderizarPedidos(): lê localStorage e monta lista com createElement.
                 configurarLimparPedidos(): remove chave do localStorage e re-renderiza.
   [✔] Aula 9  — configurarEnviarCozinha(): envia carrinho ao banco via POST /pedidos.
                   Fluxo: "Pedir Agora" → localStorage → "Enviar para Cozinha" → API.
                 Conceito de mesa: sessionStorage acumula Total Geral a cada envio.
                   "Limpar Pedidos" apaga só o carrinho — total da mesa não zera.
                 gerarBotaoStatus() + avancarStatus(): referência de PATCH em ação —
                   avança o status do pedido (pendente → preparo → pronto → entregue).
                 configurarVerConta() + renderizarContaMesa(): painel da conta da mesa,
                   mostra histórico de tudo que foi enviado à cozinha na sessão.
   [ ] Futuro  — renderizarFilaCozinha(): painel da cozinha em tempo real.
                   GET /pedidos com polling ou WebSocket — exibe todos os pedidos
                   com controle de status para a equipe da cozinha.
                 Separação de telas: pedidos.html para o cliente,
                   cozinha.html para a equipe — cada um com sua visão.
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  renderizarPedidos();
  configurarLimparPedidos();
  configurarEnviarCozinha(); // NEW — envia carrinho para a API
  configurarVerConta();      // NEW — abre/recolhe o painel da conta da mesa
  configurarFecharConta();   // NEW — encerra a sessão da mesa e volta ao início
});


// ─────────────────────────────────────────────────────────────────────────────
// renderizarPedidos()
// Aula 8: lia o array do localStorage e montava <li> com createElement.
//   Campos: { nome, preco, qtd, subtotal }
//
// Aula 9: mantém a mesma lógica de exibição (localStorage → DOM).
//   Diferença: campo renomeado qtd → quantidade. Adicionado produto_id.
//
//   Conceito de mesa (Aula 9):
//   #valor-total-resumo (topo) = só o carrinho atual (localStorage) —
//     mostra quanto está prestes a ser enviado. Zera ao limpar ou ao enviar.
//   #valor-total (rodapé) = conta da mesa: totalMesa (sessionStorage) +
//     totalCarrinho. Acumula a cada "Enviar para Cozinha" e nunca zera
//     ao "Limpar Pedidos" — o que foi à cozinha já foi pedido.
// ─────────────────────────────────────────────────────────────────────────────
function renderizarPedidos() {
  const lista        = document.querySelector("#lista-pedidos");
  const spanTotal    = document.querySelector("#valor-total");
  const spanResumo   = document.querySelector("#valor-total-resumo");
  const spanContador = document.querySelector("#contador-itens");

  if (!lista) return;

  // Conta da mesa: acumulado de pedidos já enviados à cozinha nesta sessão.
  // sessionStorage persiste enquanto a aba estiver aberta — cada mesa é uma sessão.
  const totalMesa = parseFloat(sessionStorage.getItem("techfood_total_mesa") || "0");

  const pedidos = JSON.parse(localStorage.getItem("techfood_pedidos") || "[]");

  if (pedidos.length === 0) {
    lista.innerHTML =
      "<li class='pedido-vazio'>Nenhum item ainda. Acesse o " +
      "<a href='index.html'>Cardápio</a> para adicionar! 😊</li>";
    // Carrinho vazio: resumo vai a zero, mas o Total Geral da mesa permanece
    if (spanResumo)   spanResumo.textContent   = "R$ 0,00";
    if (spanTotal)    spanTotal.textContent    = `R$ ${totalMesa.toFixed(2).replace(".", ",")}`;
    if (spanContador) spanContador.textContent = "0 itens";
    return;
  }

  lista.innerHTML = "";
  let totalCarrinho = 0;

  pedidos.forEach(function (pedido, indice) {
    // createElement + appendChild — Aula 7, mesmo padrão.
    const li = document.createElement("li");
    li.classList.add("item-pedido");

    const textoSpan = document.createElement("span");
    textoSpan.innerHTML =
      `<strong>${pedido.nome}</strong>` +
      ` — ${pedido.quantidade}x` +
      ` R$ ${pedido.preco.toFixed(2).replace(".", ",")}` +
      ` = <span class='subtotal-item'>R$ ${pedido.subtotal.toFixed(2).replace(".", ",")}</span>`;

    const btnRemover = document.createElement("button");
    btnRemover.textContent = "✕";
    btnRemover.classList.add("btn-remover-item");

    // remove do array pelo índice, salva e re-renderiza
    btnRemover.addEventListener("click", function () {
      const lista = JSON.parse(localStorage.getItem("techfood_pedidos") || "[]");
      lista.splice(indice, 1);
      localStorage.setItem("techfood_pedidos", JSON.stringify(lista));
      renderizarPedidos();
    });

    li.appendChild(textoSpan);
    li.appendChild(btnRemover);
    lista.appendChild(li);
    totalCarrinho += pedido.subtotal;
  });

  // Resumo (topo): só o que está no carrinho agora
  if (spanResumo) spanResumo.textContent = `R$ ${totalCarrinho.toFixed(2).replace(".", ",")}`;

  // Total Geral (rodapé): conta da mesa — acumulado enviado + carrinho atual
  const totalGeral = totalMesa + totalCarrinho;
  if (spanTotal) spanTotal.textContent = `R$ ${totalGeral.toFixed(2).replace(".", ",")}`;

  const totalItens = pedidos.reduce(function (acc, p) { return acc + p.quantidade; }, 0);
  if (spanContador) {
    spanContador.textContent = `${totalItens} ${totalItens === 1 ? "item" : "itens"}`;
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// configurarLimparPedidos()
// Aula 8: removeItem() limpa a chave do localStorage e re-renderiza.
//
// Aula 9: só apaga o carrinho atual (localStorage) — NÃO toca no totalMesa
//   do sessionStorage. O cliente pode desistir de enviar itens que ainda
//   estão na lista, mas pedidos já enviados à cozinha já foram pedidos.
// ─────────────────────────────────────────────────────────────────────────────
function configurarLimparPedidos() {
  const btn = document.querySelector("#btn-limpar-pedidos");
  if (!btn) return;

  btn.addEventListener("click", function () {
    // Apaga só o carrinho — o Total Geral acumulado da mesa permanece intacto
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
// Conceito de mesa: ao enviar, somamos o total do carrinho ao totalMesa
//   no sessionStorage. renderizarPedidos() sempre exibe totalMesa + carrinho,
//   então o Total Geral acumula a cada envio e nunca volta a zero.
//
// cliente vem do sessionStorage (global.js — solicitarNomeCliente).
//   || "Cliente" garante fallback se o modal não foi exibido (pedidos.html).
// ─────────────────────────────────────────────────────────────────────────────
function configurarEnviarCozinha() {
  const btn = document.querySelector("#btn-enviar-cozinha");
  if (!btn) return;

  btn.addEventListener("click", async function () {
    const pedidos = JSON.parse(localStorage.getItem("techfood_pedidos") || "[]");

    if (pedidos.length === 0) {
      alert("Adicione itens ao pedido antes de enviar!");
      return;
    }

    const cliente = sessionStorage.getItem("techfood_cliente") || "Cliente";

    // Monta o array de itens no formato que o back-end exige
    const itens = pedidos.map(function (p) {
      return { produto_id: p.produto_id, quantidade: p.quantidade };
    });

    btn.disabled    = true;
    btn.textContent = "Enviando...";

    try {
      // ── FETCH API em ação — POST /pedidos ──────────────────────────────────
      // criarPedido() (api.js) envia cliente + itens ao servidor como JSON.
      // É o momento em que o pedido SAI do navegador e VAI para o banco MySQL.
      // O servidor valida os dados, busca os preços no banco (nunca confia no
      // front) e insere o pedido. Retorna o pedido criado com id e status.
      // Se falhar (rede, servidor offline), cai no catch — carrinho NÃO é limpo.
      await criarPedido(cliente, itens); // HTTP POST → http://localhost:3000/pedidos

      // Acumula o total do carrinho atual na conta da mesa.
      // reduce() soma todos os subtotais do carrinho atual.
      // Depois de somar, o pedido já foi enviado — será cobrado.
      const totalCarrinho = pedidos.reduce(function (acc, p) { return acc + p.subtotal; }, 0);
      const totalMesa     = parseFloat(sessionStorage.getItem("techfood_total_mesa") || "0");
      sessionStorage.setItem("techfood_total_mesa", (totalMesa + totalCarrinho).toString());

      // Salva os itens no histórico da sessão para o painel "Ver Conta da Mesa".
      // Acumula — cada "Enviar para Cozinha" adiciona ao array existente.
      const historico = JSON.parse(sessionStorage.getItem("techfood_historico") || "[]");
      pedidos.forEach(function (p) {
        historico.push({ nome: p.nome, quantidade: p.quantidade, preco: p.preco, subtotal: p.subtotal });
      });
      sessionStorage.setItem("techfood_historico", JSON.stringify(historico));

      // Limpa o carrinho e re-renderiza — o Total Geral virá do totalMesa
      // acumulado no sessionStorage, então não vai a zero.
      localStorage.removeItem("techfood_pedidos");
      renderizarPedidos();

      btn.textContent           = "✓ Pedido Enviado!";
      btn.style.backgroundColor = "#27ae60";

      setTimeout(function () {
        btn.textContent           = "🍳 Enviar para Cozinha";
        btn.style.backgroundColor = "";
        btn.disabled              = false;
      }, 2500);

    } catch (erro) {
      // UX: o botão exibe o erro e se re-habilita para o usuário tentar novamente
      // sem precisar recarregar a página. Diferente do cardápio (onde não há retry),
      // aqui a falha pode ser transitória (rede instável, servidor reiniciando).
      btn.textContent           = "Erro! Tente novamente";
      btn.style.backgroundColor = "#e74c3c";
      btn.disabled              = false;

      setTimeout(function () {
        btn.textContent           = "🍳 Enviar para Cozinha";
        btn.style.backgroundColor = "";
      }, 2500);
    }
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// configurarVerConta()                                                    NEW
// Aula 9: abre/recolhe o painel que mostra tudo que foi enviado à cozinha.
//   O botão alterna entre "📋 Ver Conta da Mesa" e "▲ Recolher".
//   NÃO encerra a sessão — só mostra/esconde o painel.
//   Para encerrar a conta de verdade, usar configurarFecharConta() abaixo.
//   renderizarContaMesa() popula a lista a cada abertura — garante que
//   novos pedidos enviados aparecem ao reabrir o painel.
// ─────────────────────────────────────────────────────────────────────────────
function configurarVerConta() {
  const btnAbrir = document.querySelector("#btn-ver-conta");
  const painel   = document.querySelector("#painel-conta");
  if (!btnAbrir || !painel) return;

  btnAbrir.addEventListener("click", function () {
    const visivel = painel.style.display !== "none";
    if (visivel) {
      painel.style.display = "none";
      btnAbrir.textContent = "📋 Ver Conta da Mesa";
    } else {
      renderizarContaMesa();
      painel.style.display = "block";
      btnAbrir.textContent = "▲ Recolher";
    }
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// configurarFecharConta()                                                 NEW
// Aula 9: encerra a sessão da mesa — zera TUDO e volta para o cardápio.
//   Como o sistema é usado no restaurante (tablet/celular na mesa),
//   "fechar a conta" significa: cliente foi embora, mesa está livre.
//   O próximo cliente começa do zero: modal de nome aparece de novo,
//   Total Geral vai a zero, histórico limpo.
//
//   Em vez do confirm() nativo do navegador (feio e sem estilo),
//   usamos um modal customizado (#modal-fechar-conta em pedidos.html)
//   com o mesmo visual do #modal-boas-vindas — CSS em global.css.
//
//   O que é apagado ao confirmar:
//     sessionStorage: techfood_cliente    → força o modal de nome de novo
//                     techfood_total_mesa → zera a conta acumulada da mesa
//                     techfood_historico  → limpa o painel "Conta da Mesa"
//     localStorage:   techfood_pedidos   → descarta carrinho não enviado
// ─────────────────────────────────────────────────────────────────────────────
function configurarFecharConta() {
  const btnAbrir     = document.querySelector("#btn-fechar-conta");
  const modal        = document.querySelector("#modal-fechar-conta");
  const btnCancelar  = document.querySelector("#btn-cancelar-fechar");
  const btnConfirmar = document.querySelector("#btn-confirmar-fechar");

  if (!btnAbrir || !modal) return;

  // Abre o modal estilizado — substitui o confirm() nativo
  btnAbrir.addEventListener("click", function () {
    modal.style.display = "flex";
  });

  // Cancelar — fecha o modal sem fazer nada
  if (btnCancelar) {
    btnCancelar.addEventListener("click", function () {
      modal.style.display = "none";
    });
  }

  // Confirmar — zera a sessão completa da mesa e volta ao cardápio
  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", function () {
      sessionStorage.removeItem("techfood_cliente");    // força modal de nome de novo
      sessionStorage.removeItem("techfood_total_mesa"); // zera o Total Geral
      sessionStorage.removeItem("techfood_historico");  // limpa o painel da conta
      localStorage.removeItem("techfood_pedidos");      // descarta carrinho não enviado

      // global.js detecta ausência de techfood_cliente e exibe o modal de boas-vindas
      window.location.href = "index.html";
    });
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// renderizarContaMesa()                                                   NEW
// Aula 9: lê o histórico acumulado no sessionStorage e monta a lista no painel.
//   techfood_historico: array de todos os itens enviados à cozinha nesta sessão.
//   Cada "Enviar para Cozinha" adiciona ao array — nunca substitui.
//
//   Não usa localStorage — o carrinho atual não aparece aqui.
//   Só o que realmente foi pedido (e enviado) é exibido.
// ─────────────────────────────────────────────────────────────────────────────
function renderizarContaMesa() {
  const lista = document.querySelector("#lista-conta");
  if (!lista) return;

  const historico = JSON.parse(sessionStorage.getItem("techfood_historico") || "[]");

  if (historico.length === 0) {
    lista.innerHTML =
      "<li class='pedido-vazio'>" +
        "Nenhum pedido enviado à cozinha ainda.<br>" +
        "Adicione itens no Cardápio e clique em <strong>Enviar para Cozinha</strong>." +
      "</li>";
    return;
  }

  lista.innerHTML = "";
  historico.forEach(function (item) {
    const li = document.createElement("li");
    li.classList.add("item-pedido");
    li.innerHTML =
      `<strong>${item.nome}</strong>` +
      ` — ${item.quantidade}x` +
      ` R$ ${item.preco.toFixed(2).replace(".", ",")}` +
      ` = <span class='subtotal-item'>R$ ${item.subtotal.toFixed(2).replace(".", ",")}</span>`;
    lista.appendChild(li);
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// gerarBotaoStatus(pedidoId, statusAtual)
// Aula 9: referência de como o painel da cozinha avançaria o status.
//   Fluxo: pendente → preparo → pronto → entregue
//
//   onclick inline: único lugar do projeto onde usamos esse padrão.
//   A função é necessária aqui porque o botão é gerado dentro de innerHTML —
//   não é possível usar addEventListener em um elemento que ainda não existe
//   no DOM no momento em que o código roda. onclick inline contorna isso.
// ─────────────────────────────────────────────────────────────────────────────
function gerarBotaoStatus(pedidoId, statusAtual) {
  const proximo = {
    pendente: { label: "▶ Iniciar preparo",    status: "preparo"  },
    preparo:  { label: "✓ Marcar como pronto", status: "pronto"   },
    pronto:   { label: "🛵 Marcar entregue",   status: "entregue" },
    entregue: null,
  };

  const acao = proximo[statusAtual];
  if (!acao) return "<span class='entregue-label'>✓ Concluído</span>";

  return `<button class='btn-status' onclick='avancarStatus(${pedidoId}, "${acao.status}")'>${acao.label}</button>`;
}


// ─────────────────────────────────────────────────────────────────────────────
// avancarStatus(pedidoId, novoStatus)
// Aula 9: envia PATCH /pedidos/:id/status via atualizarStatusPedido() (api.js).
//   Chamada pelo onclick gerado em gerarBotaoStatus().
// ─────────────────────────────────────────────────────────────────────────────
async function avancarStatus(pedidoId, novoStatus) {
  try {
    // ── FETCH API em ação — PATCH /pedidos/:id/status ──────────────────────
    // atualizarStatusPedido() (api.js) envia só o campo "status" — isso é PATCH.
    // PATCH = atualização parcial (só o que mudou). PUT = substituição total.
    await atualizarStatusPedido(pedidoId, novoStatus); // HTTP PATCH → /pedidos/:id/status
    renderizarPedidos();
  } catch (erro) {
    alert(`Erro ao atualizar status: ${erro.message}`);
  }
}
