// Recebe o total de itens do pedido (quem guarda esse estado é o App).
function Header({ totalItens }) {
  return (
    <header className="header">
      <h1>TechFood — Sabor & Saber</h1>
      <p>O sabor que ensina</p>
      <p className="carrinho">Itens no pedido: {totalItens}</p>
    </header>
  );
}
export default Header;
