/* ==========================================================
   API-ECO.JS — Comunicação com o servidor (EcoCycle - Aula 10)
   VARIANTE 4: Dois requests (upload + cadastro)
   ========================================================== */

var API_URL = "http://localhost:3000";

// ─────────────────────────────────────────────────────────────────────────────
// uploadImagemNoticia(arquivo)            VARIANTE 4 — chamada 1/2
// POST /upload — envia apenas o arquivo. Back devolve o nome salvo.
// ─────────────────────────────────────────────────────────────────────────────
async function uploadImagemNoticia(arquivo) {
  var formData = new FormData();
  formData.append("imagem", arquivo);

  var response = await fetch(API_URL + "/upload", {
    method: "POST",
    body: formData, // SEM Content-Type (multipart com boundary)
  });
  var resposta = await response.json();
  if (!response.ok) throw new Error(resposta.erro || "Erro no upload");
  return resposta;
}

// ─────────────────────────────────────────────────────────────────────────────
// cadastrarNoticia(dados)                 VARIANTE 4 — chamada 2/2
// POST /noticias — JSON normal com o nome da imagem que o upload devolveu.
// ─────────────────────────────────────────────────────────────────────────────
async function cadastrarNoticia(dados) {
  var response = await fetch(API_URL + "/noticias", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  var resposta = await response.json();
  if (!response.ok) throw new Error(resposta.erro || "Erro " + response.status);
  return resposta;
}
