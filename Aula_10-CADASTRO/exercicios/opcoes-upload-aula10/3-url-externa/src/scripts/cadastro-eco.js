/* ==========================================================
   CADASTRO-ECO.JS — Formulário de cadastro de notícia (EcoCycle)
   VARIANTE 3: URL externa

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

    var titulo    = document.getElementById("input-titulo-noticia").value.trim();
    var resumo    = document.getElementById("input-resumo-noticia").value.trim();
    var categoria = document.getElementById("input-categoria-noticia").value;
    var imagemUrl = document.getElementById("input-imagem-noticia").value.trim();

    if (!titulo || !resumo || !categoria) {
      mostrarFeedbackNoticia("Preencha todos os campos obrigatórios.", "erro");
      return;
    }

    botao.disabled = true;
    botao.textContent = "Enviando...";
    mostrarFeedbackNoticia("", "");

    try {
      // Tudo é texto. Imagem é só uma URL (string vazia vira null).
      var dados = {
        titulo: titulo,
        resumo: resumo,
        categoria: categoria,
        imagem: imagemUrl || null,
      };

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
