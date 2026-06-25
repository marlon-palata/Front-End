# EcoCycle — Aula 10 — Variante 1: FormData + multer

> Use esta variante se o seu back tem **multer** (ou similar).

## O que muda nesta variante

- `index.html`: form com `<input type="file">` + `enctype="multipart/form-data"`.
- `cadastro-eco.js`: monta um `FormData` e o envia direto no body.
- `api-eco.js`: fetch POST com `body: formData` **sem header Content-Type**.

## Como o back precisa ser (resumo)

```js
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

app.post("/noticias", upload.single("imagem"), (req, res) => {
  // req.body.titulo, req.body.resumo, req.body.categoria
  // req.file.filename  ← nome do arquivo salvo
});
```

## ⚠ Regra de ouro

**Nunca** defina `Content-Type: application/json` em fetch com `FormData`.
O navegador precisa gerar o `multipart/form-data; boundary=...` sozinho.
