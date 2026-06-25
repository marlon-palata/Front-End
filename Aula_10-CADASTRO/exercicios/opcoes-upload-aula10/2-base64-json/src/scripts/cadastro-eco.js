/* ==========================================================
   CADASTRO-ECO.JS — Formulário de cadastro de notícia (EcoCycle)
   VARIANTE 2: Base64 em JSON

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
    var arquivo   = document.getElementById("input-imagem-noticia").files[0];

    if (!titulo || !resumo || !categoria) {
      mostrarFeedbackNoticia("Preencha todos os campos obrigatórios.", "erro");
      return;
    }

    botao.disabled = true;
    botao.textContent = "Enviando...";
    mostrarFeedbackNoticia("", "");

    try {
      // Converter imagem em base64 (se houver)
      var imagemBase64 = null;
      if (arquivo) {
        imagemBase64 = await arquivoParaBase64(arquivo);
        // Se o back espera só o conteúdo (sem o "data:image/...;base64,"),
        // descomente: imagemBase64 = imagemBase64.split(",")[1];
      }

      var dados = {
        titulo: titulo,
        resumo: resumo,
        categoria: categoria,
        imagem: imagemBase64, // string base64 ou null
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

// FileReader.readAsDataURL é assíncrono — embrulhamos numa Promise pra usar com await.
function arquivoParaBase64(arquivo) {
  return new Promise(function (resolve, reject) {
    var leitor = new FileReader();
    leitor.onload = function () { resolve(leitor.result); };
    leitor.onerror = function () { reject(new Error("Falha ao ler arquivo.")); };
    leitor.readAsDataURL(arquivo);
  });
}
