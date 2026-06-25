/* ==========================================================
   CADASTRO.JS — Lógica da página de Cadastro de Prato (cadastro.html)

   ROADMAP DESTE ARQUIVO:
   [✔] Aula 10 — configurarFormularioCadastro(): captura o submit do
                   formulário, monta um FormData (texto + arquivo) e
                   envia via cadastrarProduto() (POST /produtos do api.js).
                 ⚠ FRONT GENÉRICO: este arquivo apenas COLETA os campos e
                   ENVIA. O formato exato esperado pelo back-end é combinado
                   em sala — ver o bloco "PONTO DE AJUSTE COM A TURMA" abaixo.
   [ ] Futuro  — Validação visual campo a campo (borda vermelha no inválido).
                 Pré-visualização da imagem antes de enviar.
                 Limpar o formulário e redirecionar ao cardápio após sucesso.

   Carregado DEPOIS de global.js e api.js (depende de cadastrarProduto).
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  configurarFormularioCadastro();
});

// ─────────────────────────────────────────────────────────────────────────────
// configurarFormularioCadastro()                                          NEW
// Aula 10: escuta o "submit" do formulário e envia o prato ao servidor.
//
// Por que escutar "submit" e não "click" no botão?
//   O evento submit cobre tanto o clique no botão quanto o Enter no campo —
//   é o evento certo para formulários.
//
// event.preventDefault():
//   Sem isso, o navegador recarrega a página ao enviar o formulário
//   (comportamento padrão do HTML). Queremos controlar o envio pelo JS.
// ─────────────────────────────────────────────────────────────────────────────
function configurarFormularioCadastro() {
  const form = document.querySelector("#form-cadastro");
  if (!form) return;

  const feedback = document.querySelector("#feedback-cadastro");
  const botao    = document.querySelector("#btn-cadastrar");

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // impede o reload padrão do formulário

    // ── 1. COLETAR os campos do formulário ───────────────────────────────────
    // Lemos cada campo pelo id. Esses valores vão para o FormData abaixo.
    const nome      = document.querySelector("#nome").value.trim();
    const descricao = document.querySelector("#descricao").value.trim();
    const preco     = document.querySelector("#preco").value;
    const categoria = document.querySelector("#categoria").value;
    const inputImg  = document.querySelector("#imagem");
    const arquivo   = inputImg.files[0]; // o arquivo escolhido (ou undefined)

    // ── 2. VALIDAÇÃO simples no front ────────────────────────────────────────
    // O back-end também valida — mas validar aqui evita requisições inúteis
    // e dá feedback imediato ao usuário.
    if (!nome || !descricao || !preco || !categoria) {
      mostrarFeedback("Preencha todos os campos obrigatórios.", "erro");
      return;
    }

    // ┌─────────────────────────────────────────────────────────────────────┐
    // │ PONTO DE AJUSTE COM A TURMA                                          │
    // │                                                                     │
    // │ FormData é o "pacote" que aceita texto E arquivo no mesmo envio.    │
    // │ Cada .append(chave, valor) adiciona um campo ao pacote.            │
    // │                                                                     │
    // │ ⚠ As CHAVES abaixo (nome, descricao, preco, categoria, imagem)     │
    // │   precisam BATER com o que o BACK-END de vocês espera receber.     │
    // │   Cada grupo fez o back de um jeito — ajustem aqui conforme o de    │
    // │   vocês. Se o back espera "foto" em vez de "imagem", troquem aqui.  │
    // └─────────────────────────────────────────────────────────────────────┘
    const dados = new FormData();
    dados.append("nome", nome);
    dados.append("descricao", descricao);
    dados.append("preco", preco);
    dados.append("categoria", categoria);
    if (arquivo) {
      dados.append("imagem", arquivo); // só anexa se o usuário escolheu uma foto
    }

    // ── 3. ENVIAR ao servidor ────────────────────────────────────────────────
    botao.disabled    = true;
    botao.textContent = "Enviando...";
    mostrarFeedback("", "");

    try {
      // cadastrarProduto() (api.js) faz o POST /produtos com o FormData.
      // Lembrete: api.js NÃO coloca Content-Type — o navegador define sozinho.
      const resposta = await cadastrarProduto(dados);

      mostrarFeedback("✓ Prato cadastrado com sucesso!", "sucesso");
      form.reset(); // limpa os campos

      // (Opcional — descomentar se quiser voltar ao cardápio após cadastrar)
      // setTimeout(function () { window.location.href = "index.html"; }, 1500);

    } catch (erro) {
      // Mostra a mensagem de erro que veio do back-end (ou de rede).
      mostrarFeedback("Erro ao cadastrar: " + erro.message, "erro");
    } finally {
      // finally roda SEMPRE (deu certo ou não) — reabilita o botão.
      botao.disabled    = false;
      botao.textContent = "Cadastrar Prato";
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// mostrarFeedback(texto, tipo)
// Exibe a mensagem de sucesso/erro abaixo do botão.
// tipo: "sucesso" (verde) | "erro" (vermelho) | "" (limpa)
// ─────────────────────────────────────────────────────────────────────────────
function mostrarFeedback(texto, tipo) {
  const feedback = document.querySelector("#feedback-cadastro");
  if (!feedback) return;

  feedback.textContent = texto;
  feedback.className   = "feedback-cadastro"; // reseta as classes
  if (tipo) feedback.classList.add(tipo);
}
