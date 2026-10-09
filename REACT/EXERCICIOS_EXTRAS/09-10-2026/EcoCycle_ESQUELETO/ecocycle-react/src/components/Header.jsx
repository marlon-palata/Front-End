// TODO T11: receba as props totalKg e totalValor
// TODO T12 (desafio): receba também onLimpar
function Header() {
  // TODO T11: crie valorFormatado com totalValor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  return (
    <header className="header">
      {/* TODO T3: <h1>♻ EcoCycle</h1> e <p>Coleta seletiva que vale a pena</p> */}
      {/* TODO T11: <p>Coletado: {totalKg} kg · Valor: {valorFormatado}</p> */}
      {/* TODO T12 (desafio): botão "Zerar coleta" com className="btn-secundario" e onClick={onLimpar} */}
    </header>
  );
}

export default Header;
