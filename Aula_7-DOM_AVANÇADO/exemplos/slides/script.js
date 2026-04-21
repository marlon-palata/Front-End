/* ==========================================================
   AULA 7 — DOM Avançado: Exemplos dos Slides
   Cada função demonstra um conceito isolado.
   ========================================================== */

const lista = document.getElementById("lista");
const consoleEl = document.getElementById("console-visual");

// Referência ao HTML original para o reset
const htmlOriginal = lista.innerHTML;

// ── Utilitários ──────────────────────────────────────────
function log(html) {
  consoleEl.innerHTML = html;
}

function limparDestaques() {
  document.querySelectorAll(".card").forEach((c) => {
    c.className = "card";
  });
  document.querySelectorAll(".badge-inserido").forEach((b) => b.remove());
}

// ─────────────────────────────────────────────────────────
// parentElement
// Clicamos num botão e subimos até o card pai.
// ─────────────────────────────────────────────────────────
function demoParentElement() {
  limparDestaques();
  const btn = lista.querySelector(".btn-leitura");

  // parentElement → sobe um nível: do <button> para o <article>
  const card = btn.parentElement;
  card.classList.add("destaque-pai");

  log(
    '<span class="amarelo">btn</span>.parentElement ' +
      '→ <span class="laranja">&lt;article class="card"&gt;</span><br>' +
      'card.querySelector(<span class="amarelo">"h2"</span>).textContent ' +
      '→ <span class="laranja">"' +
      card.querySelector("h2").textContent +
      '"</span>',
  );
}

// ─────────────────────────────────────────────────────────
// children
// Desce da lista para ver os filhos diretos.
// ─────────────────────────────────────────────────────────
function demoChildren() {
  limparDestaques();
  const total = lista.children.length;

  // Destaca todos os filhos diretos
  Array.from(lista.children).forEach((c) => c.classList.add("destaque-filho"));

  log(
    'lista.<span class="amarelo">children</span>.length ' +
      '→ <span class="laranja">' +
      total +
      "</span><br>" +
      '<span class="azul">HTMLCollection</span> — só elementos HTML<br>' +
      'lista.<span class="vermelho">childNodes</span>.length ' +
      '→ <span class="vermelho">' +
      lista.childNodes.length +
      "</span> " +
      '<span class="vermelho">(inclui espaços e quebras de linha!)</span>',
  );
}

// ─────────────────────────────────────────────────────────
// firstElementChild / lastElementChild
// ─────────────────────────────────────────────────────────
function demoFirstLast() {
  limparDestaques();
  const primeiro = lista.firstElementChild;
  const ultimo = lista.lastElementChild;

  primeiro.classList.add("destaque-filho");
  ultimo.classList.add("destaque-sibling");

  log(
    'lista.<span class="amarelo">firstElementChild</span> ' +
      '→ <span class="laranja">"' +
      primeiro.querySelector("h2").textContent +
      '"</span> (verde)<br>' +
      'lista.<span class="amarelo">lastElementChild</span>  ' +
      '→ <span class="roxo">"' +
      ultimo.querySelector("h2").textContent +
      '"</span> (roxo)',
  );
}

// ─────────────────────────────────────────────────────────
// nextElementSibling
// A partir do primeiro filho, anda para o lado.
// ─────────────────────────────────────────────────────────
function demoSibling() {
  limparDestaques();
  const primeiro = lista.firstElementChild;
  const segundo = primeiro.nextElementSibling;
  const terceiro = segundo ? segundo.nextElementSibling : null;

  primeiro.classList.add("destaque-filho");
  if (segundo) segundo.classList.add("destaque-sibling");
  if (terceiro) terceiro.classList.add("destaque-pai");

  log(
    'primeiro.<span class="amarelo">nextElementSibling</span> ' +
      '→ <span class="roxo">"' +
      (segundo ? segundo.querySelector("h2").textContent : "null") +
      '"</span><br>' +
      'segundo.<span class="amarelo">nextElementSibling</span>  ' +
      '→ <span class="laranja">"' +
      (terceiro ? terceiro.querySelector("h2").textContent : "null") +
      '"</span><br>' +
      'terceiro.<span class="amarelo">nextElementSibling</span> → <span class="vermelho">null</span> (último irmão)',
  );
}

