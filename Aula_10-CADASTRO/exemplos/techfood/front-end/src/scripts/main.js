/* ==========================================================
   MAIN.JS — Lógica da página do Cardápio (index.html)

   ROADMAP DESTE ARQUIVO:
   [✔] Aula 8  — inicializarSubtotal(), inicializarHoverCards(),
                 inicializarVitrine(), atualizarPrecoCard(),
                 salvarPedido() (localStorage), atualizarContadorPedidos().
   [✔] Aula 9  — renderizarCardapio() adicionada: cards agora vêm da API
                   via buscarProdutos() (GET /produtos). Grid montado dinamicamente.
                 salvarPedido() alterada: salva produto_id (vindo do data-id do card)
                   para que pedidos.js possa enviar à API no formato correto.
                 atualizarContadorPedidos() alterada: campo p.qtd → p.quantidade.
                 inicializarSubtotal() desativada: sem cards fixos no HTML,
                   sem #qtd-lasanha — ver função comentada no final do arquivo.
   [✔] Aula 10 — imagens ativadas nos cards: o <img> que estava comentado
                   agora exibe a foto do prato vinda do banco (campo "imagem").
                   Fallback local (espaguete.png) + onerror para prato sem foto.
                 Integração com cadastro.js: pratos cadastrados pelo admin
                   aparecem no cardápio junto aos pratos do banco (mesmo GET /produtos).
   [ ] Futuro  — renderizarCardapioPorCategoria(): agrupar cards em seções
                   (Massas, Sobremesas, Bebidas) pelo campo "categoria" do banco.
                 Filtro de categoria por botão/tab no topo do cardápio.
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
  const grid = document.querySelector("#grid-cardapio");
  if (!grid) return;

  grid.innerHTML = "<p class='loading'>Carregando cardápio...</p>";

  try {
    // ── FETCH API em ação — GET /produtos ────────────────────────────────────
    // buscarProdutos() (api.js) faz a requisição HTTP para o servidor Node.js.
    // O await "pausa" esta função até a resposta chegar — sem travar a página.
    // Se o servidor não estiver rodando, cai direto no catch abaixo.
    const produtos = await buscarProdutos(); // HTTP GET → http://localhost:3000/produtos

    grid.innerHTML = "";

    produtos.forEach(function (produto) {
      const card = document.createElement("article");
      card.classList.add("card");
      card.setAttribute("data-id", produto.id); // ID do banco

      // Aula 10: imagens ativadas. O campo "imagem" vem do banco (cadastro.html).
      // Se o prato não tiver imagem (cadastro sem upload), usa um placeholder local.
      const imgSrc = produto.imagem
        ? `${BASE_URL}/uploads/${produto.imagem}`   // imagem enviada via cadastro → servida pelo back
        : "src/images/espaguete.png";               // fallback local
      card.innerHTML =
        `<img src='${imgSrc}' alt='${produto.nome}' onerror="this.src='src/images/espaguete.png'">` +  // Aula 10
        `<h3>${produto.nome}</h3>` +
        `<p class='desc'>${produto.descricao}</p>` +
        `<div class='quantidade-box'>` +
          `<button class='btn-qtd btn-menos'>-</button>` +
          `<span class='qtd-valor'>1</span>` +
          `<button class='btn-qtd btn-mais'>+</button>` +
        `</div>` +
        `<span class='preco' data-preco='${produto.preco}'>` +
          `R$ ${parseFloat(produto.preco).toFixed(2).replace(".", ",")}` +
        `</span>` +
        `<button class='btn-pedido'>Pedir Agora</button>`;

      grid.appendChild(card);
    });
  } catch (erro) {
    // UX: a grid exibe mensagem de erro — o usuário sabe que o cardápio não
    // carregou e pode recarregar a página. Diferente do botão "Enviar para
    // Cozinha" (que tem retry inline), aqui não há ação além de F5.
    grid.innerHTML = "<p class='loading erro'>Erro ao carregar o cardápio. Verifique se o servidor está rodando.</p>";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// inicializarHoverCards()
// Aula 8: sem mudanças. Mantido exatamente como estava.
// ─────────────────────────────────────────────────────────────────────────────
function inicializarHoverCards() {
  const cards = document.querySelectorAll(".card");

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
  const main = document.querySelector("main");
  if (!main) return;

  main.addEventListener("click", function (event) {
    const clicado = event.target;

    // ── Botão MENOS — idêntico à Aula 8 ─────────────────────────────────────
    if (clicado.classList.contains("btn-menos")) {
      const box    = clicado.parentElement;
      const spanQtd = box.querySelector(".qtd-valor");
      spanQtd.textContent = Math.max(1, Number(spanQtd.textContent) - 1);
      atualizarPrecoCard(box);
      return;
    }

    // ── Botão MAIS — idêntico à Aula 8 ──────────────────────────────────────
    if (clicado.classList.contains("btn-mais")) {
      const box    = clicado.parentElement;
      const spanQtd = box.querySelector(".qtd-valor");
      spanQtd.textContent = Number(spanQtd.textContent) + 1;
      atualizarPrecoCard(box);
      return;
    }

    // ── Botão PEDIR AGORA ────────────────────────────────────────────────────
    if (clicado.classList.contains("btn-pedido")) {
      event.preventDefault();

      const card      = clicado.parentElement;

      // ⚠ Aula 9: lê o data-id do card (produto_id do banco)
      // adicionado por renderizarCardapio() — não existe mais data-nome
      const produtoId = Number(card.getAttribute("data-id"));
      const quantidade = Number(card.querySelector(".qtd-valor").textContent);

      salvarPedido(produtoId, quantidade, clicado);
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// atualizarPrecoCard()
// Aula 8: sem mudanças. Recalcula o preço no card quando muda a quantidade.
// ─────────────────────────────────────────────────────────────────────────────
function atualizarPrecoCard(box) {
  const card          = box.parentElement;
  const spanPreco     = card.querySelector(".preco");
  const precoUnitario = parseFloat(spanPreco.getAttribute("data-preco"));
  const quantidade    = Number(box.querySelector(".qtd-valor").textContent);
  const total         = precoUnitario * quantidade;

  spanPreco.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
  spanPreco.style.color = total > 150 ? "#c0392b" : "#e67e22";
}

// ─────────────────────────────────────────────────────────────────────────────
// salvarPedido(produtoId, quantidade, botao)
// Aula 8: guardava { nome, preco, qtd, subtotal } no localStorage.
//
// Aula 9: salva também produto_id — necessário para enviar à API.
//   O envio real acontece em pedidos.html via "Enviar para Cozinha".
//   Isso separa a montagem do pedido (aqui) do envio ao banco (pedidos.js),
//   tornando o POST /pedidos um momento explícito e ensinável.
//
//   Diferença do campo: Aula 8 usava qtd, Aula 9 usa quantidade —
//   para coincidir com o formato que criarPedido() do api.js espera.
// ─────────────────────────────────────────────────────────────────────────────
function salvarPedido(produtoId, quantidade, botao) {
  const card    = botao.parentElement;
  const nome    = card.querySelector("h3").textContent;
  const preco   = parseFloat(card.querySelector(".preco").getAttribute("data-preco"));
  const subtotal = preco * quantidade;

  // Padrão Aula 8: ler → modificar → salvar
  const lista = JSON.parse(localStorage.getItem("techfood_pedidos") || "[]");
  lista.push({
    produto_id: produtoId,  // ⚠ novo em Aula 9 — usado pelo criarPedido()
    quantidade,             // ⚠ renomeado de qtd para quantidade (formato API)
    nome,
    preco,
    subtotal,
  });
  localStorage.setItem("techfood_pedidos", JSON.stringify(lista));

  // Feedback visual — igual Aula 8
  botao.textContent           = "✓ Adicionado!";
  botao.style.backgroundColor = "#27ae60";

  atualizarContadorPedidos();

  setTimeout(function () {
    botao.textContent           = "Pedir Agora";
    botao.style.backgroundColor = "";
    botao.disabled              = false;

    const box = card.querySelector(".quantidade-box");
    if (box) {
      box.querySelector(".qtd-valor").textContent = "1";
      atualizarPrecoCard(box);
    }
  }, 1500);
}

// ─────────────────────────────────────────────────────────────────────────────
// atualizarContadorPedidos()
// Aula 8: lia o localStorage para contar pedidos.
// Aula 9: mantém localStorage — o carrinho fica aqui até o "Enviar para Cozinha".
//   Alteração: campo p.qtd → p.quantidade para coincidir com o novo formato.
// ─────────────────────────────────────────────────────────────────────────────
function atualizarContadorPedidos() {
  const lista = JSON.parse(localStorage.getItem("techfood_pedidos") || "[]");
  const total = lista.reduce(function (acc, p) { return acc + p.quantidade; }, 0);

  const linkMenu = document.querySelector("#menu a[href='pedidos.html']");
  if (!linkMenu) return;

  let badge = linkMenu.querySelector(".badge-menu");
  if (!badge) {
    linkMenu.insertAdjacentHTML("beforeend", "<span class='badge-menu'>0</span>");
    badge = linkMenu.querySelector(".badge-menu");
  }

  badge.textContent = total;
  linkMenu.classList.add("menu-ativo");
}


// ─────────────────────────────────────────────────────────────────────────────
// inicializarSubtotal()                               DESATIVADA NA AULA 9
// Aula 8: controlava o campo #qtd-lasanha que ficava fixo no index.html.
//   Quando o usuário digitava uma quantidade, recalculava o preço exibido.
//
// Por que não está no DOMContentLoaded da Aula 9?
//   O index.html da Aula 9 não tem mais cards fixos. O grid (#grid-cardapio)
//   começa vazio e é preenchido por renderizarCardapio() via API. Não existe
//   mais #qtd-lasanha no HTML — esta função não teria nada para encontrar.
//   A lógica de recalcular preço por quantidade é feita por atualizarPrecoCard(),
//   chamada pelos botões + e - em inicializarVitrine().
// ─────────────────────────────────────────────────────────────────────────────
// function inicializarSubtotal() {
//   var inputQtd   = document.querySelector("#qtd-lasanha");
//   var precoTexto = document.querySelector("#preco-lasanha");
//   var subTexto   = document.querySelector("#sub-lasanha");
//
//   if (!inputQtd || !precoTexto) return;
//
//   inputQtd.addEventListener("input", function () {
//     var precoUnitario = 45.0;
//     var quantidade    = Number(inputQtd.value);
//
//     if (isNaN(quantidade) || quantidade < 1) return;
//
//     var total = quantidade * precoUnitario;
//     precoTexto.textContent = "R$ " + total.toFixed(2).replace(".", ",");
//     precoTexto.style.color = total > 150 ? "#c0392b" : "#e67e22";
//
//     if (subTexto) {
//       subTexto.textContent =
//         quantidade > 1
//           ? quantidade + "x R$ " + precoUnitario.toFixed(2).replace(".", ",")
//           : "";
//     }
//   });
// }
