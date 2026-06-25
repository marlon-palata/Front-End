/* ==========================================================
   CADASTRO-ECO.JS — Formulário de cadastro de notícia (EcoCycle)
   VARIANTE 1: FormData + multer

   Escuta o submit do formulário, monta os dados e envia via cadastrarNoticia().
   Carregado DEPOIS de eco.js e api-eco.js.
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  configurarFormularioNoticia();
});

function mostrarFeedbackNoticia(texto, tipo) {
  var el = document.getElementById("feedback-cadastro-noticia");
  if (!el) return;
  el.textContent = texto;
  el.className = "feedback-cadastro-noticia";
  if (tipo) el.classList.add(tipo);
}


function configurarFormularioNoticia() {
  var form = document.getElementById("form-cadastro-noticia");
  if (!form) return;
  var botao = document.getElementById("btn-cadastrar-noticia");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // 1. Coletar campos
    var titulo    = document.getElementById("input-titulo-noticia").value.trim();
    var resumo    = document.getElementById("input-resumo-noticia").value.trim();
    var categoria = document.getElementById("input-categoria-noticia").value;
    var arquivo   = document.getElementById("input-imagem-noticia").files[0];

    // 2. Validação simples
    if (!titulo || !resumo || !categoria) {
      mostrarFeedbackNoticia("Preencha todos os campos obrigatórios.", "erro");
      return;
    }

    botao.disabled = true;
    botao.textContent = "Enviando...";
    mostrarFeedbackNoticia("", "");

    try {
      // 3. Montar FormData (texto + arquivo no mesmo pacote)
      // ⚠ As chaves abaixo precisam bater com o que o back-end espera.
      //    Ajuste aqui conforme o multer.fields()/single() do seu back.
      var dados = new FormData();
      dados.append("titulo", titulo);
      dados.append("resumo", resumo);
      dados.append("categoria", categoria);
      if (arquivo) dados.append("imagem", arquivo);

      // 4. Enviar — api-eco.js cuida do fetch
      await cadastrarNoticia(dados);

      mostrarFeedbackNoticia("✓ Notícia publicada com sucesso!", "sucesso");
      form.reset();
    } catch (erro) {
      mostrarFeedbackNoticia("Erro ao publicar: " + erro.message, "erro");
    } finally {
      botao.disabled = false;
      botao.textContent = "Publicar Notícia";
    }
  });
}
