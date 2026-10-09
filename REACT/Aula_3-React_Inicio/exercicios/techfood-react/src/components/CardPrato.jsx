function CardPrato({ nome, preco, categoria, descricao }) {
  const precoFormatado = preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <article className="card-prato">
      <span className="categoria">{categoria}</span>
      <h2>
        {categoria === "Sobremesa" ? "🍰 " : ""}
        {nome}
      </h2>
      <p className="preco">{precoFormatado}</p>
      <p className="descricao">{descricao}</p>
    </article>
  );
}

export default CardPrato;
