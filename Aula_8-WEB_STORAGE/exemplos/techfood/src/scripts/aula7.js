/* ==========================================================
   AULA 07: DOM AVANÇADO - TECHFOOD
   Navegação na Árvore, Criação de Elementos e Delegação

   ORDEM DE ESCRITA NO LIVE CODE (igual ao roteiro):
   1. Saudação e hover  (mantidos da Aula 6)
   2. Delegação de eventos no <main> com filtro
   3. Quantidade moderna com + e - (dentro da delegação)
   4. Navegação com parentElement no botão Pedir Agora
   5. insertAdjacentHTML: badge no card
   6. createElement + appendChild: resumo do pedido
   7. remove(): botão ✕ e botão Limpar tudo
   ========================================================== */


// ─────────────────────────────────────────────────────────
// PARTE 1 — Mantidos da Aula 6 (copiar, não reescrever)
// ─────────────────────────────────────────────────────────

const saudacao = document.querySelector("#boas-vindas");
const hora = new Date().getHours();
if (saudacao) {
  saudacao.textContent =
    hora < 12
      ? "Bom dia! Qual o seu pedido?"
      : "Boa tarde! Confira nosso cardápio.";
}

const cards = document.querySelectorAll(".card");
cards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-5px)";
    card.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0)";
    card.style.boxShadow = "none";
  });
});


// ─────────────────────────────────────────────────────────
// PARTE 2 — DELEGAÇÃO DE EVENTOS (escrever ao vivo)
//
// Em vez de um listener em CADA botão (como na Aula 6),
// colocamos UM único listener no <main>.
// Ele captura qualquer clique dentro da página e a gente
// filtra pelo event.target para saber o que foi clicado.
//
// event.target → o elemento EXATO que recebeu o clique
// classList.contains → verifica se tem a classe esperada
// return → aborta a função se não for o que queremos
// ─────────────────────────────────────────────────────────

const main = document.querySelector("main");

main.addEventListener("click", (event) => {
  const clicado = event.target;


  // ───────────────────────────────────────────────────────
  // PARTE 3 — QUANTIDADE MODERNA (escrever ao vivo)
  //
  // Os botões - e + também estão dentro do <main>,
  // então a delegação já os captura automaticamente.
  //
  // parentElement sobe do botão clicado para o .quantidade-box
  // De lá, querySelector desce até o .qtd-valor (o número)
  //
  // Math.max(1, valor - 1): garante que nunca vai abaixo de 1
  // Math.max retorna o MAIOR entre os dois números.
  // Se o cálculo der 0, ele devolve 1.
  // ───────────────────────────────────────────────────────

  if (clicado.classList.contains("btn-menos")) {
    const box = clicado.parentElement;
    const spanQtd = box.querySelector(".qtd-valor");
    const valorAtual = Number(spanQtd.textContent);
    spanQtd.textContent = Math.max(1, valorAtual - 1);
    atualizarPrecoCard(box);
    return;
  }

  if (clicado.classList.contains("btn-mais")) {
    const box = clicado.parentElement;
    const spanQtd = box.querySelector(".qtd-valor");
    spanQtd.textContent = Number(spanQtd.textContent) + 1;
    atualizarPrecoCard(box);
    return;
  }


  // ───────────────────────────────────────────────────────
  // PARTE 4 — NAVEGAÇÃO COM parentElement (escrever ao vivo)
  //
  // Estrutura HTML do card:
  //   <article class="card">            ← card (parentElement do botão)
  //     <h3>Lasanha Bolonhesa</h3>      ← filho do card
  //     <div class="quantidade-box">
  //       <span class="qtd-valor">2</span>
  //     </div>
  //     <span class="preco">R$ 90,00</span>
  //     <button class="btn-pedido">     ← event.target (clicado)
  //
  // clicado.parentElement → sobe para o <article>
  // card.querySelector("h3") → desce para pegar o nome
  // card.querySelector(".qtd-valor") → quantidade atual
  // card.querySelector(".preco") → preço já calculado
  // ───────────────────────────────────────────────────────

  if (clicado.classList.contains("btn-pedido")) {
    event.preventDefault();

    const card = clicado.parentElement;
    const nomePrato = card.querySelector("h3").textContent;
    const quantidade = card.querySelector(".qtd-valor").textContent;
    const precoExibido = card.querySelector(".preco").textContent;

    // Feedback visual no botão (igual Aula 6 — alunos já conhecem)
    clicado.textContent = "✓ Adicionado!";
    clicado.style.backgroundColor = "#27ae60";
    clicado.disabled = true;

    setTimeout(() => {
      clicado.textContent = "Pedir Agora";
      clicado.style.backgroundColor = "";
      clicado.disabled = false;
    }, 1500);


    // ─────────────────────────────────────────────────────
    // PARTE 5 — insertAdjacentHTML: badge no card (escrever ao vivo)
    //
    // Insere um badge "✔ No resumo" DENTRO do card,
    // como último filho ("beforeend"), sem apagar nada.
    //
    // As 4 posições do insertAdjacentHTML:
    //   "beforebegin" → antes do elemento (irmão anterior)
    //   "afterbegin"  → dentro, como PRIMEIRO filho
    //   "beforeend"   → dentro, como ÚLTIMO filho  ← usamos
    //   "afterend"    → depois do elemento (irmão seguinte)
    //
    // Por que não innerHTML +=?
    // O += destrói e recria todo o HTML do card,
    // perdendo os eventos já adicionados.
    // insertAdjacentHTML adiciona SEM destruir nada.
    //
    // Verificamos se o badge já existe para não duplicar.
    // ─────────────────────────────────────────────────────
    if (!card.querySelector(".badge-adicionado")) {
      card.insertAdjacentHTML(
        "beforeend",
        "<span class='badge-adicionado'>✔ No resumo</span>"
      );
    }

    // Chama a função que cria o item no resumo (Parte 6)
    adicionarItemAoResumo(nomePrato, quantidade, precoExibido, card);
  }
});


