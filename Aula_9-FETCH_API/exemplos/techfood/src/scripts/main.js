/* ==========================================================
   MAIN.JS — Lógica da página do Cardápio (index.html)

   ROADMAP DESTE ARQUIVO:
   [✔] Aula 8  — inicializarSubtotal(), inicializarHoverCards(),
                 inicializarVitrine(), atualizarPrecoCard(),
                 salvarPedido() (localStorage), atualizarContadorPedidos()
   [✔] Aula 9  — renderizarCardapio() adicionada: cards agora vêm da API.
                 salvarPedido() substituída: envia para o servidor via api.js.
                 inicializarSubtotal() removida: não faz mais sentido porque
                 os cards fixos do HTML sumiram — o grid é montado pela API.
   [ ] Aula 10 — cadastrarProduto() via cadastro.js
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  renderizarCardapio(); // NEW — busca produtos da API e monta os cards
  inicializarVitrine();
  inicializarHoverCards();
});

// ─────────────────────────────────────────────────────────────────────────────
// renderizarCardapio()                                                    NEW
// Aula 9: os cards que estavam fixos no HTML agora vêm do banco de dados.
//
// Por que inicializarSubtotal() foi removida do DOMContentLoaded?
//   Na Aula 8, os cards eram fixos no HTML — havia um campo #qtd-lasanha
//   fixo que o inicializarSubtotal() controlava. Na Aula 9, o grid vem
//   vazio do servidor e é preenchido aqui. Não existe mais #qtd-lasanha
//   no HTML — então inicializarSubtotal() não teria nada para encontrar.
//   A lógica de preço agora é toda controlada por atualizarPrecoCard().
//
// data-id: o produto_id do banco — adicionado no card aqui.
//   Quando o cliente clicar em Pedir Agora, usamos esse ID para mandar
//   ao servidor — não o nome do prato.
//
// try/catch: captura erros de rede ou servidor offline e mostra mensagem.
// ─────────────────────────────────────────────────────────────────────────────
async function renderizarCardapio() {
  var grid = document.querySelector("#grid-cardapio");
  if (!grid) return;

  // Mostra loading enquanto a requisição não volta
  grid.innerHTML = "<p class='loading'>Carregando cardápio...</p>";

  try {
    var produtos = await buscarProdutos(); // api.js — GET /produtos

    grid.innerHTML = "";

    produtos.forEach(function (produto) {
      var card = document.createElement("article");
      card.classList.add("card");
      card.setAttribute("data-id", produto.produto_id); // ID do banco

      card.innerHTML =
        "<img src='src/images/" +
        produto.imagem +
        "' alt='" +
        produto.nome +
        "'>" +
        "<h3>" +
        produto.nome +
        "</h3>" +
        "<p class='desc'>" +
        produto.descricao +
        "</p>" +
        "<div class='quantidade-box'>" +
        "<button class='btn-qtd btn-menos'>-</button>" +
        "<span class='qtd-valor'>1</span>" +
        "<button class='btn-qtd btn-mais'>+</button>" +
        "</div>" +
        "<span class='preco' data-preco='" +
        produto.preco +
        "'>" +
        "R$ " +
        parseFloat(produto.preco).toFixed(2).replace(".", ",") +
        "</span>" +
        "<button class='btn-pedido'>Pedir Agora</button>";

      grid.appendChild(card);
    });
  } catch (erro) {
    // try/catch captura erros de rede ou servidor offline
    grid.innerHTML = "<p class='loading erro'>Erro ao carregar o cardápio.</p>";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// inicializarHoverCards()
// Aula 8: sem mudanças. Mantido exatamente como estava.
// ─────────────────────────────────────────────────────────────────────────────
function inicializarHoverCards() {
  var cards = document.querySelectorAll(".card");

  cards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      card.style.transform = "translateY(-5px)";
      card.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "none";
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// inicializarVitrine()
// Aula 8: delegação de eventos no <main> com btn-menos, btn-mais e btn-pedido.
//
// Aula 9 — o que mudou dentro do bloco btn-pedido:
//   ⚠ Aula 8 lia nome/preco do card e chamava salvarPedido({ nome, preco, qtd })
//   ⚠ Aula 9 lê o data-id do card e chama salvarPedido(produtoId, quantidade, clicado)
//     — o botão é passado como parâmetro para o feedback ser controlado
//       dentro da função (que agora depende da resposta do servidor)
//   O resto da delegação (btn-menos, btn-mais) é idêntico à Aula 8.
// ─────────────────────────────────────────────────────────────────────────────
function inicializarVitrine() {
  var main = document.querySelector("main");
  if (!main) return;

  main.addEventListener("click", function (event) {
    var clicado = event.target;

    // ── Botão MENOS — idêntico à Aula 8 ─────────────────────────────────────
    if (clicado.classList.contains("btn-menos")) {
      var box = clicado.parentElement;
      var spanQtd = box.querySelector(".qtd-valor");
      spanQtd.textContent = Math.max(1, Number(spanQtd.textContent) - 1);
      atualizarPrecoCard(box);
      return;
    }

    // ── Botão MAIS — idêntico à Aula 8 ──────────────────────────────────────
    if (clicado.classList.contains("btn-mais")) {
      var box = clicado.parentElement;
      var spanQtd = box.querySelector(".qtd-valor");
      spanQtd.textContent = Number(spanQtd.textContent) + 1;
      atualizarPrecoCard(box);
      return;
    }

    // ── Botão PEDIR AGORA — mudou na Aula 9 ─────────────────────────────────
    if (clicado.classList.contains("btn-pedido")) {
      event.preventDefault();

      var card = clicado.parentElement;

      // ⚠ Aula 9: lê o data-id do card (produto_id do banco)
      // adicionado por renderizarCardapio() — não existe mais data-nome
      var produtoId = Number(card.getAttribute("data-id"));
      var quantidade = Number(card.querySelector(".qtd-valor").textContent);

      // Desabilita o botão imediatamente — evita clique duplo enquanto aguarda API
      clicado.disabled = true;
      clicado.textContent = "Enviando...";

      // ⚠ Aula 9: passa o botão como parâmetro — o feedback fica dentro
      // de salvarPedido porque agora depende da resposta do servidor
      salvarPedido(produtoId, quantidade, clicado);
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// atualizarPrecoCard()
// Aula 8: sem mudanças. Recalcula o preço no card quando muda a quantidade.
// ─────────────────────────────────────────────────────────────────────────────
function atualizarPrecoCard(box) {
  var card = box.parentElement;
  var spanPreco = card.querySelector(".preco");
  var precoUnitario = parseFloat(spanPreco.getAttribute("data-preco"));
  var quantidade = Number(box.querySelector(".qtd-valor").textContent);
  var total = precoUnitario * quantidade;

  spanPreco.textContent = "R$ " + total.toFixed(2).replace(".", ",");
  spanPreco.style.color = total > 150 ? "#c0392b" : "#e67e22";
}

// ─────────────────────────────────────────────────────────────────────────────
// salvarPedido(produtoId, quantidade, botao)
// Aula 8: guardava no localStorage — função síncrona, sem API.
// Aula 9: envia para o servidor via criarPedido() do api.js.
//
// Por que a assinatura mudou?
//   Aula 8 → salvarPedido({ nome, preco, qtd })  — dados do front-end
//   Aula 9 → salvarPedido(produtoId, quantidade, botao) — só ID + qtd
//   O servidor calcula o preço total consultando o banco — o front não
//   manda preço para evitar que alguém manipule o valor antes de enviar.
//   O botão é passado para o feedback ser controlado aqui, dentro do
//   try/catch — sucesso e erro têm visuais diferentes.
//
// cliente vem do sessionStorage (global.js) — nome que o cliente digitou
//   no popup de boas-vindas. || "Cliente" garante fallback se não tiver.
// ─────────────────────────────────────────────────────────────────────────────
async function salvarPedido(produtoId, quantidade, botao) {
  // Pega o nome do cliente salvo na sessão (global.js — solicitarNomeCliente)
  var cliente = sessionStorage.getItem("techfood_cliente") || "Cliente";

  try {
    // criarPedido() no api.js — POST /pedidos
    // o back-end exige produto_id e quantidade — não o nome nem o preço
    await criarPedido(cliente, [
      { produto_id: produtoId, quantidade: quantidade },
    ]);

    // Feedback de sucesso
    botao.textContent = "✓ Pedido enviado!";
    botao.style.backgroundColor = "#27ae60";

    atualizarContadorPedidos();

    setTimeout(function () {
      botao.textContent = "Pedir Agora";
      botao.style.backgroundColor = "";
      botao.disabled = false;

      // Reset de quantidade após o feedback
      var box = botao.parentElement.querySelector(".quantidade-box");
      if (box) {
        box.querySelector(".qtd-valor").textContent = "1";
        atualizarPrecoCard(box);
      }
    }, 2000);
  } catch (erro) {
    // Feedback de erro — libera o botão para tentar de novo
    botao.textContent = "Erro! Tente novamente";
    botao.style.backgroundColor = "#e74c3c";
    botao.disabled = false;

    setTimeout(function () {
      botao.textContent = "Pedir Agora";
      botao.style.backgroundColor = "";
    }, 2500);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// atualizarContadorPedidos()
// Aula 8: lia o localStorage para contar pedidos.
// Aula 9: chama buscarPedidos() da API para ter o número real do servidor.
// ─────────────────────────────────────────────────────────────────────────────
async function atualizarContadorPedidos() {
  try {
    var resposta = await buscarPedidos(); // api.js — GET /pedidos
    var pedidos = resposta.dados || resposta;
    var total = pedidos.reduce(function (acc, p) {
      // soma as quantidades de todos os itens de todos os pedidos
      if (p.itens)
        return (
          acc +
          p.itens.reduce(function (a, i) {
            return a + i.quantidade;
          }, 0)
        );
      return acc + 1;
    }, 0);

    var linkMenu = document.querySelector("#menu a[href='pedidos.html']");
    if (!linkMenu) return;

    var badge = linkMenu.querySelector(".badge-menu");
    if (!badge) {
      linkMenu.insertAdjacentHTML(
        "beforeend",
        "<span class='badge-menu'>0</span>",
      );
      badge = linkMenu.querySelector(".badge-menu");
    }

    badge.textContent = total;
    linkMenu.classList.add("menu-ativo");
  } catch (erro) {
    // Silencia o erro de contador — não interrompe o fluxo do usuário
    console.warn("Não foi possível atualizar o contador de pedidos.");
  }
}
