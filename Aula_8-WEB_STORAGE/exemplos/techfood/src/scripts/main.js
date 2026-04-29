/* ==========================================================
   MAIN.JS — Lógica da página do Cardápio (index.html)

   ROADMAP DESTE ARQUIVO:
   [✔] Aulas 5/6  — Subtotal, hover, botão pedir
   [✔] Aula 7     — Delegação, parentElement, quantidade moderna, badge
   [✔] Aula 8     — Código solto virou funções dentro do DOMContentLoaded.
                    salvarPedido() ativado. Saudação migrou para global.js.
                    Resumo migrou para pedidos.js.
   [ ] Aula 10    — renderizarPratosDinamicos() (integração com cadastro.js)
   [ ] Futuro     — Substituir localStorage por chamadas à API (back-end)
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  inicializarSubtotal();
  inicializarHoverCards();
  inicializarVitrine();

  // [ ] Aula 10: descomentar quando cadastro.js estiver ativo
  // renderizarPratosDinamicos();
});

// ─────────────────────────────────────────────────────────────────────────────
// inicializarSubtotal()
// Aulas 5/6: esse código estava SOLTO no aula7.js — rodava direto
//   quando o arquivo carregava, sem garantia de que o HTML existia.
//
// Aula 8: virou função e passou para dentro do DOMContentLoaded.
//   Isso garante que o #qtd-lasanha e o #preco-lasanha já existem
//   no momento em que o querySelector tenta encontrá-los.
//   Código solto fora do DOMContentLoaded pode não encontrar os elementos
//   se o script carregar antes do HTML terminar de ser lido.
// ─────────────────────────────────────────────────────────────────────────────
function inicializarSubtotal() {
  const inputQtd = document.querySelector("#qtd-lasanha");
  const precoTexto = document.querySelector("#preco-lasanha");
  const subTexto = document.querySelector("#sub-lasanha");

  if (!inputQtd || !precoTexto) return;

  inputQtd.addEventListener("input", function () {
    const precoUnitario = 45.0;
    const quantidade = Number(inputQtd.value);

    if (isNaN(quantidade) || quantidade < 1) return;

    const total = quantidade * precoUnitario;
    precoTexto.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
    precoTexto.style.color = total > 150 ? "#c0392b" : "#e67e22";

    if (subTexto) {
      subTexto.textContent =
        quantidade > 1
          ? `${quantidade}x R$ ${precoUnitario.toFixed(2).replace(".", ",")}`
          : "";
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// inicializarHoverCards()
// Aula 6: esse código estava SOLTO no aula7.js — o forEach nos cards
//   rodava direto, sem estar dentro de uma função ou do DOMContentLoaded.
//
// Aula 8: virou função e passou para dentro do DOMContentLoaded,
//   pelo mesmo motivo do inicializarSubtotal() — garantir que os cards
//   já existem antes de tentar selecioná-los.
//
// O visual (elevação e sombra) continua no CSS :hover — mais performático.
// Este bloco JS existe para comportamento futuro (analytics, etc.).
// ─────────────────────────────────────────────────────────────────────────────
function inicializarHoverCards() {
  const cards = document.querySelectorAll(".card");

  cards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      // Espaço para lógica futura — visual tratado pelo CSS :hover
    });
    card.addEventListener("mouseleave", function () {
      // Limpeza de estado ao sair do card
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// inicializarVitrine()
// Aula 7: a delegação de eventos e os blocos de btn-menos, btn-mais e
//   btn-pedido estavam como um bloco de código SOLTO no aula7.js —
//   o listener no <main> era adicionado direto, fora de qualquer função.
//
// Aula 8: virou função e passou para dentro do DOMContentLoaded,
//   garantindo que o <main> existe antes de tentar selecioná-lo.
//
// Aula 8: o btn-pedido agora chama salvarPedido() em vez de
//   adicionarItemAoResumo() — o resumo saiu da index.html e foi para
//   pedidos.html, que lê os dados do localStorage via pedidos.js.
// ─────────────────────────────────────────────────────────────────────────────
function inicializarVitrine() {
  const main = document.querySelector("main");
  if (!main) return;

  main.addEventListener("click", function (event) {
    const clicado = event.target;

    // ── Botão MENOS ──────────────────────────────────────────────────────────
    // Aula 7: parentElement sobe do botão para a .quantidade-box.
    // Math.max garante que a quantidade nunca vai abaixo de 1.
    if (clicado.classList.contains("btn-menos")) {
      const box = clicado.parentElement;
      const spanQtd = box.querySelector(".qtd-valor");
      spanQtd.textContent = Math.max(1, Number(spanQtd.textContent) - 1);
      atualizarPrecoCard(box);
      return;
    }

    // ── Botão MAIS ───────────────────────────────────────────────────────────
    // Aula 7: mesmo padrão do btn-menos, sem limite superior por enquanto.
    if (clicado.classList.contains("btn-mais")) {
      const box = clicado.parentElement;
      const spanQtd = box.querySelector(".qtd-valor");
      spanQtd.textContent = Number(spanQtd.textContent) + 1;
      atualizarPrecoCard(box);
      return;
    }

    // ── Botão PEDIR AGORA ────────────────────────────────────────────────────
    // Aula 7: parentElement navega do botão até o card para pegar nome,
    //   quantidade e preço sem depender de atributos data-* no botão.
    //
    // Aula 8: substituímos adicionarItemAoResumo() por salvarPedido().
    //   O resumo que existia nessa mesma página migrou para pedidos.js —
    //   agora os dados vão para o localStorage e pedidos.html os exibe.
    if (clicado.classList.contains("btn-pedido")) {
      event.preventDefault();

      const card = clicado.parentElement;
      const nomePrato = card.querySelector("h3").textContent;
      const quantidade = Number(card.querySelector(".qtd-valor").textContent);
      const preco = parseFloat(
        card.querySelector(".preco").getAttribute("data-preco"),
      );

      // Feedback visual — Aulas 5/6
      clicado.textContent = "✓ Adicionado!";
      clicado.style.backgroundColor = "#27ae60";
      clicado.disabled = true;

      // O setTimeout agrupa as ações que acontecem JUNTAS após 1,5s:
      // o botão volta ao estado original E a quantidade reseta para 1.
      // Colocar o reset fora do setTimeout faria ele acontecer imediatamente
      // ao clique, antes do usuário ver o feedback "✓ Adicionado!".
      setTimeout(function () {
        clicado.textContent = "Pedir Agora";
        clicado.style.backgroundColor = "";
        clicado.disabled = false;

        // Reset de quantidade — dentro do setTimeout para sincronizar
        // com o retorno visual do botão. Assim o usuário vê o feedback
        // completo antes dos valores mudarem.
        const box = card.querySelector(".quantidade-box");
        if (box) {
          const spanQtd = box.querySelector(".qtd-valor");
          if (spanQtd) spanQtd.textContent = "1";
          atualizarPrecoCard(box);
        }
      }, 1500);

      // Badge no card — Aula 7 → Aula 8
      // Mostra "✔ Pedido salvo" e some após 2s, liberando o card
      // para um novo pedido do mesmo prato sem confundir o cliente.
      // Se já existe um badge (pedido anterior ainda visível),
      // remove antes de criar um novo — evita duplicatas.
      const badgeExistente = card.querySelector(".badge-adicionado");
      if (badgeExistente) badgeExistente.remove();

      card.insertAdjacentHTML(
        "beforeend",
        "<span class='badge-adicionado'>✔ Pedido salvo</span>",
      );

      // Remove o badge após 2s — card volta ao estado original
      setTimeout(function () {
        const badge = card.querySelector(".badge-adicionado");
        if (badge) badge.remove();
      }, 2000);

      // Aula 8: salva no localStorage e destaca o botão Meus Pedidos
      salvarPedido({ nome: nomePrato, preco: preco, qtd: quantidade });
      atualizarContadorPedidos();
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// atualizarPrecoCard()
// Aula 7: já existia como função no aula7.js — apenas migrou para cá.
//   Recalcula o preço exibido no card quando o usuário muda a quantidade.
//   Lê o preço unitário do data-preco, separado do preço exibido
//   que muda conforme a quantidade aumenta.
// ─────────────────────────────────────────────────────────────────────────────
function atualizarPrecoCard(box) {
  const card = box.parentElement;
  const spanPreco = card.querySelector(".preco");
  const precoUnitario = parseFloat(spanPreco.getAttribute("data-preco"));
  const quantidade = Number(box.querySelector(".qtd-valor").textContent);
  const total = precoUnitario * quantidade;

  spanPreco.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
  spanPreco.style.color = total > 150 ? "#c0392b" : "#e67e22";
}

// ─────────────────────────────────────────────────────────────────────────────
// salvarPedido()
// Aula 8: função nova — ativa o bloco que estava comentado no main.js
//   do repositório desde a Aula 6.
//
// Padrão ler → modificar → salvar:
//   1. Lê a lista atual do localStorage — || "[]" evita erro com chave inexistente
//   2. Calcula o subtotal e adiciona o pedido à lista
//   3. Serializa com JSON.stringify e salva de volta
//
// pedidos.js lê essa mesma chave "techfood_pedidos" para exibir em pedidos.html.
// ─────────────────────────────────────────────────────────────────────────────
function salvarPedido(pedido) {
  const lista = JSON.parse(localStorage.getItem("techfood_pedidos") || "[]");

  pedido.subtotal = pedido.preco * pedido.qtd;
  lista.push(pedido);

  localStorage.setItem("techfood_pedidos", JSON.stringify(lista));
}

// ─────────────────────────────────────────────────────────────────────────────
// exibirLinkPedidos()
// Aula 8: função nova — cria um link "🛒 Ver pedidos (N)" no header
//   após o primeiro pedido ser salvo, para o aluno saber que pode ir
//   até pedidos.html ver o que foi registrado.
//
// Usa insertAdjacentHTML da Aula 7 — adiciona dentro do header
//   sem sobrescrever título e saudação que já estão lá.
// Se o link já existe, só atualiza o contador de itens.
// ─────────────────────────────────────────────────────────────────────────────
function exibirLinkPedidos() {
  const lista = JSON.parse(localStorage.getItem("techfood_pedidos") || "[]");
  const total = lista.reduce(function (acc, p) {
    return acc + p.qtd;
  }, 0);
  let linkEl = document.querySelector("#link-ver-pedidos");

  if (!linkEl) {
    const header = document.querySelector("#topo-loja");
    header.insertAdjacentHTML(
      "beforeend",
      "<a href='pedidos.html' id='link-ver-pedidos' class='link-pedidos'>" +
        "🛒 Ver pedidos (<span id='contador-link'>0</span>)" +
        "</a>",
    );
    linkEl = document.querySelector("#link-ver-pedidos");
  }

  const contador = document.querySelector("#contador-link");
  if (contador) contador.textContent = total;
}

// ─────────────────────────────────────────────────────────────────────────────
// [ ] Aula 10 — renderizarPratosDinamicos()
// Quando cadastro.js estiver ativo, esta função lê "techfood_pratos"
// e renderiza os pratos cadastrados como cards no grid dinâmico.
// A delegação em inicializarVitrine() já captura os botões criados aqui
// automaticamente — herança direta da Aula 7.
// ─────────────────────────────────────────────────────────────────────────────
//
// function renderizarPratosDinamicos() {
//   const grid = document.querySelector("#grid-dinamico");
//   if (!grid) return;
//
//   const pratos = JSON.parse(localStorage.getItem("techfood_pratos") || "[]");
//
//   if (pratos.length === 0) {
//     grid.innerHTML = "<p style='text-align:center;color:#aaa;grid-column:1/-1'>Nenhum prato cadastrado.</p>";
//     return;
//   }
//
//   pratos.forEach(function (prato) {
//     const card = document.createElement("article");
//     card.classList.add("card");
//     card.innerHTML = `
//       <h3>${prato.nome}</h3>
//       <p class="desc">${prato.descricao}</p>
//       <div class="quantidade-box">
//         <button class="btn-qtd btn-menos">-</button>
//         <span class="qtd-valor">1</span>
//         <button class="btn-qtd btn-mais">+</button>
//       </div>
//       <span class="preco" data-preco="${prato.preco}">
//         R$ ${parseFloat(prato.preco).toFixed(2).replace(".", ",")}
//       </span>
//       <button class="btn-pedido">Pedir Agora</button>
//     `;
//     grid.appendChild(card);
//   });
// }
