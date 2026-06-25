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

/* ════════════════════════════════════════════════════════════════
   ═══════════════════════════════════════════════════════════════
   AULA 10 — Cadastro com upload de imagem
   Conteúdo NOVO desta aula. As demos acima continuam funcionando.
   ═══════════════════════════════════════════════════════════════
   ════════════════════════════════════════════════════════════════ */


// ── FormData básico (só campos de texto) ─────────────────────
function demoFormDataMontar() {
  // FormData é um "pacote" que aceita texto E arquivo no mesmo envio.
  // Cada .append() adiciona um campo. Aqui ainda só com texto.
  var dados = new FormData();
  dados.append("nome", "Lasanha Bolonhesa");
  dados.append("preco", "42.00");
  dados.append("categoria", "massa");

  mostrarResultado(
    "FormData criado com 3 campos.\n" +
    "Use o botão ao lado para inspecionar o que tem dentro."
  );
  log(
    '<span class="azul">// FormData básico — só texto, sem arquivo ainda</span><br>' +
    'var dados = <span class="amarelo">new FormData</span>();<br>' +
    'dados.<span class="amarelo">append</span>(<span class="laranja">"nome"</span>, <span class="laranja">"Lasanha Bolonhesa"</span>);<br>' +
    'dados.<span class="amarelo">append</span>(<span class="laranja">"preco"</span>, <span class="laranja">"42.00"</span>);<br>' +
    'dados.<span class="amarelo">append</span>(<span class="laranja">"categoria"</span>, <span class="laranja">"massa"</span>);<br><br>' +
    '<span class="verde">Diferente de um objeto JS, FormData é otimizado pra enviar pela rede.</span>'
  );
}


// ── Inspecionar o que tem dentro do FormData ─────────────────
function demoFormDataInspecionar() {
  // FormData não tem console.log direto — usamos .entries() para ver.
  // Cada entry é um par [chave, valor].
  var dados = new FormData();
  dados.append("nome", "Pizza Margherita");
  dados.append("preco", "38.50");
  dados.append("categoria", "pizza");

  var linhas = [];
  dados.forEach(function (valor, chave) {
    linhas.push("  " + chave + " → " + valor);
  });

  mostrarResultado("Conteúdo do FormData:\n\n" + linhas.join("\n"));
  log(
    '<span class="azul">// Como ESPIAR o que tem num FormData</span><br>' +
    'dados.<span class="amarelo">forEach</span>(<span class="roxo">function</span>(valor, chave) {<br>' +
    '&nbsp;&nbsp;console.log(chave, valor);<br>' +
    '});<br><br>' +
    '<span class="verde">FormData não imprime no console.log normal — precisa iterar.</span>'
  );
}


// ── FormData com arquivo (precisa do <input type="file">) ────
function demoFormDataArquivo() {
  // Pega o arquivo escolhido no input (ou null se nada selecionado).
  var input = document.getElementById("input-arquivo-demo");
  var arquivo = input.files[0];

  if (!arquivo) {
    mostrarResultado("⚠ Escolha uma imagem no campo acima primeiro!");
    log(
      '<span class="vermelho">Nenhum arquivo selecionado.</span><br>' +
      'Use o botão "Escolher arquivo" no campo acima e tente de novo.'
    );
    return;
  }

  // Agora montamos um FormData com texto + arquivo juntos.
  var dados = new FormData();
  dados.append("nome", "Prato com foto");
  dados.append("preco", "29.90");
  dados.append("imagem", arquivo); // ← arquivo binário entra direto, sem conversão

  mostrarResultado(
    "FormData montado com texto + arquivo!\n\n" +
    "Arquivo: " + arquivo.name + "\n" +
    "Tipo: " + arquivo.type + "\n" +
    "Tamanho: " + (arquivo.size / 1024).toFixed(2) + " KB"
  );
  log(
    '<span class="azul">// FormData com arquivo binário</span><br>' +
    'var arquivo = input.<span class="amarelo">files</span>[<span class="laranja">0</span>];<br>' +
    'dados.<span class="amarelo">append</span>(<span class="laranja">"imagem"</span>, arquivo);<br><br>' +
    '<span class="verde">Arquivo entra direto — não precisa converter pra base64 nem nada.</span><br>' +
    '<span class="amarelo">⚠ Ao enviar com fetch, NÃO setar Content-Type — o navegador faz sozinho.</span>'
  );
}


