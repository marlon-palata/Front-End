/* ==========================================================
   AULA 7 — DOM Avançado: Exemplos SENAI
   ========================================================== */

const lista = document.getElementById("lista");
const consoleEl = document.getElementById("console-visual");
const htmlOriginal = lista.innerHTML;

let noAtualSibling = null;
let parentInspectorAtivo = false;
let delegacaoAtiva = false;
let listenersIndividuaisAtivos = false;
let simuladorBubblingAtivo = false;

function log(html) {
  consoleEl.innerHTML = html;
}

function limparDestaques() {
  document.querySelectorAll("*").forEach((el) => {
    el.classList.remove(
      "destaque-pai",
      "destaque-filho",
      "destaque-sibling",
      "destaque-clone",
      "escuta-ativa",
      "bubbling-efeito",
    );
  });
  document.querySelectorAll(".badge-inserido").forEach((b) => b.remove());
}

// ── parentElement Inspector ──
function handlerParentInspector(event) {
  event.preventDefault();
  limparDestaques();
  const clicado = event.target;
  if (clicado === lista || clicado === document.body) return;

  const pai = clicado.parentElement;
  clicado.classList.add("destaque-filho");
  if (pai) pai.classList.add("destaque-pai");

  log(`🔍 <strong>Elemento Clicado:</strong> &lt;${clicado.tagName.toLowerCase()}&gt; <br> 
       ⬆️ <strong>parentElement (Pai Direto):</strong> &lt;${pai ? pai.tagName.toLowerCase() : "null"}&gt;<br><br>
       <em>Dica: O JavaScript ignora quem é o "avô". Ele retorna estritamente a tag que envolve o elemento clicado de forma imediata.</em>`);
}

function demoParentElement() {
  const btn = document.getElementById("btn-parent");
  parentInspectorAtivo = !parentInspectorAtivo;
  if (parentInspectorAtivo) {
    document.addEventListener("click", handlerParentInspector, true);
    btn.textContent = "parentElement Inspector: ON 🟢";
    btn.style.backgroundColor = "#27ae60";
    log(
      "<strong>Inspetor Ativo!</strong> Clique em qualquer texto, botão ou espaço em branco dentro dos cards para ver a relação de Pai e Filho.",
    );
  } else {
    document.removeEventListener("click", handlerParentInspector, true);
    btn.textContent = "parentElement Inspector: OFF 🔴";
    btn.style.backgroundColor = "";
    limparDestaques();
    log("Inspetor desligado.");
  }
}

// ── Children vs ChildNodes (AGORA MOSTRA O CONTEÚDO REAL) ──
function demoChildren() {
  limparDestaques();

  // Extrai visualmente o que tem dentro do array de children
  const arrayChildren = Array.from(lista.children)
    .map(
      (el) => `<span class="azul">&lt;${el.tagName.toLowerCase()}&gt;</span>`,
    )
    .join(", ");

  // Extrai visualmente o que tem dentro do array de childNodes
  const arrayNodes = Array.from(lista.childNodes)
    .map((n) =>
      n.nodeType === 3
        ? '<span class="vermelho">#text(↵)</span>'
        : `<span class="azul">&lt;${n.tagName.toLowerCase()}&gt;</span>`,
    )
    .join(", ");

  Array.from(lista.children).forEach((c) => c.classList.add("destaque-filho"));

  log(`
    <strong class="amarelo">lista.children</strong> (${lista.children.length} itens):<br>
    <span class="laranja">[ ${arrayChildren} ]</span><br><br>
    <strong class="vermelho">lista.childNodes</strong> (${lista.childNodes.length} itens):<br>
    <span class="roxo">[ ${arrayNodes} ]</span><br><br>
    💡 <em>Repare como o childNodes é perigoso! Ele captura as quebras de linha (Enter) do seu código HTML e as transforma em nós de texto invisíveis. Na prática, use sempre <strong>children</strong>.</em>
  `);
}

// ── Bubbling ──
function handlerBubbling(e) {
  const btn = e.currentTarget;
  const card = btn.closest(".card");
  const section = lista;
  const usarStop = document.getElementById("chk-stop")?.checked;

  limparDestaques();

  log("1. Clique capturado no <span class='amarelo'>BOTÃO (Filho)</span>");
  btn.classList.add("bubbling-efeito");

  if (usarStop) {
    e.stopPropagation();
    log(
      "🛑 <strong>stopPropagation()</strong> ativado. A bolha estourou no botão! Os pais não farão ideia de que o clique aconteceu.",
    );
    return;
  }

  setTimeout(() => {
    log(
      "1. Botão -> 2. A bolha subiu e disparou o evento no <span class='laranja'>CARD (Pai)</span>",
    );
    card.classList.add("destaque-pai");
  }, 600);

  setTimeout(() => {
    log(
      "1. Botão -> 2. Card -> 3. A bolha alcançou a <span class='azul'>SECTION (Avô)</span>!",
    );
    section.style.borderColor = "#3498db";
    section.style.backgroundColor = "#ebf5fb";
  }, 1200);
}

