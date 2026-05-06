/* ==========================================================
   AULA 9 — Fetch API: Exemplos dos Slides
   Cada função demonstra um conceito isolado.
   Servidor precisa estar rodando em localhost:3000
   ========================================================== */

var API_URL    = "http://localhost:3000";
var consoleEl  = document.getElementById("console-visual");
var resultadoEl = document.getElementById("resultado-demo");

function log(html) {
  consoleEl.innerHTML = html;
}

function mostrarResultado(dados) {
  resultadoEl.classList.remove("resultado-vazio");
  resultadoEl.innerHTML = typeof dados === "string"
    ? dados
    : "<pre>" + JSON.stringify(dados, null, 2) + "</pre>";
}


// ── fetch sem await ──────────────────────────────────────────
function demoFetchSimples() {
  var resultado = fetch(API_URL + "/produtos");
  console.log(resultado);

  mostrarResultado("Veja o console (F12) — retornou uma Promise { pending }");
  log(
    'var resultado = fetch(<span class="laranja">"' + API_URL + '/produtos"</span>)<br>' +
    '→ <span class="vermelho">Promise { pending }</span> — os dados ainda não chegaram!<br><br>' +
    'O fetch é <span class="amarelo">assíncrono</span> — não bloqueia o JS.<br>' +
    'Sem await, você pega a promessa, não o resultado.'
  );
}


// ── fetch com .then() ────────────────────────────────────────
function demoFetchThen() {
  mostrarResultado("Buscando com .then()...");
  log('<span class="azul">Aguardando resposta do servidor...</span>');

  fetch(API_URL + "/produtos")
    .then(function (res) { return res.json(); })
    .then(function (dados) {
      mostrarResultado(dados.dados);
      log(
        'fetch(<span class="laranja">"/produtos"</span>)<br>' +
        '  .<span class="amarelo">then</span>(res => res.json())<br>' +
        '  .<span class="amarelo">then</span>(dados => exibir)<br><br>' +
        'Total de produtos: <span class="laranja">' + dados.total + '</span><br>' +
        'Encadeamento de Promises — funciona, mas pode ficar verboso.'
      );
    })
    .catch(function (erro) {
      log('<span class="vermelho">Erro: ' + erro.message + '</span>');
    });
}


// ── fetch com async/await ────────────────────────────────────
async function demoFetchAwait() {
  mostrarResultado("Buscando com async/await...");
  log('<span class="azul">Aguardando resposta do servidor...</span>');

  try {
    var res   = await fetch(API_URL + "/produtos");
    var dados = await res.json();

    mostrarResultado(dados.dados);
    log(
      '<span class="roxo">async function buscar()</span> {<br>' +
      '  const res   = <span class="amarelo">await</span> fetch(<span class="laranja">"/produtos"</span>)<br>' +
      '  const dados = <span class="amarelo">await</span> res.json()<br>' +
      '}<br><br>' +
      'Total: <span class="laranja">' + dados.total + '</span> produtos<br>' +
      'Mais legível que .then() — parece código síncrono mas não trava a página.'
    );
  } catch (erro) {
    log('<span class="vermelho">Erro: ' + erro.message + '</span>');
  }
}


// ── GET /produtos ────────────────────────────────────────────
async function demoGet() {
  mostrarResultado("Buscando produtos...");
  log('<span class="azul">GET /produtos...</span>');

  try {
    var res   = await fetch(API_URL + "/produtos");
    var dados = await res.json();

    mostrarResultado(dados.dados);
    log(
      '<span class="amarelo">GET</span> ' +
      '<span class="laranja">' + API_URL + '/produtos</span><br>' +
      '→ status: <span class="laranja">' + res.status + '</span> | ' +
      'res.ok: <span class="laranja">' + res.ok + '</span><br>' +
      '→ ' + dados.total + ' produto(s) retornado(s)'
    );
  } catch (erro) {
    log('<span class="vermelho">Erro de rede: ' + erro.message + '<br>Servidor está rodando?</span>');
  }
}


// ── GET filtrado ─────────────────────────────────────────────
async function demoGetFiltrado() {
  mostrarResultado("Filtrando disponíveis...");

  try {
    var res     = await fetch(API_URL + "/produtos");
    var dados   = await res.json();
    var disponiveis = dados.dados.filter(function (p) { return p.disponivel === 1; });

    mostrarResultado(disponiveis);
    log(
      'produtos.<span class="amarelo">filter</span>(' +
      'p => p.disponivel === <span class="laranja">1</span>)<br>' +
      '→ <span class="laranja">' + disponiveis.length + '</span> disponível(is) de ' +
      dados.total + ' total<br><br>' +
      'O <span class="amarelo">data-id</span> de cada produto é o produto_id<br>' +
      'que o back-end exige no POST /pedidos.'
    );
  } catch (erro) {
    log('<span class="vermelho">Erro: ' + erro.message + '</span>');
  }
}