// ── FileReader: arquivo → base64 ─────────────────────────────
function demoFileReaderBase64() {
  // Alternativa ao FormData: ler o arquivo como TEXTO base64
  // pra enviar dentro de um JSON normal.
  var input = document.getElementById("input-arquivo-demo");
  var arquivo = input.files[0];

  if (!arquivo) {
    mostrarResultado("⚠ Escolha uma imagem no campo acima primeiro!");
    return;
  }

  // FileReader é assíncrono — usa eventos onload/onerror.
  var leitor = new FileReader();
  leitor.onload = function () {
    // leitor.result é a string base64 com prefixo:
    //   "data:image/png;base64,iVBORw0KGgoAAAANS..."
    var base64Completo = leitor.result;
    var prefixo = base64Completo.substring(0, 50);
    var conteudo = base64Completo.split(",")[1]; // só a parte depois da vírgula
    var primeiros = conteudo.substring(0, 60);

    mostrarResultado(
      "Arquivo convertido em base64!\n\n" +
      "Tamanho original: " + (arquivo.size / 1024).toFixed(2) + " KB\n" +
      "Tamanho em base64: " + (base64Completo.length / 1024).toFixed(2) + " KB (~33% maior)\n\n" +
      "Início: " + prefixo + "...\n" +
      "Conteúdo: " + primeiros + "..."
    );
    log(
      '<span class="azul">// FileReader converte arquivo em string base64</span><br>' +
      'var leitor = <span class="amarelo">new FileReader</span>();<br>' +
      'leitor.<span class="amarelo">onload</span> = <span class="roxo">function</span>() {<br>' +
      '&nbsp;&nbsp;console.log(leitor.<span class="amarelo">result</span>);<br>' +
      '};<br>' +
      'leitor.<span class="amarelo">readAsDataURL</span>(arquivo);<br><br>' +
      '<span class="verde">Útil quando o back-end SÓ lê JSON (sem multer).</span><br>' +
      '<span class="vermelho">⚠ Incha o arquivo em ~33%. Não usar para arquivos grandes.</span>'
    );
  };
  leitor.onerror = function () {
    mostrarResultado("Erro ao ler o arquivo.");
  };
  leitor.readAsDataURL(arquivo); // dispara a leitura — onload é chamado quando termina
}


// ── Comparar body: JSON × FormData ───────────────────────────
function demoComparacaoBody() {
  // Mostrando os dois "estilos" lado a lado.
  // Esta demo NÃO faz fetch real — só mostra o código.
  mostrarResultado(
    "Veja a diferença entre os dois jeitos de enviar dados no fetch.\n" +
    "O console mostra o código lado a lado."
  );
  log(
    '<span class="azul">// JSON puro — só texto</span><br>' +
    'fetch(url, {<br>' +
    '&nbsp;&nbsp;method: <span class="laranja">"POST"</span>,<br>' +
    '&nbsp;&nbsp;<span class="amarelo">headers</span>: { <span class="laranja">"Content-Type"</span>: <span class="laranja">"application/json"</span> },<br>' +
    '&nbsp;&nbsp;body: <span class="amarelo">JSON.stringify</span>({ nome, preco })<br>' +
    '});<br><br>' +

    '<span class="azul">// FormData — texto + arquivo</span><br>' +
    'fetch(url, {<br>' +
    '&nbsp;&nbsp;method: <span class="laranja">"POST"</span>,<br>' +
    '&nbsp;&nbsp;<span class="vermelho">// NÃO defina headers Content-Type aqui!</span><br>' +
    '&nbsp;&nbsp;body: formData<br>' +
    '});<br><br>' +
    '<span class="verde">JSON = texto puro. FormData = pacote multipart com arquivo dentro.</span>'
  );
}


// ── O erro clássico: Content-Type forçado com FormData ───────
function demoContentTypeErrado() {
  // Esta demo educativa mostra o que NÃO fazer.
  // Não chega a executar o fetch — só ilustra.
  mostrarResultado(
    "⚠ ERRO CLÁSSICO QUE TODO MUNDO COMETE:\n\n" +
    "Se você forçar Content-Type: application/json em um fetch com\n" +
    "FormData, o upload QUEBRA. O back-end recebe vazio ou dá erro.\n\n" +
    "Solução: simplesmente NÃO inclua headers."
  );
  log(
    '<span class="vermelho">// ❌ ERRADO — vai quebrar o upload</span><br>' +
    'fetch(url, {<br>' +
    '&nbsp;&nbsp;method: <span class="laranja">"POST"</span>,<br>' +
    '&nbsp;&nbsp;headers: { <span class="laranja">"Content-Type"</span>: <span class="laranja">"application/json"</span> },<br>' +
    '&nbsp;&nbsp;body: formData<br>' +
    '});<br><br>' +

    '<span class="verde">// ✓ CERTO — sem header de Content-Type</span><br>' +
    'fetch(url, {<br>' +
    '&nbsp;&nbsp;method: <span class="laranja">"POST"</span>,<br>' +
    '&nbsp;&nbsp;body: formData<br>' +
    '});<br><br>' +

    '<span class="amarelo">Por quê? O Content-Type do FormData precisa ser:</span><br>' +
    '<span class="laranja">multipart/form-data; boundary=----WebKitFormBoundary...</span><br>' +
    '<span class="amarelo">e esse boundary só o navegador sabe gerar. Se você forçar JSON,</span><br>' +
    '<span class="amarelo">o servidor não consegue ler nem texto nem arquivo.</span>'
  );
}