function demoBubbling() {
  const btnCtrl = document.getElementById("btn-bubbling");
  simuladorBubblingAtivo = !simuladorBubblingAtivo;

  if (simuladorBubblingAtivo) {
    btnCtrl.textContent = "Simulador de Bubbling: ON 🟢";
    btnCtrl.style.backgroundColor = "#27ae60";
    log(`<div style="background:#34495e; padding:10px; border-radius:5px; color:white;">
          <input type="checkbox" id="chk-stop"> Impedir propagação (Ativar <strong>event.stopPropagation()</strong>)
         </div><br>👆 Clique em qualquer botão "Leia Mais" para ver a ordem de disparo dos eventos (a subida da bolha).`);

    document
      .querySelectorAll(".btn-leitura")
      .forEach((b) => b.addEventListener("click", handlerBubbling));
  } else {
    btnCtrl.textContent = "Simulador de Bubbling: OFF 🔴";
    btnCtrl.style.backgroundColor = "";
    document
      .querySelectorAll(".btn-leitura")
      .forEach((b) => b.removeEventListener("click", handlerBubbling));
    lista.style = "";
    limparDestaques();
    log("Simulador de Bubbling desligado.");
  }
}

// ── Listeners Individuais ──
function handlerIndividual(e) {
  limparDestaques();
  e.target.classList.add("escuta-ativa");
  log(
    `✅ <strong>Listener Disparado:</strong> O botão do card "<span class="amarelo">${e.target.closest(".card").querySelector("h2").textContent}</span>" executou sua função exclusiva.`,
  );
}

function demoRemoveListener() {
  const btnCtrl = document.getElementById("btn-remove-listener");
  listenersIndividuaisAtivos = !listenersIndividuaisAtivos;
  const botoes = document.querySelectorAll(".btn-leitura");

  if (listenersIndividuaisAtivos) {
    botoes.forEach((b) => {
      b.addEventListener("click", handlerIndividual);
      b.classList.add("escuta-ativa");
    });
    btnCtrl.textContent = "Listeners Individuais: ON 🟢";
    btnCtrl.style.backgroundColor = "#27ae60";
    log(
      "Ligamos um <strong>addEventListener</strong> separadamente para cada botão. <br>Eles estão pulsando para indicar que estão escutando o evento de 'click'. Tente clicar neles!",
    );
  } else {
    botoes.forEach((b) => {
      b.removeEventListener("click", handlerIndividual);
      b.classList.remove("escuta-ativa");
    });
    btnCtrl.textContent = "Listeners Individuais: OFF 🔴";
    btnCtrl.style.backgroundColor = "";
    limparDestaques();
    log(
      "<strong>removeEventListener</strong> executado em loop para todos os botões. <br>A 'escuta' foi cancelada e eles voltaram a ser botões inativos.",
    );
  }
}

// ── Delegação de Eventos ──
function demoDelegacao() {
  const btn = document.getElementById("btn-delegacao");
  delegacaoAtiva = !delegacaoAtiva;
  if (delegacaoAtiva) {
    lista.onclick = (e) => {
      limparDestaques();
      if (e.target.classList.contains("btn-leitura")) {
        e.target.closest(".card").classList.add("destaque-filho");
        log(
          `🎯 <strong>Delegação em Ação:</strong> Em vez de colocar um evento em cada botão, colocamos apenas 1 evento no Pai (Lista).<br>O Pai usou o <strong>event.target</strong> para identificar que você clicou no botão do card: <span class="amarelo">"${e.target.closest(".card").querySelector("h2").textContent}"</span>.`,
        );
      }
    };
    btn.textContent = "Delegação de Eventos: ON 🟢";
    btn.style.backgroundColor = "#27ae60";
    log(
      "Ouvinte único ativado na <span class='azul'>Section (Pai)</span>. Clique em algum botão 'Leia Mais' para ver como ele intercepta e identifica a ação.",
    );
  } else {
    lista.onclick = null;
    btn.textContent = "Delegação de Eventos: OFF 🔴";
    btn.style.backgroundColor = "";
    limparDestaques();
    log("Delegação desligada.");
  }
}

// ── Outras Funções (Aprimoradas) ──
function demoFirstLast() {
  limparDestaques();
  lista.firstElementChild?.classList.add("destaque-filho");
  lista.lastElementChild?.classList.add("destaque-sibling");
  log(
    `<strong>firstElementChild</strong> ignora quebras de linha e pega a primeira tag real (Verde).<br><strong>lastElementChild</strong> pega a última tag real (Roxo).`,
  );
}

