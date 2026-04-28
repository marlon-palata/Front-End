/* ==========================================================
   AULA 8 — Web Storage: Exemplos dos Slides
   Cada função demonstra um conceito isolado.
   ========================================================== */

var consoleEl = document.getElementById("console-visual");

var PEDIDO_EXEMPLO = {
  nome: "Lasanha Bolonhesa",
  preco: 45.0,
  qtd: 2,
  subtotal: 90.0,
};

function log(html) {
  consoleEl.innerHTML = html;
}

// ── setItem: salvar string ────────────────────────────────
function demoSetItem() {
  localStorage.setItem("demo_nome", "TechFood");

  log(
    'localStorage.<span class="amarelo">setItem</span>' +
      '(<span class="laranja">"demo_nome"</span>, <span class="laranja">"TechFood"</span>)<br><br>' +
      "✔ Dado salvo no navegador.<br>" +
      '<span class="azul">Abra F12 → Application → Local Storage para ver!</span>',
  );
}

// ── getItem: ler string ───────────────────────────────────
function demoGetItem() {
  var valor = localStorage.getItem("demo_nome");

  log(
    'localStorage.<span class="amarelo">getItem</span>' +
      '(<span class="laranja">"demo_nome"</span>)<br>' +
      '→ <span class="laranja">' +
      (valor !== null ? '"' + valor + '"' : "null (chave não existe)") +
      "</span><br><br>" +
      (valor === null
        ? '<span class="vermelho">⚠ Rode setItem primeiro!</span>'
        : "✔ Dado recuperado com sucesso."),
  );
}

// ── Número: conversão necessária ─────────────────────────
function demoNumero() {
  localStorage.setItem("demo_preco", 45.0);
  var lido = localStorage.getItem("demo_preco");
  var convertido = Number(lido);

  log(
    'localStorage.<span class="amarelo">setItem</span>' +
      '(<span class="laranja">"demo_preco"</span>, <span class="laranja">45.00</span>)<br>' +
      '→ salvo como string: <span class="vermelho">"45"</span><br><br>' +
      'localStorage.<span class="amarelo">getItem</span>(<span class="laranja">"demo_preco"</span>)<br>' +
      '→ lido como: <span class="vermelho">"' +
      lido +
      '"</span> (typeof: ' +
      typeof lido +
      ")<br><br>" +
      '<span class="amarelo">Number</span>(<span class="laranja">"' +
      lido +
      '"</span>) → ' +
      '<span class="laranja">' +
      convertido +
      "</span> (typeof: " +
      typeof convertido +
      ")<br>" +
      "✔ Sempre converta ao ler!",
  );
}

// ── Booleano: pegadinha clássica ─────────────────────────
function demoBooleano() {
  localStorage.setItem("demo_logado", true);
  var lido = localStorage.getItem("demo_logado");

  log(
    'localStorage.<span class="amarelo">setItem</span>' +
      '(<span class="laranja">"demo_logado"</span>, <span class="laranja">true</span>)<br>' +
      '→ salvo como string: <span class="vermelho">"true"</span><br><br>' +
      'localStorage.<span class="amarelo">getItem</span>(<span class="laranja">"demo_logado"</span>)<br>' +
      '→ <span class="vermelho">"' +
      lido +
      '"</span> (é uma string, não booleano!)<br><br>' +
      '<span class="vermelho">⚠ Cuidado:</span> if("false") → <span class="vermelho">true</span> ' +
      "(string não-vazia é truthy!)<br>" +
      'Correto: <span class="amarelo">getItem(...) === "true"</span> → ' +
      '<span class="laranja">' +
      (lido === "true") +
      "</span>",
  );
}

// ── JSON.stringify: objeto → string ──────────────────────
function demoStringify() {
  var resultado = JSON.stringify(PEDIDO_EXEMPLO);
  localStorage.setItem("demo_pedido", resultado);

  log(
    '<span class="amarelo">JSON.stringify</span>(pedido)<br>' +
      '→ <span class="laranja">\'' +
      resultado +
      "'</span><br><br>" +
      "✔ Agora é uma string — pode ser salva no localStorage.<br>" +
      '<span class="azul">Abra F12 → Application → Local Storage para ver!</span>',
  );
}

// ── JSON.parse: string → objeto ───────────────────────────
function demoParse() {
  var string = localStorage.getItem("demo_pedido");

  if (!string) {
    log('<span class="vermelho">⚠ Rode JSON.stringify primeiro!</span>');
    return;
  }

  var objeto = JSON.parse(string);

  log(
    '<span class="amarelo">JSON.parse</span>(stringDoStorage)<br>' +
      "→ objeto recuperado:<br>" +
      '  .nome: <span class="laranja">"' +
      objeto.nome +
      '"</span><br>' +
      '  .preco: <span class="laranja">' +
      objeto.preco +
      "</span><br>" +
      '  .qtd: <span class="laranja">' +
      objeto.qtd +
      "</span><br>" +
      '  .subtotal: <span class="laranja">' +
      objeto.subtotal +
      "</span><br><br>" +
      "✔ O objeto voltou completo com todos os tipos corretos.",
  );
}