// ─────────────────────────────────────────────────────────
// createElement + appendChild
// Cria um novo card e adiciona no final da lista.
// ─────────────────────────────────────────────────────────
function demoCreateElement() {
  limparDestaques();

  // 1. Cria o elemento na memória
  const novoCard = document.createElement("article");
  novoCard.classList.add("card", "destaque-filho");

  novoCard.innerHTML =
    "<h2>♻ Compostagem</h2>" +
    "<p>Criado com createElement + appendChild.</p>" +
    "<button class='btn-leitura'>Leia Mais</button>";

  // 2. Insere na página como último filho
  lista.appendChild(novoCard);

  log(
    '<span class="amarelo">createElement</span>(<span class="laranja">"article"</span>) ' +
      '→ cria na <span class="azul">memória</span> (ainda não aparece)<br>' +
      'lista.<span class="amarelo">appendChild</span>(novoCard) ' +
      '→ insere como <span class="laranja">último filho</span><br>' +
      'Total de cards agora: <span class="laranja">' +
      lista.children.length +
      "</span>",
  );
}

// ─────────────────────────────────────────────────────────
// insertAdjacentHTML — 4 posições
// Insere HTML em posição específica sem destruir o conteúdo.
// ─────────────────────────────────────────────────────────
function demoInsertAdjacent() {
  limparDestaques();

  // Remove badges anteriores
  document.querySelectorAll(".badge-inserido").forEach((b) => b.remove());

  const card = lista.children[1]; // segundo card
  card.classList.add("destaque-pai");

  // beforeend → dentro do card, como último filho
  card.insertAdjacentHTML(
    "beforeend",
    "<span class='badge-inserido'>✔ insertAdjacentHTML</span>",
  );

  log(
    'card.<span class="amarelo">insertAdjacentHTML</span>(<span class="laranja">"beforeend"</span>, html)<br>' +
      '<span class="azul">beforebegin</span> → antes do elemento (irmão anterior)<br>' +
      '<span class="azul">afterbegin</span>  → dentro, como <strong>primeiro</strong> filho<br>' +
      '<span class="laranja">beforeend</span>  → dentro, como <strong>último</strong> filho ← usamos aqui<br>' +
      '<span class="azul">afterend</span>    → depois do elemento (irmão seguinte)',
  );
}

// ─────────────────────────────────────────────────────────
// cloneNode
// Clona o primeiro card e insere no final.
// ─────────────────────────────────────────────────────────
function demoClone() {
  limparDestaques();
  const original = lista.firstElementChild;
  original.classList.add("destaque-filho");

  // cloneNode(true) → clona com todos os filhos internos
  const copia = original.cloneNode(true);
  copia.classList.remove("destaque-filho");
  copia.classList.add("destaque-clone");
  copia.querySelector("h2").textContent =
    "[CÓPIA] " + original.querySelector("h2").textContent;

  lista.appendChild(copia);

  log(
    'original.<span class="amarelo">cloneNode</span>(<span class="laranja">true</span>)  ' +
      '→ clona <span class="laranja">com</span> todos os filhos internos<br>' +
      'original.<span class="amarelo">cloneNode</span>(<span class="vermelho">false</span>) ' +
      '→ clona <span class="vermelho">sem</span> os filhos (só a tag)<br>' +
      '<span class="vermelho">⚠ Atenção:</span> IDs são copiados junto — altere após clonar!',
  );
}

// ─────────────────────────────────────────────────────────
// remove()
// Remove o último card da lista.
// ─────────────────────────────────────────────────────────
function demoRemove() {
  limparDestaques();
  const ultimo = lista.lastElementChild;

  if (!ultimo) {
    log(
      '<span class="vermelho">A lista está vazia — clique em ↺ Resetar primeiro.</span>',
    );
    return;
  }

  const nome = ultimo.querySelector("h2").textContent;
  ultimo.remove();

  log(
    'ultimo.<span class="amarelo">remove()</span> → o elemento se remove sozinho<br>' +
      'Removido: <span class="laranja">"' +
      nome +
      '"</span><br>' +
      'Cards restantes: <span class="laranja">' +
      lista.children.length +
      "</span>",
  );
}

// ─────────────────────────────────────────────────────────
// event.preventDefault()
// Mostra o que acontece COM e SEM o preventDefault num form.
// ─────────────────────────────────────────────────────────
function demoPreventDefault() {
  limparDestaques();

  // Cria um mini form temporário dentro do console
  consoleEl.innerHTML =
    '<span class="amarelo">event.preventDefault()</span> — impede o comportamento padrão do navegador<br><br>' +
    "Formulários recarregam a página ao serem enviados.<br>" +
    'Com <span class="amarelo">preventDefault()</span>, o JS assume o controle:<br><br>' +
    '<form id="form-demo" style="display:inline-flex;gap:8px;align-items:center">' +
    '  <input id="campo-demo" type="text" placeholder="Digite algo..." ' +
    '    style="padding:6px 10px;border-radius:6px;border:none;font-size:0.85rem">' +
    '  <button type="submit" ' +
    '    style="background:#e67e22;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer">' +
    "    Enviar" +
    "  </button>" +
    "</form>" +
    '<p id="resultado-form" style="margin-top:10px;color:#f1c40f"></p>';

  document.getElementById("form-demo").addEventListener("submit", (event) => {
    event.preventDefault(); // SEM isso, a página recarregaria!
    const valor = document.getElementById("campo-demo").value;
    document.getElementById("resultado-form").textContent =
      '✔ Enviado sem recarregar: "' + valor + '"';
  });
}

