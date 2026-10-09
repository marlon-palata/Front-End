import Header from "./components/Header";
import CardPrato from "./components/CardPrato";
import Rodape from "./components/Rodape";
import "./App.css";

const cardapio = [
  { id: 1, nome: "Feijoada", preco: 42.9, categoria: "Prato principal", descricao: "Feijão preto com carnes, arroz, couve e farofa." },
  { id: 2, nome: "Moqueca", preco: 49.9, categoria: "Prato principal", descricao: "Peixe no leite de coco com dendê e pimentões." },
  { id: 3, nome: "Pudim", preco: 15.0, categoria: "Sobremesa", descricao: "Pudim de leite condensado com calda de caramelo." },
  { id: 4, nome: "Guaraná", preco: 8.5, categoria: "Bebida", descricao: "Guaraná gelado, lata de 350 ml." },
  { id: 5, nome: "Brigadeiro", preco: 6.0, categoria: "Sobremesa", descricao: "Brigadeiro de chocolate belga." },
];

function App() {
  return (
    <main className="app">
      <Header />
      <p className="contador">Cardápio com {cardapio.length} itens</p>
      <section className="cardapio">
        {cardapio.map((prato) => (
          <CardPrato
            key={prato.id}
            nome={prato.nome}
            preco={prato.preco}
            categoria={prato.categoria}
            descricao={prato.descricao}
          />
        ))}
      </section>
      <Rodape />
    </main>
  );
}

export default App;