// ─────────────────────────────────────────────────────────
// PARTE 3 (continuação) — Função auxiliar de preço
//
// Chamada pelos botões + e - para recalcular o preço no card.
// parentElement sobe da .quantidade-box até o .card,
// de onde lemos o data-preco (preço unitário no HTML).
// ─────────────────────────────────────────────────────────

function atualizarPrecoCard(box) {
  const card = box.parentElement;
  const spanPreco = card.querySelector(".preco");
  const precoUnitario = parseFloat(spanPreco.getAttribute("data-preco"));
  const quantidade = Number(box.querySelector(".qtd-valor").textContent);
  const total = precoUnitario * quantidade;
  spanPreco.textContent = "R$ " + total.toFixed(2).replace(".", ",");
  spanPreco.style.color = total > 150 ? "#c0392b" : "#e67e22";
}


// ─────────────────────────────────────────────────────────
// PARTE 6 — createElement + appendChild (escrever ao vivo)
//
// Constrói este HTML via JavaScript:
//   <li class="item-resumo">
//     <span>2x Lasanha Bolonhesa — R$ 90,00</span>
//     <button class="btn-remover">✕</button>
//   </li>
//
// createElement → cria o elemento na MEMÓRIA (não na página)
// appendChild   → insere no lugar certo SEM apagar o que existe
//
// Por que não innerHTML no container?
// innerHTML apaga os itens anteriores a cada chamada.
// createElement + appendChild ADICIONA sem destruir nada.
// ─────────────────────────────────────────────────────────

function adicionarItemAoResumo(nome, qtd, preco, cardOrigem) {
  const secaoResumo = document.querySelector("#secao-resumo");
  const listaResumo = document.querySelector("#lista-resumo");

  if (!secaoResumo || !listaResumo) return;

  // Exibe a seção que estava oculta (display:none no CSS)
  secaoResumo.style.display = "block";

  // Passo 1: cria o <li>
  const itemLi = document.createElement("li");
  itemLi.classList.add("item-resumo");

  // Passo 2: cria o <span> com o texto
  const textoSpan = document.createElement("span");
  textoSpan.textContent = qtd + "x " + nome + " — " + preco;

  // Passo 3: cria o botão ✕
  const btnRemover = document.createElement("button");
  btnRemover.textContent = "✕";
  btnRemover.classList.add("btn-remover");


  // ───────────────────────────────────────────────────────
  // PARTE 7 — remove() (escrever ao vivo)
  //
  // Ao clicar no ✕:
  // 1. itemLi.remove() → o <li> se remove da lista
  // 2. badge.remove()  → o badge some do card de origem
  // 3. Se a lista ficou vazia, esconde a seção de resumo
  //
  // remove() é o oposto de appendChild:
  // o elemento se retira da página por conta própria,
  // sem precisar do pai para isso.
  // ───────────────────────────────────────────────────────
  btnRemover.addEventListener("click", () => {
    itemLi.remove();

    const badge = cardOrigem.querySelector(".badge-adicionado");
    if (badge) badge.remove();

    if (listaResumo.children.length === 0) {
      secaoResumo.style.display = "none";
    }
  });

  // Passo 4: monta a estrutura e insere na página
  itemLi.appendChild(textoSpan);
  itemLi.appendChild(btnRemover);
  listaResumo.appendChild(itemLi);
}


// ─────────────────────────────────────────────────────────
// PARTE 7 (continuação) — Botão Limpar Tudo
//
// Remove todos os filhos da lista usando firstElementChild
// em loop: enquanto existir um filho, remove.
// Depois remove todos os badges dos cards e esconde a seção.
// ─────────────────────────────────────────────────────────

const btnLimpar = document.querySelector("#btn-limpar");
if (btnLimpar) {
  btnLimpar.addEventListener("click", () => {
    const listaResumo = document.querySelector("#lista-resumo");
    const secaoResumo = document.querySelector("#secao-resumo");

    // Remove todos os badges dos cards
    document.querySelectorAll(".badge-adicionado").forEach((b) => b.remove());

    // Remove filhos da lista um a um com firstElementChild
    while (listaResumo.firstElementChild) {
      listaResumo.firstElementChild.remove();
    }

    secaoResumo.style.display = "none";
  });
}