function demoSiblingNext() {
  limparDestaques();
  if (!noAtualSibling || !lista.contains(noAtualSibling)) {
    noAtualSibling = lista.firstElementChild;
  } else if (noAtualSibling.nextElementSibling) {
    noAtualSibling = noAtualSibling.nextElementSibling;
  } else {
    log(
      'Fim da linha! <strong>nextElementSibling</strong> retornou <span class="vermelho">null</span> porque não há mais irmãos para frente.',
    );
    return;
  }
  noAtualSibling?.classList.add("destaque-filho");
  log(
    `Avançou para o próximo irmão: <span class="amarelo">"${noAtualSibling.querySelector("h2").textContent}"</span>.`,
  );
}

function demoSiblingPrev() {
  limparDestaques();
  if (!noAtualSibling || !lista.contains(noAtualSibling)) {
    noAtualSibling = lista.lastElementChild;
  } else if (noAtualSibling.previousElementSibling) {
    noAtualSibling = noAtualSibling.previousElementSibling;
  } else {
    log(
      'Início da linha! <strong>previousElementSibling</strong> retornou <span class="vermelho">null</span> porque não há mais irmãos para trás.',
    );
    return;
  }
  noAtualSibling?.classList.add("destaque-sibling");
  log(
    `Voltou para o irmão anterior: <span class="roxo">"${noAtualSibling.querySelector("h2").textContent}"</span>.`,
  );
}

function demoCreateElement() {
  const n = document.createElement("article");
  n.className = "card destaque-filho";
  n.innerHTML =
    "<h2>Novo Card</h2><p>Criado na memória e inserido.</p><button class='btn-leitura'>Leia Mais</button>";
  lista.appendChild(n);
  log(
    "<strong>appendChild()</strong> adiciona o novo elemento sempre como o <strong>último</strong> filho da lista.",
  );
}

function demoPrepend() {
  const n = document.createElement("article");
  n.className = "card destaque-sibling";
  n.innerHTML =
    "<h2>Urgente!</h2><p>Inserido no início.</p><button class='btn-leitura'>Leia Mais</button>";
  lista.prepend(n);
  log(
    "Diferente do appendChild, o <strong>prepend()</strong> empurra o novo elemento para ser o <strong>primeiro</strong> filho da lista.",
  );
}

function demoInsertAdjacent() {
  const c = lista.children[1];
  if (c) {
    c.insertAdjacentHTML(
      "beforeend",
      "<span class='badge-inserido'>✔ beforeend</span>",
    );
    log(
      "<strong>insertAdjacentHTML('beforeend', html)</strong> insere o conteúdo dentro da tag do elemento alvo, logo antes dele fechar (como último filho do card).",
    );
  } else {
    log("Erro: Card alvo não encontrado.");
  }
}

function demoClone() {
  const c = lista.firstElementChild?.cloneNode(true);
  if (c) {
    c.classList.add("destaque-clone");
    c.querySelector("h2").textContent =
      "[CÓPIA] " + c.querySelector("h2").textContent;
    lista.appendChild(c);
    log(
      "<strong>cloneNode(true)</strong> copiou toda a estrutura (tag pai + tags filhas + textos internos). Se usássemos (false), viria apenas a tag &lt;article&gt; vazia.",
    );
  }
}

function demoRemove() {
  const c = lista.lastElementChild;
  if (c) {
    const nome = c.querySelector("h2").textContent;
    c.remove();
    log(
      `<strong>remove()</strong> executado. O elemento "${nome}" deletou a si próprio do DOM.`,
    );
  } else {
    log("A lista já está vazia.");
  }
}

function demoPreventDefault() {
  log(`<form id="f-real" style="background:#34495e; padding:15px; border-radius:5px;">
        <label style="color:#fff; font-size:0.8rem; font-weight:bold;">Adicionar Notícia Dinâmica:</label>
        <input id="i-t" placeholder="Digite o título da notícia" required style="width:100%; margin:8px 0; padding:8px;">
        <button type="submit" style="background:#27ae60; color:white; border:none; padding:10px; width:100%; cursor:pointer; font-weight:bold;">Criar Card sem Recarregar</button>
       </form>`);

  document.getElementById("f-real").onsubmit = (e) => {
    e.preventDefault();
    const val = document.getElementById("i-t").value;
    const n = document.createElement("article");
    n.className = "card destaque-filho";
    n.innerHTML = `<h2>${val}</h2><p>Card criado capturando dados do form.</p><button class='btn-leitura'>Leia Mais</button>`;
    lista.prepend(n);
    log(
      `Magia do <strong>event.preventDefault()</strong>!<br>Ele impediu que a página recarregasse ao enviar o formulário, permitindo que o JS processasse o texto e criasse o card "${val}".`,
    );
  };
}

function resetDemo() {
  if (parentInspectorAtivo) demoParentElement();
  if (delegacaoAtiva) demoDelegacao();
  if (simuladorBubblingAtivo) demoBubbling();
  if (listenersIndividuaisAtivos) demoRemoveListener();

  noAtualSibling = null;
  lista.innerHTML = htmlOriginal;
  limparDestaques();
  lista.style = "";
  log(
    "<p class='console-placeholder'>Tudo zerado! A árvore original do HTML foi restaurada.</p>",
  );
}
