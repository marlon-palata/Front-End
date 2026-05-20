/* ==========================================================
   CADASTRO.JS — Lógica da página de Cadastro (cadastro.html)

   ROADMAP DESTE ARQUIVO:
   [✔] Aula 10 — Bloco 1: preencherTabela() lista pratos do banco.
                 configurarFormulario() valida e envia via POST /produtos.
                 Validações: nome (mín. 3 chars), descrição, preço positivo,
                 categoria obrigatória.
   [✔] Aula 10 — Bloco 2: editarPrato(id) preenche o form via GET /produtos/:id.
                 excluirPrato(id) remove via DELETE /produtos/:id com modal
                 de confirmação.
   [ ] Futuro  — uploadImagem(): campo file + POST multipart/form-data.
                 Quando ativo, produto.imagem vai para src/images/ no servidor.
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  preencherTabela();      // carrega a lista de pratos ao abrir a página
  configurarFormulario(); // ativa validação e submit do formulário
});


// ─────────────────────────────────────────────────────────────────────────────
// preencherTabela()
// Aula 10 — Bloco 1:
//   Lê todos os pratos via GET /produtos (api.js) e monta as linhas da tabela.
//   Chamada no DOMContentLoaded e após cada cadastro/edição/exclusão.
//
//   Por que mostrar na tabela e não em cards?
//   A tela de cadastro é para o admin gerenciar o cardápio — tabela é mais
//   eficiente para ver muitos registros e comparar dados.
// ─────────────────────────────────────────────────────────────────────────────
async function preencherTabela() {
  const tbody     = document.querySelector("#corpo-tabela");
  const dataSpan  = document.querySelector("#data-tabela");
  if (!tbody) return;

  tbody.innerHTML = "<tr><td colspan='7' class='tabela-carregando'>Carregando...</td></tr>";

  try {
    // ── FETCH API em ação — GET /produtos ──────────────────────────────────
    const produtos = await buscarProdutos(); // HTTP GET → /produtos

    if (dataSpan) {
      dataSpan.textContent = new Date().toLocaleString("pt-BR");
    }

    if (produtos.length === 0) {
      tbody.innerHTML = "<tr><td colspan='7' class='tabela-vazia'>Nenhum prato cadastrado.</td></tr>";
      return;
    }

    tbody.innerHTML = "";

    produtos.forEach(function (produto, indice) {
      const tr = document.createElement("tr");

      const disponivelTexto = produto.disponivel ? "✔ Sim" : "✖ Não";
      const disponivelClasse = produto.disponivel ? "status-disponivel" : "status-indisponivel";
      const precoFormatado = `R$ ${parseFloat(produto.preco).toFixed(2).replace(".", ",")}`;
      const catFormatada = produto.categoria
        ? produto.categoria.charAt(0).toUpperCase() + produto.categoria.slice(1)
        : "—";

      tr.innerHTML =
        `<td>${indice + 1}</td>` +
        `<td><strong>${produto.nome}</strong></td>` +
        `<td>${catFormatada}</td>` +
        `<td class="preco-tabela">${precoFormatado}</td>` +
        `<td class="${disponivelClasse}">${disponivelTexto}</td>` +
        // ── Bloco 2: botões de ação ──────────────────────────────────────────
        `<td class="acoes-tabela">` +
          `<button class="btn-editar" onclick="editarPrato(${produto.id})">✏ Editar</button>` +
          `<button class="btn-excluir" onclick="excluirPrato(${produto.id}, '${produto.nome.replace(/'/g, "\\'")}')">✕ Excluir</button>` +
        `</td>`;

      tbody.appendChild(tr);
    });

  } catch (erro) {
    tbody.innerHTML = `<tr><td colspan='7' class='tabela-erro'>Erro ao carregar: ${erro.message}</td></tr>`;
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// configurarFormulario()
// Aula 10 — Bloco 1:
//   Ouve o submit do #form-cadastro. Valida os campos antes de enviar.
//   Se válido: chama cadastrarProduto() (POST) ou editarProduto() (PUT).
//   Se inválido: exibe mensagem de erro abaixo do campo correspondente.
//
// Como distinguir cadastro de edição?
//   O form tem data-editando="<id>" quando está em modo edição.
//   Se o atributo não existir (ou for ""), é um cadastro novo.
// ─────────────────────────────────────────────────────────────────────────────
function configurarFormulario() {
  const form = document.querySelector("#form-cadastro");
  if (!form) return;

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    limparErros();

    // Leitura dos campos
    const nome       = document.querySelector("#nome-prato").value.trim();
    const descricao  = document.querySelector("#desc-prato").value.trim();
    const precoRaw   = document.querySelector("#preco-prato").value;
    const categoria  = document.querySelector("#categoria-prato").value;
    const dispRadio  = document.querySelector("input[name='disponivel']:checked");
    const disponivel = dispRadio ? dispRadio.value === "true" : true;

    // Validações
    let valido = true;

    if (nome.length < 3) {
      exibirErro("erro-nome", "Nome deve ter pelo menos 3 caracteres.");
      valido = false;
    }
    if (!descricao) {
      exibirErro("erro-desc", "Descrição é obrigatória.");
      valido = false;
    }
    const preco = parseFloat(precoRaw);
    if (isNaN(preco) || preco <= 0) {
      exibirErro("erro-preco", "Informe um preço válido e maior que zero.");
      valido = false;
    }
    if (!categoria) {
      exibirErro("erro-categoria", "Selecione uma categoria.");
      valido = false;
    }

    if (!valido) {
      exibirFeedback("Corrija os campos destacados antes de salvar.", "erro");
      return;
    }

    const dados = { nome, descricao, preco, categoria, disponivel };
    const idEditando = form.getAttribute("data-editando");
    const btnSalvar  = form.querySelector("button[type='submit']");

    btnSalvar.disabled    = true;
    btnSalvar.textContent = "Salvando...";

    try {
      if (idEditando) {
        // ── FETCH API em ação — PUT /produtos/:id ──────────────────────────
        await editarProduto(idEditando, dados); // HTTP PUT → /produtos/:id
        exibirFeedback(`"${nome}" atualizado com sucesso!`, "sucesso");
        form.removeAttribute("data-editando");
        btnSalvar.textContent = "✔ Salvar Prato";
      } else {
        // ── FETCH API em ação — POST /produtos ────────────────────────────
        await cadastrarProduto(dados); // HTTP POST → /produtos
        exibirFeedback(`"${nome}" cadastrado com sucesso!`, "sucesso");
      }

      form.reset();
      await preencherTabela(); // atualiza a tabela com o novo estado do banco

    } catch (erro) {
      exibirFeedback(`Erro ao salvar: ${erro.message}`, "erro");
    } finally {
      btnSalvar.disabled    = false;
      if (!idEditando) btnSalvar.textContent = "✔ Salvar Prato";
    }
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// editarPrato(id)
// Aula 10 — Bloco 2:
//   Busca o prato pelo ID via GET /produtos/:id e preenche o formulário.
//   Muda o botão para "✏ Salvar Edição" e salva o ID em data-editando.
//   O submit de configurarFormulario() detecta data-editando e faz PUT.
// ─────────────────────────────────────────────────────────────────────────────
async function editarPrato(id) {
  const form = document.querySelector("#form-cadastro");
  if (!form) return;

  try {
    // ── FETCH API em ação — GET /produtos/:id ─────────────────────────────
    const produto = await buscarProdutoPorId(id); // HTTP GET → /produtos/:id

    document.querySelector("#nome-prato").value      = produto.nome;
    document.querySelector("#desc-prato").value      = produto.descricao;
    document.querySelector("#preco-prato").value     = produto.preco;
    document.querySelector("#categoria-prato").value = produto.categoria || "";

    const radioDisponivel = document.querySelector(
      `input[name='disponivel'][value='${produto.disponivel ? "true" : "false"}']`
    );
    if (radioDisponivel) radioDisponivel.checked = true;

    form.setAttribute("data-editando", id);
    form.querySelector("button[type='submit']").textContent = "✏ Salvar Edição";

    // Rola suavemente para o formulário
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    exibirFeedback(`Editando: "${produto.nome}". Altere os campos e clique em Salvar Edição.`, "info");

  } catch (erro) {
    exibirFeedback(`Erro ao carregar prato: ${erro.message}`, "erro");
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// excluirPrato(id, nome)
// Aula 10 — Bloco 2:
//   Usa o modal customizado #modal-excluir (mesmo padrão do modal de fechar conta)
//   para confirmar a exclusão. Se confirmado: DELETE /produtos/:id.
// ─────────────────────────────────────────────────────────────────────────────
function excluirPrato(id, nome) {
  const modal    = document.querySelector("#modal-excluir");
  const msgModal = document.querySelector("#modal-excluir-msg");
  const btnConf  = document.querySelector("#btn-confirmar-excluir");
  const btnCanc  = document.querySelector("#btn-cancelar-excluir");
  if (!modal) return;

  // Personaliza a mensagem com o nome do prato
  if (msgModal) {
    msgModal.textContent = `Tem certeza que deseja excluir "${nome}"? Esta ação não pode ser desfeita.`;
  }

  modal.style.display = "flex";

  // Remove listeners anteriores para evitar duplicatas
  const btnConfNovo = btnConf.cloneNode(true);
  const btnCancNovo = btnCanc.cloneNode(true);
  btnConf.replaceWith(btnConfNovo);
  btnCanc.replaceWith(btnCancNovo);

  btnCancNovo.addEventListener("click", function () {
    modal.style.display = "none";
  });

  btnConfNovo.addEventListener("click", async function () {
    modal.style.display = "none";
    try {
      // ── FETCH API em ação — DELETE /produtos/:id ──────────────────────
      await excluirProduto(id); // HTTP DELETE → /produtos/:id
      exibirFeedback(`"${nome}" removido do cardápio.`, "sucesso");
      await preencherTabela();
    } catch (erro) {
      exibirFeedback(`Erro ao excluir: ${erro.message}`, "erro");
    }
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// Helpers de UI
// ─────────────────────────────────────────────────────────────────────────────

function exibirErro(idElemento, mensagem) {
  const elem = document.querySelector(`#${idElemento}`);
  if (elem) elem.textContent = mensagem;
}

function limparErros() {
  document.querySelectorAll(".msg-erro").forEach(function (e) { e.textContent = ""; });
}

function exibirFeedback(mensagem, tipo) {
  const area = document.querySelector("#feedback-formulario");
  if (!area) return;
  area.textContent  = mensagem;
  area.className    = `feedback-${tipo}`;
  area.style.display = "block";
  // Feedback de sucesso some depois de 4 segundos
  if (tipo === "sucesso") {
    setTimeout(function () { area.style.display = "none"; }, 4000);
  }
}
