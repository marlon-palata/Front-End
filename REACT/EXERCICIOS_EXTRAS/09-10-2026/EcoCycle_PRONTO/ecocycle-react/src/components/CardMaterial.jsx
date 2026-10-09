import { useState } from "react";

// T9: limite máximo de kg por registro
const KG_MAXIMO = 20;

// T6: nova prop perigoso
function CardMaterial({ nome, lixeira, precoKg, perigoso, dica, onRegistrar }) {
  // T6: formata o número como dinheiro brasileiro (0.5 -> R$ 0,50)
  const precoFormatado = precoKg.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  // T9: estado — quando muda pelo setKg, o React redesenha o card
  const [kg, setKg] = useState(1);
  // T10: true/false — a dica está aberta?
  const [mostrarDica, setMostrarDica] = useState(false);

  function diminuir() {
    if (kg > 1) {
      setKg(kg - 1);
    }
  }

  function aumentar() {
    if (kg < KG_MAXIMO) {
      setKg(kg + 1);
    }
  }

  // T11: avisa o App (chama a função que veio por prop) e volta para 1 kg
  function registrar() {
    onRegistrar(kg, precoKg);
    setKg(1);
  }

  return (
    <article className="card">
      <span className="lixeira">Lixeira {lixeira}</span>
      <h2>
        {/* T6: ternário — se for perigoso mostra o aviso, senão nada */}
        {perigoso ? "⚠ " : ""}
        {nome}
      </h2>
      <p className="preco">{precoFormatado} por kg</p>

      {/* T10: && — só mostra a dica se mostrarDica for true */}
      {mostrarDica && <p className="dica">{dica}</p>}
      {/* T10: ! inverte o valor a cada clique */}
      <button type="button" className="btn-secundario" onClick={() => setMostrarDica(!mostrarDica)}>
        {mostrarDica ? "Esconder dica" : "Ver dica"}
      </button>

      {/* T8: onClick recebe o NOME da função (sem parênteses) */}
      <div className="quantidade">
        <button type="button" onClick={diminuir}>
          −
        </button>
        <span>{kg} kg</span>
        <button type="button" onClick={aumentar}>
          +
        </button>
      </div>

      <button type="button" className="btn-principal" onClick={registrar}>
        Registrar coleta
      </button>
    </article>
  );
}

export default CardMaterial;
