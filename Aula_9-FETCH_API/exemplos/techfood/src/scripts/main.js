/* ==========================================================
   MAIN.JS — Lógica da página do Cardápio (index.html)

   ROADMAP DESTE ARQUIVO:
   [✔] Aulas 5/6  — Subtotal, hover, botão pedir
   [✔] Aula 7     — Delegação, parentElement, quantidade moderna, badge
   [✔] Aula 8     — salvarPedido() → localStorage, global.js, pedidos.js
   [✔] Aula 9     — renderizarCardapio() → GET /produtos via api.js
                    salvarPedido() → POST /pedidos via api.js
                    Cards fixos no HTML substituídos por dados do banco
   [ ] Aula 10    — cadastrarProduto() via cadastro.js
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  renderizarCardapio();
  inicializarVitrine();
  inicializarHoverCards();

  // [ ] Aula 10: descomentar quando cadastro.js estiver ativo
  // renderizarPratosDinamicos();
});


// ─────────────────────────────────────────────────────────────────────────────
// renderizarCardapio()
// Aula 9: substitui os cards fixos do HTML por dados reais do banco.
//
// Aula 8: cards existiam no HTML — estáticos, sempre os mesmos.
// Aula 9: grid vazio no HTML. JS busca via GET /produtos (api.js)
//   e cria os cards com createElement — Aula 7.
//
// data-id: guarda o produto_id do banco em cada card.
//   O POST /pedidos exige produto_id, não o nome.
//   Por isso não podemos mais ter cards fixos no HTML.
// ─────────────────────────────────────────────────────────────────────────────
async function renderizarCardapio() {
  var grid = document.querySelector("#grid-cardapio");
  if (!grid) return;

  grid.innerHTML = "<p class='loading'>Carregando cardápio...</p>";

  try {
    var produtos    = await buscarProdutos();
    var disponiveis = produtos.filter(function (p) { return p.disponivel === 1; });

    if (disponiveis.length === 0) {
      grid.innerHTML = "<p class='loading'>Nenhum prato disponível no momento.</p>";
      return;
    }

    grid.innerHTML = "";

    disponiveis.forEach(function (produto) {
      var card = document.createElement("article");
      card.classList.add("card");

      // data-id: produto_id do banco — usado em salvarPedido()
      card.setAttribute("data-id", produto.id);

      card.innerHTML =
        "<h3>" + produto.nome + "</h3>" +
        "<p class='desc'>" + produto.descricao + "</p>" +
        "<p class='categoria'>" + (produto.categoria || "") + "</p>" +
        "<div class='quantidade-box'>" +
          "<button class='btn-qtd btn-menos'>-</button>" +
          "<span class='qtd-valor'>1</span>" +
          "<button class='btn-qtd btn-mais'>+</button>" +
        "</div>" +
        "<span class='preco' data-preco='" + produto.preco + "'>" +
          "R$ " + parseFloat(produto.preco).toFixed(2).replace(".", ",") +
        "</span>" +
        "<button class='btn-pedido'>Pedir Agora</button>";

      grid.appendChild(card);
    });

  } catch (erro) {
    grid.innerHTML = "<p class='loading erro'>Erro ao carregar o cardápio. Verifique sua conexão.</p>";
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// inicializarVitrine()
// Aula 7: delegação de eventos no <main> — mantida intacta.
// Aula 8: btn-pedido chamava salvarPedido() → localStorage.
// Aula 9: btn-pedido passa produto_id (data-id) para salvarPedido() → API.
// ─────────────────────────────────────────────────────────────────────────────
function inicializarVitrine() {
  var main = document.querySelector("main");
  if (!main) return;

  main.addEventListener("click", function (event) {
    var clicado = event.target;

    // Botão MENOS — Aula 7, mantido
    if (clicado.classList.contains("btn-menos")) {
      var box     = clicado.parentElement;
      var spanQtd = box.querySelector(".qtd-valor");
      spanQtd.textContent = Math.max(1, Number(spanQtd.textContent) - 1);
      atualizarPrecoCard(box);
      return;
    }

    // Botão MAIS — Aula 7, mantido
    if (clicado.classList.contains("btn-mais")) {
      var box     = clicado.parentElement;
      var spanQtd = box.querySelector(".qtd-valor");
      spanQtd.textContent = Number(spanQtd.textContent) + 1;
      atualizarPrecoCard(box);
      return;
    }

    // Botão PEDIR AGORA
    // Aula 9: lemos data-id para obter o produto_id do banco.
    //   Passamos o botão como parâmetro — o feedback (sucesso/erro)
    //   é controlado dentro de salvarPedido() após a resposta da API.
    if (clicado.classList.contains("btn-pedido")) {
      event.preventDefault();

      var card       = clicado.parentElement;
      var produtoId  = Number(card.getAttribute("data-id"));
      var quantidade = Number(card.querySelector(".qtd-valor").textContent);

      // Feedback visual enquanto aguarda a resposta da API
      clicado.textContent          = "✓ Enviando...";
      clicado.style.backgroundColor = "#f39c12";
      clicado.disabled             = true;

      // Badge — Aula 7/8: some após 2s, libera o card para novo pedido
      var badgeExistente = card.querySelector(".badge-adicionado");
      if (badgeExistente) badgeExistente.remove();
      card.insertAdjacentHTML("beforeend",
        "<span class='badge-adicionado'>✔ Pedido salvo</span>"
      );
      setTimeout(function () {
        var badge = card.querySelector(".badge-adicionado");
        if (badge) badge.remove();
      }, 2000);

      // Reset da quantidade — Aula 8: evita pedido duplicado sem perceber
      var box = card.querySelector(".quantidade-box");
      if (box) {
        box.querySelector(".qtd-valor").textContent = "1";
        atualizarPrecoCard(box);
      }

      // Aula 9: envia para a API com produto_id e quantidade
      salvarPedido(produtoId, quantidade, clicado);
    }
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// salvarPedido()
// Aula 8: salvava { nome, preco, qtd } no localStorage.
//
// Aula 9: envia via POST /pedidos para o servidor.
//   O nome do cliente vem do sessionStorage (global.js).
//   O back-end calcula o total — não enviamos o preço do front.
//   O botão é parâmetro: feedback atualizado após resposta da API.
// ─────────────────────────────────────────────────────────────────────────────
async function salvarPedido(produtoId, quantidade, botao) {
  var cliente = sessionStorage.getItem("techfood_cliente") || "Cliente";

  try {
    await criarPedido(cliente, [
      { produto_id: produtoId, quantidade: quantidade }
    ]);

    botao.textContent          = "✓ Pedido enviado!";
    botao.style.backgroundColor = "#27ae60";
    atualizarContadorPedidos();

    setTimeout(function () {
      botao.textContent          = "Pedir Agora";
      botao.style.backgroundColor = "";
      botao.disabled             = false;
    }, 2000);

  } catch (erro) {
    // erro de rede ou servidor — libera o botão para tentar de novo
    botao.textContent          = "Erro! Tente novamente";
    botao.style.backgroundColor = "#e74c3c";
    botao.disabled             = false;

    setTimeout(function () {
      botao.textContent          = "Pedir Agora";
      botao.style.backgroundColor = "";
    }, 2500);
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// atualizarContadorPedidos()
// Aula 8: lia do localStorage para contar itens.
// Aula 9: incrementa o contador a cada pedido enviado com sucesso.
//   Não depende mais do localStorage.
// ─────────────────────────────────────────────────────────────────────────────
function atualizarContadorPedidos() {
  var linkMenu = document.querySelector("#menu a[href='pedidos.html']");
  if (!linkMenu) return;

  var badge = linkMenu.querySelector(".badge-menu");
  if (!badge) {
    linkMenu.insertAdjacentHTML("beforeend", "<span class='badge-menu'>0</span>");
    badge = linkMenu.querySelector(".badge-menu");
  }

  badge.textContent = Number(badge.textContent) + 1;
  linkMenu.classList.add("menu-ativo");
}


// ─────────────────────────────────────────────────────────────────────────────
// atualizarPrecoCard() — Aula 7, mantido sem alteração
// ─────────────────────────────────────────────────────────────────────────────
function atualizarPrecoCard(box) {
  var card          = box.parentElement;
  var spanPreco     = card.querySelector(".preco");
  var precoUnitario = parseFloat(spanPreco.getAttribute("data-preco"));
  var quantidade    = Number(box.querySelector(".qtd-valor").textContent);
  var total         = precoUnitario * quantidade;

  spanPreco.textContent = "R$ " + total.toFixed(2).replace(".", ",");
  spanPreco.style.color = total > 150 ? "#c0392b" : "#e67e22";
}


// ─────────────────────────────────────────────────────────────────────────────
// inicializarHoverCards() — Aula 6, mantido sem alteração
// ─────────────────────────────────────────────────────────────────────────────
function inicializarHoverCards() {
  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-5px)";
      card.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "none";
    });
  });
}