// ── As 4 estratégias resumidas ───────────────────────────────
function demoEstrategia1() {
  mostrarResultado(
    "ESTRATÉGIA 1: FormData + multer\n\n" +
    "• Front: FormData (texto + arquivo)\n" +
    "• Back: lib multer (ou express-fileupload)\n" +
    "• 1 chamada HTTP só\n" +
    "• Padrão de mercado"
  );
  log(
    '<span class="verde">// FRONT — Variante 1</span><br>' +
    'var dados = <span class="amarelo">new FormData</span>();<br>' +
    'dados.<span class="amarelo">append</span>(<span class="laranja">"nome"</span>, nome);<br>' +
    'dados.<span class="amarelo">append</span>(<span class="laranja">"imagem"</span>, arquivo);<br>' +
    'fetch(url, { method: <span class="laranja">"POST"</span>, body: dados });<br><br>' +
    '<span class="azul">// BACK — Node + Express + multer</span><br>' +
    '<span class="roxo">const</span> upload = multer({ dest: <span class="laranja">"uploads/"</span> });<br>' +
    'app.post(<span class="laranja">"/produtos"</span>, upload.single(<span class="laranja">"imagem"</span>), ...)'
  );
}

function demoEstrategia2() {
  mostrarResultado(
    "ESTRATÉGIA 2: Base64 em JSON\n\n" +
    "• Front: FileReader converte arquivo em string\n" +
    "• Back: só JSON normal (sem libs de upload)\n" +
    "• 1 chamada HTTP, mas ~33% mais pesada\n" +
    "• Simples nos dois lados"
  );
  log(
    '<span class="verde">// FRONT — Variante 2</span><br>' +
    'leitor.<span class="amarelo">readAsDataURL</span>(arquivo);<br>' +
    'leitor.onload = () => {<br>' +
    '&nbsp;&nbsp;fetch(url, {<br>' +
    '&nbsp;&nbsp;&nbsp;&nbsp;method: <span class="laranja">"POST"</span>,<br>' +
    '&nbsp;&nbsp;&nbsp;&nbsp;headers: { <span class="laranja">"Content-Type"</span>: <span class="laranja">"application/json"</span> },<br>' +
    '&nbsp;&nbsp;&nbsp;&nbsp;body: <span class="amarelo">JSON.stringify</span>({ nome, imagem: leitor.result })<br>' +
    '&nbsp;&nbsp;});<br>' +
    '};<br><br>' +
    '<span class="azul">// BACK — só express.json() padrão</span>'
  );
}

function demoEstrategia3() {
  mostrarResultado(
    "ESTRATÉGIA 3: URL externa\n\n" +
    "• Front: campo de URL (admin cola link já hospedado)\n" +
    "• Back: salva só a string da URL\n" +
    "• Mais leve, sem upload\n" +
    "• Dependência de serviço externo (Imgur, Cloudinary...)"
  );
  log(
    '<span class="verde">// FRONT — Variante 3</span><br>' +
    'var dados = { nome, imagem: <span class="laranja">"https://imgur.com/foo.jpg"</span> };<br>' +
    'fetch(url, {<br>' +
    '&nbsp;&nbsp;method: <span class="laranja">"POST"</span>,<br>' +
    '&nbsp;&nbsp;headers: { <span class="laranja">"Content-Type"</span>: <span class="laranja">"application/json"</span> },<br>' +
    '&nbsp;&nbsp;body: <span class="amarelo">JSON.stringify</span>(dados)<br>' +
    '});<br><br>' +
    '<span class="azul">// BACK — recebe e salva como VARCHAR no banco</span>'
  );
}

function demoEstrategia4() {
  mostrarResultado(
    "ESTRATÉGIA 4: Dois requests\n\n" +
    "• Front: faz 2 fetches em sequência\n" +
    "    1) POST /upload (só o arquivo)\n" +
    "    2) POST /produtos (dados + nome devolvido)\n" +
    "• Back: 2 rotas separadas\n" +
    "• Mais complexo, mas separa responsabilidades"
  );
  log(
    '<span class="verde">// FRONT — Variante 4</span><br>' +
    '<span class="azul">// 1) Upload primeiro</span><br>' +
    'var fd = <span class="amarelo">new FormData</span>(); fd.append(<span class="laranja">"imagem"</span>, arquivo);<br>' +
    'var resp = <span class="amarelo">await</span> fetch(<span class="laranja">"/upload"</span>, { method: <span class="laranja">"POST"</span>, body: fd });<br>' +
    'var { nomeArquivo } = <span class="amarelo">await</span> resp.json();<br><br>' +
    '<span class="azul">// 2) Cadastrar produto com o nome devolvido</span><br>' +
    '<span class="amarelo">await</span> fetch(<span class="laranja">"/produtos"</span>, {<br>' +
    '&nbsp;&nbsp;method: <span class="laranja">"POST"</span>,<br>' +
    '&nbsp;&nbsp;headers: { <span class="laranja">"Content-Type"</span>: <span class="laranja">"application/json"</span> },<br>' +
    '&nbsp;&nbsp;body: <span class="amarelo">JSON.stringify</span>({ nome, imagem: nomeArquivo })<br>' +
    '});'
  );
}
