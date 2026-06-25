# EcoCycle — Aula 10 — Variante 4: Dois requests

> Use se o seu back tem **duas rotas separadas** — uma só pra upload,
> outra só pra cadastrar a notícia.

## Como funciona

```
1ª chamada: POST /upload  (FormData só do arquivo)
            ← back devolve { nomeArquivo: "abc.jpg" }
2ª chamada: POST /noticias (JSON com titulo, resumo... e imagem: "abc.jpg")
            ← back devolve a notícia criada
```

## O que muda nesta variante

- `api-eco.js`: tem **duas funções** — `uploadImagemNoticia` e `cadastrarNoticia`.
- `cadastro-eco.js`: faz dois `await` em sequência.

## Como o back precisa ser

```js
// 1) Rota só de upload
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("imagem"), (req, res) => {
  res.json({ nomeArquivo: req.file.filename });
});

// 2) Rota só de cadastro
app.post("/noticias", (req, res) => {
  const { titulo, resumo, categoria, imagem } = req.body;
  // imagem aqui é só o NOME do arquivo (ex: "abc.jpg"), não o arquivo
});
```

## ⚠ Cuidados

- **Imagens órfãs**: se o upload der certo mas o cadastro falhar, o arquivo
  fica salvo sem notícia ligada. Considere uma rotina de limpeza.
- **Ordem**: upload sempre **primeiro**.