// ── POST /pedidos ─────────────────────────────────────────────
async function demoPost() {
  mostrarResultado("Enviando pedido...");
  log('<span class="azul">POST /pedidos...</span>');

  var pedido = {
    cliente: "Aluno Teste",
    itens: [{ produto_id: 1, quantidade: 2 }]
  };

  try {
    var res   = await fetch(API_URL + "/pedidos", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(pedido)
    });
    var dados = await res.json();

    mostrarResultado(dados);
    log(
      '<span class="amarelo">POST</span> <span class="laranja">/pedidos</span><br>' +
      'body: <span class="laranja">' + JSON.stringify(pedido) + '</span><br><br>' +
      '→ status: <span class="laranja">' + res.status + '</span><br>' +
      '→ res.ok: <span class="laranja">' + res.ok + '</span><br>' +
      'O total foi calculado pelo <span class="amarelo">servidor</span> — não enviamos o preço!'
    );
  } catch (erro) {
    log('<span class="vermelho">Erro: ' + erro.message + '</span>');
  }
}


// ── fetch SEM try/catch ──────────────────────────────────────
function demoSemTryCatch() {
  mostrarResultado("Tentando sem try/catch — veja o console (F12)");
  log(
    'fetch(<span class="laranja">"http://localhost:9999/rota-falsa"</span>)<br>' +
    '  .then(r => r.json())<br><br>' +
    '<span class="vermelho">Sem try/catch:</span> o erro vai para o console de forma genérica.<br>' +
    'O usuário não vê nada — a página "trava" silenciosamente.'
  );

  fetch("http://localhost:9999/rota-falsa")
    .then(function (r) { return r.json(); })
    .then(function (d) { console.log(d); });
}


// ── fetch COM try/catch ──────────────────────────────────────
async function demoComTryCatch() {
  mostrarResultado("Tentando com try/catch...");

  try {
    var res = await fetch("http://localhost:9999/rota-falsa");
    var d   = await res.json();
    mostrarResultado(d);
  } catch (erro) {
    mostrarResultado("❌ Servidor indisponível — tente novamente mais tarde.");
    log(
      '<span class="roxo">try</span> {<br>' +
      '  await fetch(<span class="laranja">"...rota-falsa"</span>)<br>' +
      '} <span class="roxo">catch</span>(erro) {<br>' +
      '  <span class="amarelo">// controlamos a mensagem de erro!</span><br>' +
      '}<br><br>' +
      'erro.message: <span class="vermelho">' + "Failed to fetch" + '</span><br>' +
      'Com try/catch você decide o que mostrar para o usuário.'
    );
  }
}


// ── res.ok — rota inexistente ────────────────────────────────
async function demoResOk() {
  mostrarResultado("Acessando rota inexistente...");

  try {
    var res   = await fetch(API_URL + "/rota-que-nao-existe");
    var dados = await res.json();

    log(
      'fetch(<span class="laranja">"/rota-que-nao-existe"</span>)<br>' +
      '→ status: <span class="vermelho">' + res.status + '</span> | ' +
      'res.ok: <span class="vermelho">' + res.ok + '</span><br><br>' +
      '<span class="vermelho">fetch NÃO lança erro em 404 ou 500!</span><br>' +
      'O catch não é acionado — precisamos verificar <span class="amarelo">res.ok</span> manualmente.<br><br>' +
      'if (!res.ok) throw new Error(dados.erro)'
    );

    mostrarResultado("Status " + res.status + " — res.ok: " + res.ok + " — fetch não jogou no catch!");

    if (!res.ok) throw new Error(dados.erro || "Rota não encontrada");

  } catch (erro) {
    log(
      log +
      '<br><span class="amarelo">Agora sim o catch foi acionado:</span> ' +
      '<span class="vermelho">' + erro.message + '</span>'
    );
  }
}


// ── sessionStorage ───────────────────────────────────────────
function demoSessionSet() {
  sessionStorage.setItem("eco_usuario", "João da Silva");
  mostrarResultado("Nome salvo no sessionStorage!");
  log(
    'sessionStorage.<span class="amarelo">setItem</span>(' +
    '<span class="laranja">"eco_usuario"</span>, <span class="laranja">"João da Silva"</span>)<br><br>' +
    'Dura enquanto a aba estiver aberta.<br>' +
    'Feche a aba e abra — o nome some.<br>' +
    'Diferente do localStorage que fica até limpar manualmente.'
  );
}

function demoSessionGet() {
  var nome = sessionStorage.getItem("eco_usuario");
  mostrarResultado(nome ? "Nome na sessão: " + nome : "Nenhum nome salvo — rode setItem primeiro!");
  log(
    'sessionStorage.<span class="amarelo">getItem</span>(' +
    '<span class="laranja">"eco_usuario"</span>)<br>' +
    '→ <span class="laranja">' + (nome || "null") + '</span>'
  );
}

function demoSessionClear() {
  sessionStorage.removeItem("eco_usuario");
  mostrarResultado("Nome removido da sessão.");
  log(
    'sessionStorage.<span class="amarelo">removeItem</span>(' +
    '<span class="laranja">"eco_usuario"</span>)<br>' +
    '→ chave removida — getItem agora retorna <span class="vermelho">null</span>'
  );
}


// ── Reset ────────────────────────────────────────────────────
function resetDemo() {
  resultadoEl.className = "resultado-vazio";
  resultadoEl.textContent = "Nenhuma requisição feita ainda...";
  consoleEl.innerHTML = '<p class="console-placeholder">Clique em um botão para ver o resultado aqui...</p>';
}