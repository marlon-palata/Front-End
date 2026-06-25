# EcoCycle — Aula 10 — Variante 3: URL externa

> Use se a imagem vai estar **hospedada em outro lugar** (Imgur, Cloudinary...)
> e o seu back só guarda o link.

## O que muda nesta variante

- `index.html`: campo é `<input type="url">` — o admin **cola** o link.
- `cadastro-eco.js`: nada de FileReader nem FormData — só pega a string.
- `api-eco.js`: JSON normal (igual às outras funções do projeto).

## Como o back precisa ser

```js
app.post("/noticias", (req, res) => {
  const { titulo, resumo, categoria, imagem } = req.body;
  // imagem é uma URL: "https://imgur.com/foo.jpg" ou null
  // INSERT INTO noticia (titulo, ..., imagem) VALUES (?, ..., ?)
});
```

No banco, basta uma coluna `VARCHAR(500) NULL`.

## Onde a galera costuma hospedar a imagem antes

- Imgur (https://imgur.com) — upload anônimo, link público.
- Cloudinary, ImgBB, Postimages.
- GitHub (na pasta do repo, usando o link "raw").