// ── Padrão seguro com || ─────────────────────────────────
function demoPadraoSeguro() {
  var chaveInexistente = localStorage.getItem("chave_que_nao_existe");

  log(
    'localStorage.<span class="amarelo">getItem</span>' +
      '(<span class="laranja">"chave_que_nao_existe"</span>)<br>' +
      '→ <span class="vermelho">' +
      chaveInexistente +
      "</span> (null!)<br><br>" +
      '<span class="vermelho">JSON.parse(null)</span> → lança <span class="vermelho">erro</span>!<br><br>' +
      "Padrão seguro:<br>" +
      'JSON.parse(getItem(<span class="laranja">"chave"</span>) ' +
      '<span class="amarelo">|| "[]"</span>)<br>' +
      '→ <span class="laranja">[]</span> (array vazio — sem erro!) ✔<br><br>' +
      '<span class="azul">Use sempre este padrão com listas no localStorage.</span>',
  );
}

// ── Adicionar pedido à lista ─────────────────────────────
function demoAdicionarPedido() {
  // Padrão: ler → push → salvar
  var lista = JSON.parse(localStorage.getItem("demo_lista_pedidos") || "[]");
  lista.push(PEDIDO_EXEMPLO);
  localStorage.setItem("demo_lista_pedidos", JSON.stringify(lista));

  log(
    '<span class="roxo">Padrão ler → push → salvar:</span><br><br>' +
      '1. <span class="amarelo">getItem</span> → lê lista atual ' +
      '(<span class="laranja">' +
      (lista.length - 1) +
      "</span> itens antes)<br>" +
      '2. <span class="amarelo">push</span>(novoPedido) → adiciona ao array<br>' +
      '3. <span class="amarelo">setItem</span> → salva lista atualizada<br><br>' +
      'Lista agora tem <span class="laranja">' +
      lista.length +
      "</span> pedido(s).<br>" +
      '<span class="azul">Clique novamente para adicionar mais!</span>',
  );
}

// ── Ler lista de pedidos ─────────────────────────────────
function demoLerPedidos() {
  var lista = JSON.parse(localStorage.getItem("demo_lista_pedidos") || "[]");

  if (lista.length === 0) {
    log(
      '<span class="vermelho">Lista vazia. Adicione um pedido primeiro!</span>',
    );
    return;
  }

  var html =
    '<span class="roxo">Lista de pedidos no localStorage:</span><br><br>';
  lista.forEach(function (p, i) {
    html +=
      i +
      1 +
      '. <span class="laranja">' +
      p.nome +
      "</span>" +
      " — " +
      p.qtd +
      "x — R$ " +
      p.subtotal.toFixed(2) +
      "<br>";
  });

  var total = lista.reduce(function (acc, p) {
    return acc + p.subtotal;
  }, 0);
  html += '<br>Total: <span class="amarelo">R$ ' + total.toFixed(2) + "</span>";

  log(html);
}

// ── removeItem ───────────────────────────────────────────
function demoRemoveItem() {
  localStorage.setItem("demo_remover", "este dado vai sumir");
  var antes = localStorage.getItem("demo_remover");

  localStorage.removeItem("demo_remover");
  var depois = localStorage.getItem("demo_remover");

  log(
    'Antes do removeItem: <span class="laranja">"' +
      antes +
      '"</span><br><br>' +
      'localStorage.<span class="amarelo">removeItem</span>' +
      '(<span class="laranja">"demo_remover"</span>)<br><br>' +
      'Depois: <span class="vermelho">' +
      depois +
      "</span> (chave removida)<br><br>" +
      '<span class="azul">removeItem</span> remove UMA chave específica.<br>' +
      '<span class="roxo">Prefira sempre ao clear() em apps reais.</span>',
  );
}

// ── clear ────────────────────────────────────────────────
function demoClear() {
  var qtdAntes = localStorage.length;
  localStorage.clear();

  log(
    'localStorage.<span class="amarelo">clear()</span><br><br>' +
      'Chaves antes: <span class="laranja">' +
      qtdAntes +
      "</span><br>" +
      'Chaves depois: <span class="vermelho">' +
      localStorage.length +
      "</span><br><br>" +
      '<span class="vermelho">⚠ ATENÇÃO: clear() apagou TUDO no storage deste domínio!</span><br>' +
      "Incluindo dados de outros scripts da mesma página.<br><br>" +
      '<span class="roxo">Use clear() com cuidado — prefira removeItem("chave") quando possível.</span>',
  );
}

// ── Reset ────────────────────────────────────────────────
function resetDemo() {
  // Remove só as chaves de demo, não limpa tudo
  [
    "demo_nome",
    "demo_preco",
    "demo_logado",
    "demo_pedido",
    "demo_lista_pedidos",
    "demo_remover",
  ].forEach(function (k) {
    localStorage.removeItem(k);
  });

  consoleEl.innerHTML =
    '<p class="console-placeholder">Clique em um botão acima para ver o resultado aqui...</p>';
}
