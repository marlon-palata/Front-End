// T11: o Header recebe os totais por props (quem guarda é o App)
function Header({ totalKg, totalValor, onLimpar }) {
  const valorFormatado = totalValor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <header className="header">
      <h1>♻ EcoCycle</h1>
      <p>Coleta seletiva que vale a pena</p>
      <p>
        Coletado: {totalKg} kg · Valor: {valorFormatado}
      </p>
      {/* T12: o clique chama a função que veio do App */}
      <button type="button" className="btn-secundario" onClick={onLimpar}>
        Zerar coleta
      </button>
    </header>
  );
}

export default Header;