// ─────────────────────────────────────────────────────────
// Bubbling + stopPropagation()
// Mostra como o evento sobe na árvore.
// ─────────────────────────────────────────────────────────
function demoBubbling() {
  limparDestaques();

  // Remove listeners anteriores clonando o nó
  const card = lista.children[1];
  card.classList.add("destaque-pai");

  const btn = card.querySelector(".btn-leitura");

  let log_texto = "";

  // Listener no card (pai)
  card.addEventListener("click", function handler(e) {
    log_texto +=
      'Clique chegou no <span class="laranja">card</span> (bubbling!)<br>';
    consoleEl.innerHTML = log_texto;
    card.removeEventListener("click", handler);
  });

  // Listener no botão (filho)
  btn.addEventListener("click", function handler(e) {
    log_texto = 'Clique no <span class="amarelo">botão</span><br>';
    consoleEl.innerHTML =
      log_texto +
      '<span class="roxo">↑ O evento vai subir (bubble) para o card pai...</span><br>' +
      'Para parar: <span class="amarelo">event.stopPropagation()</span>';
    // Sem stopPropagation aqui — para o bubble acontecer e ser visto
    btn.removeEventListener("click", handler);
  });

  log(
    '<span class="amarelo">Clique no botão "Leia Mais"</span> do card central (laranja) para ver o bubbling...<br>' +
      'O evento dispara no botão e <span class="roxo">sobe</span> automaticamente para o card pai.',
  );
}

// ─────────────────────────────────────────────────────────
// Delegação de Eventos
// Um único listener na lista cuida de todos os botões.
// ─────────────────────────────────────────────────────────
function demoDelegacao() {
  limparDestaques();

  lista.addEventListener("click", function handler(event) {
    const clicado = event.target;
    if (!clicado.classList.contains("btn-leitura")) return;

    limparDestaques();
    const card = clicado.parentElement;
    card.classList.add("destaque-filho");

    log(
      '<span class="amarelo">event.target</span> → <span class="laranja">' +
        clicado.tagName +
        ".btn-leitura</span><br>" +
        'event.target.<span class="amarelo">parentElement</span> → card: ' +
        '<span class="laranja">"' +
        card.querySelector("h2").textContent +
        '"</span><br>' +
        '<span class="azul">Um único listener na lista cuida de TODOS os botões.</span>',
    );

    lista.removeEventListener("click", handler);
  });

  log(
    'Listener adicionado na <span class="amarelo">lista</span> (não em cada botão).<br>' +
      '<span class="laranja">Clique em qualquer "Leia Mais"</span> para ver a delegação em ação...',
  );
}

// ─────────────────────────────────────────────────────────
// removeEventListener
// Adiciona e depois remove um ouvinte do botão.
// ─────────────────────────────────────────────────────────
function demoRemoveListener() {
  limparDestaques();

  const btn = lista.firstElementChild.querySelector(".btn-leitura");
  lista.firstElementChild.classList.add("destaque-filho");

  let cliques = 0;

  function aoClicar() {
    cliques++;
    if (cliques === 1) {
      log(
        'Clique <span class="laranja">1</span>: listener ativo ✔<br>' +
          '<span class="amarelo">Clique de novo</span> — o listener será removido após o 2º clique.',
      );
    } else {
      btn.removeEventListener("click", aoClicar);
      log(
        'Clique <span class="laranja">2</span>: listener <span class="vermelho">removido</span>.<br>' +
          'btn.<span class="amarelo">removeEventListener</span>(<span class="laranja">"click"</span>, aoClicar)<br>' +
          'Agora o botão <span class="vermelho">não responde mais</span>.<br>' +
          '<span class="roxo">⚠ Funções anônimas não podem ser removidas — sempre nomeie!</span>',
      );
    }
  }

  btn.addEventListener("click", aoClicar);

  log(
    'Listener adicionado no <span class="laranja">primeiro botão "Leia Mais"</span>.<br>' +
      '<span class="amarelo">Clique 2 vezes</span> nele para ver o removeEventListener em ação...',
  );
}

// ─────────────────────────────────────────────────────────
// Reset — volta ao HTML original
// ─────────────────────────────────────────────────────────
function resetDemo() {
  lista.innerHTML = htmlOriginal;
  consoleEl.innerHTML =
    '<p class="console-placeholder">Clique em um botão acima para ver o resultado aqui...</p>';
}
