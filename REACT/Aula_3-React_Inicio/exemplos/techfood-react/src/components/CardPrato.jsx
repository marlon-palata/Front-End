import { useState } from "react";
function CardPrato({ nome, preco, categoria, onAdicionar }) {
  // Estado LOCAL: cada card tem a sua própria quantidade, independente dosoutros.
  const [quantidade, setQuantidade] = useState(1);
  const precoFormatado = preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  function diminuir() {
    // Regra de negócio: não existe pedido com quantidade menor que 1.
    if (quantidade > 1) {
      setQuantidade(quantidade - 1);
    }
  }
  function aumentar() {
    setQuantidade(quantidade + 1);
  }
  function adicionar() {
    // Avisa o pai (App) quantos itens entraram e volta a quantidade para 1.
    onAdicionar(quantidade);
    setQuantidade(1);
  }
  return (
    <article className="card-prato">
      <span className="categoria">{categoria}</span>
      <h2>{nome}</h2>
      <p className="preco">{precoFormatado}</p>
      <div className="quantidade">
        <button
          type="button"
          onClick={diminuir}
          aria-label={`Diminuir
quantidade de ${nome}`}
        ></button>
        <span>{quantidade}</span>
        <button
          type="button"
          onClick={aumentar}
          aria-label={`Aumentar
quantidade de ${nome}`}
        ></button>
      </div>
      <button type="button" className="btn-adicionar" onClick={adicionar}>
        Adicionar ao pedido
      </button>
    </article>
  );
}
export default CardPrato;
